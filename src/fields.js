export function getFields() {
	return {
		PortIdAll: {
			type: 'dropdown',
			label: 'Port ID',
			id: 'port',
			choices: this.PORTLIST_ALL,
			default: this.PORTLIST_ALL !== undefined && this.PORTLIST_ALL.length > 0 ? this.PORTLIST_ALL[0].id : '',
		},
		PortIdPlay: {
			type: 'dropdown',
			label: 'Port ID',
			id: 'port',
			choices: this.PORTLIST_PLAY,
			default: this.PORTLIST_PLAY !== undefined && this.PORTLIST_PLAY.length > 0 ? this.PORTLIST_PLAY[0].id : '',
		},
		PortIdRec: {
			type: 'dropdown',
			label: 'Port ID',
			id: 'port',
			choices: this.PORTLIST_REC,
			default: this.PORTLIST_REC !== undefined && this.PORTLIST_REC.length > 0 ? this.PORTLIST_REC[0].id : '',
		},
	}
}
