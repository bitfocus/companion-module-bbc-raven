export function initVariables() {
    let self = this
    let variables = [
        { variableId: 'machine_name', name: 'Machine name' },
    ]

    for (var playPort of self.PORTLIST_PLAY) {
        if (playPort.id != 0) {
          variables.push({
              name: 'Play Port ' + playPort.id + ' Friendly Name',
              variableId: 'play_port_' + playPort.id + '_friendly_name',
          })

          variables.push({
              name: 'Play Port ' + playPort.id + ' State',
              variableId: 'play_port_' + playPort.id + '_state',
          })

          variables.push({
              name: 'Play Port ' + playPort.id + ' Clip Name',
              variableId: 'play_port_' + playPort.id + '_clip_name',
          })

          variables.push({
              name: 'Play Port ' + playPort.id + ' Clip Unique Material Identifier',
              variableId: 'play_port_' + playPort.id + '_clip_umid',
          })
        }
    }

    for (var recPort of self.PORTLIST_REC) {
        if (recPort.id != 0) {
          variables.push({
              name: 'Record Port ' + recPort.id + ' Friendly Name',
              variableId: 'record_port_' + recPort.id + '_friendly_name',
          })

          variables.push({
              name: 'Record Port ' + playPort.id + ' State',
              variableId: 'record_port_' + playPort.id + '_state',
          })
        }
    }

    this.setVariableDefinitions(variables)
}

export function checkVariables() {
    let self = this

    let variables = {}

    try {
        for (var playPort of self.PORTLIST_PLAY) {
           if (playPort.id != 0) {
	           variables['play_port_' + playPort.id + '_friendly_name'] = playPort.label
           }
        }

        for (var recPort of self.PORTLIST_REC) {
           if (recPort.id != 0) {
	           variables['record_port_' + recPort.id + '_friendly_name'] = recPort.label
           }
        }

        self.setVariableValues(variables)
    } catch (error) {
        self.log('error', 'Error setting variables: ' + error)
    }
}
