export function updateFeedbacks() {
	let self = this
	let feedbacks = {
		is_playing: {
			type: 'advanced',
			name: 'Port is playing out',
			description: 'If port is currently playing out, highlight button',
			defaultStyle: {
				color: self?.color_black,
				bgcolor: self?.color_yellow,
			},
			options: [
				{
					type: 'dropdown',
					label: 'Port ID',
					id: 'port',
					choices: this.PORTLIST_PLAY,
				},
			],
			callback: function (feedback) {
				const portstate = self?.states?.['portstates']?.[feedback?.options?.port]
				if (portstate == 'PLAYINGP' || portstate == 'LININGUPP') {
					return { color: self?.color_white, bgcolor: self?.color_green }
				}
			},
		},
		is_paused: {
			type: 'advanced',
			name: 'Port is paused',
			description: 'If currently paused, highlight button',
			options: [
				{
					type: 'dropdown',
					label: 'Port ID',
					id: 'port',
					choices: this.PORTLIST_PLAY,
				},
			],
			callback: function (feedback) {
				const portstate = self?.states?.['portstates']?.[feedback?.options?.port]
				if (portstate == 'ALLOCATEDP' || portstate == 'LOADEDP') {
					return { color: self?.color_white, bgcolor: self?.color_green }
				}
			},
		},
		is_idle: {
			type: 'advanced',
			name: 'Port is idle',
			description: 'If currently idle, highlight button as blue (use for stop button)',
			options: [
				{
					type: 'dropdown',
					label: 'Port ID',
					id: 'port',
					choices: this.PORTLIST_ALL,
				},
			],
			callback: function (feedback) {
				const portstate = self?.states?.['portstates']?.[feedback?.options?.port]
				if (portstate == 'IDLEP') {
					return { color: self?.color_white, bgcolor: self?.color_blue }
				}
			},
		},
		is_recording: {
			type: 'advanced',
			name: 'Port is recording',
			description: 'If currently recording, highlight button',
			options: [
				{
					type: 'dropdown',
					label: 'Port ID',
					id: 'port',
					choices: this.PORTLIST_REC,
				},
			],
			callback: function (feedback) {
				const portstate = self?.states?.['portstates']?.[feedback?.options?.port]
				if (portstate == 'RECORDINGP') {
					return { color: self?.color_white, bgcolor: self?.color_red }
				}
			},
		},
		is_monitoring: {
			type: 'advanced',
			name: 'Port is monitoring (E-E)',
			description: 'If currently in monitor mode, highlight button',
			options: [
				{
					type: 'dropdown',
					label: 'Port ID',
					id: 'port',
					choices: this.PORTLIST_REC,
				},
			],
			callback: function (feedback) {
				const portstate = self?.states?.['portstates']?.[feedback?.options?.port]
				if (portstate == 'MONITORINGP') {
					return { color: self?.color_white, bgcolor: self?.color_blue }
				}
			},
		},
	}
	this.setFeedbackDefinitions(feedbacks)
}
