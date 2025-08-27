import { InstanceBase, InstanceStatus, Regex, runEntrypoint, combineRgb } from '@companion-module/base'
import { Client } from 'node-rest-client'
import { updateActions } from './src/actions.js'
import { updateFeedbacks } from './src/feedbacks.js'
import { getFields } from './src/fields.js'
import { getPresets } from './src/presets.js'
import { initVariables, checkVariables } from './src/variables.js'

class BBCRavenInstance extends InstanceBase {
	constructor(internal) {
		super(internal)

		this.updateActions = updateActions.bind(this)
		this.updateFeedbacks = updateFeedbacks.bind(this)
		this.getFields = getFields.bind(this)
		this.getPresets = getPresets.bind(this)
	}

	async init(config) {
		this.config = config

		// init variables
		this.states = {
			portstates: {},
			clipstates: {},
		}
		this.lastnotificationid = 0

		this.updateStatus(InstanceStatus.Connecting, 'Waiting To Connect')
		this.configUpdated(config)
	}

	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'This module allows you to control a BBC Raven video server. Sadly this is an internal product and not yet released outside of the BBC.',
			},
			{
				type: 'static-text',
				id: 'info-compat',
				width: 12,
				label: 'Compatibility',
				value: 'This module will only control a Raven v4 server.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'IP Address / Host Name',
				width: 6,
				default: '',
			},
		]
	}

	async configUpdated(config) {
		this.config = config
		this.destroy()
		this.updateFeedbacks()
		this.updateActions()
		this.initColors()
		this.initConnection()
		this.getPresets()
	}

	initColors = function () {
		this.color_red = combineRgb(177, 18, 17)
		this.color_white = combineRgb(255, 255, 255)
		this.color_black = combineRgb(0, 0, 0)
		this.color_green = combineRgb(34, 131, 41)
		this.color_blue = combineRgb(63, 68, 234)
	}

	initPoller = function () {
		const self = this
		// get the last notification id
		let url = `http://${this.config.host}/api/notifications/getlastid`
		self.client.get(url, function (data) {
			if (data != null) {
				self.lastnotificationid = data['id']
				// we're ready to start the poll
				self.doPoll()
			} else {
				self.log('warn', 'Could not retrieve last notification id from web api')
			}
		})
	}

	send(cmd) {
		let self = this
		if (this.client !== undefined) {
			let url = `http://${this.config.host}${cmd}`
			this.log('debug', `sending API command: ${url}`)
			this.client.get(url, function (data) {
				if (data != 'OK') {
					self.log('warn', `ERROR from raven API: ${data}`)
				}
			})
		}
	}

	destroy = function () {
		this.states = {
			portstates: {},
			clipstates: {},
		}
		this.client = null
	}

	initPorts = function () {
		var self = this
		// we need to fetch the list of machines first - so we can get the hostname of the selected server
		let url = `http://${self.config.host}/api/machine/getall`
		self.client.get(url, function (data, response) {
			if (data != null) {
				let machineName = null
				for (let eachMachine of data) {
					if (self.config.host === eachMachine.ip || eachMachine.ip === '127.0.0.1') {
						machineName = eachMachine.name
					}
				}
				if (machineName) {
					self.setVariableValues({'machine_name': machineName})
					self.log('debug', `getting list of ports for machine '${machineName}'`)
					// fetches a list of ports to use in configuration
					let url = `http://${
						self.config.host
					}/api/portlist/getall?addfriendlymachinenames=1&machinename=${encodeURIComponent(machineName)}`

					// add some default values
					self.PORTLIST_ALL = [{ id: '0', label: 'none' }]
					self.PORTLIST_PLAY = [{ id: '0', label: 'none' }]
					self.PORTLIST_REC = [{ id: '0', label: 'none' }]
					self.client.get(url, function (data, response) {
						if (data != null) {
							for (var i in data) {
								// put it in the all-ports list
								self.PORTLIST_ALL.push({
									id: data[i]['port'],
									label: data[i]['portfriendlyname'],
								})
								if (data[i]['portmode'] == 'play') {
									// add it to the playout list
									self.PORTLIST_PLAY.push({
										id: data[i]['port'],
										label: data[i]['portfriendlyname'],
									})
								} else if (data[i]['portmode'] == 'rec') {
									// add it to the record list
									self.PORTLIST_REC.push({
										id: data[i]['port'],
										label: data[i]['portfriendlyname'],
									})
								}
							}
						}
						self.log('debug', `found ${self.PORTLIST_ALL.length} port(s) on raven server`)

						// now we've got the ports, update actions and feedbacks
						self.updateActions()
						self.updateFeedbacks()
						self.initPortstates()
					})
				}
			}
		})
	}

	initPortstates = function () {
		var self = this
		self.log('debug', 'fetching port status from raven')
		for (var i in self.PORTLIST_ALL) {
			// probe the port for state
			var port = self.PORTLIST_ALL[i]['id']
			if (port != '' && port != '0') {
				let url = `http://${self.config.host}/api/port/get?port=${port}`
				self.client.get(url, function (data) {
					// we've got the portstate - now we can push it into the array
					// - just like the notification does later on
					self.pushPortstate(data)
					self.pushClipState(data)
				})
			}
		}
	}

	initConnection = function () {
		var self = this
		self.client = new Client()
		// only connect when host is defined
		if (self.config.host === undefined || self.config.host == '') {
			return false
		}
		// try to log in - make sure the raven is there
		let url = `http://${self.config.host}/api/hello`
		self.log('debug', 'attempting connection to raven API')
		try {
			// connect to API
			self.client.get(url, function (data, response) {
				if (data == 'Hello, world') {
					self.log('debug', 'connected OK')
					self.updateStatus(InstanceStatus.Ok)
					self.initPorts()
					self.initPoller()
				} else {
					self.log('warn', 'failed to connect to raven API')
					self.updateStatus(InstanceStatus.ConnectionFailure, 'Cannot connect')
				}
			})
		} catch (err) {
			self.log('warn', err)
			self.updateStatus(InstanceStatus.ConnectionFailure, 'Cannot connect')
		}
	}

	doPoll = function () {
		var self = this
		let url = `http://${self.config.host}/api/notifications/get?timeout=20&id=${self.lastnotificationid}`
		if (self.client) {
			self.client.get(url, function (data, response) {
				if (data) {
					//self.log('debug', JSON.stringify(data))
					for (let index in data) {
						if (data[index]['type'] == 'portstatuschanged') {
							self.pushPortstate(data[index]['payload'])
						} else if (data[index]['type'] == 'clipchanged') {
							self.pushClipState(data[index]['payload'])
						} else {
							//self.log('debug', 'Unknown type: ' + JSON.stringify(data[index]))
						}
						// store result of poll time for next call
						if (data[index]['_id'] > self.lastnotificationid) {
							self.lastnotificationid = parseInt(data[index]['_id'])
						}
					}
				}
				// we've either got a notification or it's timed out ... so repeat
				setTimeout(self.doPoll.bind(self), 100)
			})
		}
	}

	pushPortstate = function (state) {
		var self = this
		if (state) {
			var port = state['port']
			var portmode = state['portmode']
			if (portmode == 'play') {
				var state = state['properties']['playportstate']
			} else if (portmode == 'rec') {
				var state = state['properties']['recordportstate']
			}
			// save it
			self.states['portstates'][port] = state
			// raise feedback events
			if (portmode == 'play') {
				self.checkFeedbacks('is_playing')
				self.checkFeedbacks('is_paused')
				self.checkFeedbacks('is_idle')
			} else if (portmode == 'rec') {
				self.checkFeedbacks('is_recording')
				self.checkFeedbacks('is_monitoring')
				self.checkFeedbacks('is_idle')
			}
		}
	}

	pushClipState = function (state) {
		var self = this
		if (state) {
			var port = state['port']
			var portmode = state['portmode']
			if (portmode == 'play') {
				// save it
				//self.states['clipstates'][port] = state['properties']['playumid']
				if (typeof self.states['clipstates'][port] === 'undefined') {
					self.states['clipstates'][port] = {}
				}
				self.states['clipstates'][port]['playumid'] = state['properties']['playumid']
				self.states['clipstates'][port]['clipname'] = state['clipname']
				// raise feedback events
				self.log('debug', 'Clips: ' + JSON.stringify(self.states['clipstates']))
				if (portmode == 'play') {
					//self.checkFeedbacks('is_playing')
					//self.checkFeedbacks('is_paused')
					//self.checkFeedbacks('is_idle')
				}
			}
		}
	}
}

runEntrypoint(BBCRavenInstance, [])
