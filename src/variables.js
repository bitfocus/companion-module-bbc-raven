export function initVariables() {
    let self = this
    let variables = [
        { variableId: 'machine_name', name: 'Machine name' },
    ]

    for (var playPort of self.PORTLIST_PLAY) {
        variables.push({
            name: 'Play Port ' + playPort.id + ' Friendly Name',
            variableId: 'play_port_' + playPort.id + '_friendly_name',
        })
    }

    this.setVariableDefinitions(variables)
}

export function checkVariables() {
    let self = this

    let variables = {}

    try {
        for (var playPort of self.PORTLIST_PLAY) {
           variables.['play_port_' + playPort.id + '_friendly_name'] = playPort.label
        }

        self.setVariableValues(variables)
    } catch (error) {
        self.log('error', 'Error setting variables: ' + error)
    }
}