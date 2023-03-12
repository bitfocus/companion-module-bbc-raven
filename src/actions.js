export function updateActions() {
    let actions = {
        // beep
        beep_startup: {
            name: "Play the startup tune",
            options: [],
            callback: async ({ options }) => {
                this.send(`/api/beep/startup`);
            },
        },

        // config
        config_set: {
            name: "Set configuration properties",
            options: [
                {
                    type: "textinput",
                    label: "Name",
                    id: "configname",
                    required: true,
                    default: "",
                },
                {
                    type: "textinput",
                    label: "Value",
                    id: "configvalue",
                    required: true,
                    default: "",
                },
            ],
            callback: async ({ options }) => {
                const config_data = {};
                config_data[options.configname] = options.configvalue;
                this.send(`/api/config/set?properties=${JSON.stringify(config_data)}`);
            },
        },

        // notifications
        notification_message: {
            name: "Send a message to all users",
            options: [
                {
                    type: "textinput",
                    label: "Message to send",
                    id: "message",
                    required: true,
                    default: "",
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/notifications/message?text=${encodeURIComponent(options.message)}`);
            },
        },

        // record
        record_monitor: {
            name: "Monitor Port (E-E)",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_REC,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/record/monitor?port=${encodeURIComponent(options.port)}`);
            },
        },
        record_stop: {
            name: "Stop Recording",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_REC,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/record/stop?port=${encodeURIComponent(options.port)}`);
            },
        },
        record_start: {
            name: "Start Recording",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_REC,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/record/start?port=${encodeURIComponent(options.port)}`);
            },
        },
        record_chunknow: {
            name: "Chunk recording now",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_REC,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/record/chunknow?port=${encodeURIComponent(options.port)}`);
            },
        },
        record_keyframe: {
            name: "Add keyframe while recording",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_REC,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/record/keyframe?port=${encodeURIComponent(options.port)}`);
            },
        },
        record_grabstill: {
            name: "Grab still while recording",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_REC,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/record/grabstill?port=${encodeURIComponent(options.port)}`);
            },
        },

        // nuget
        nuget_restart: {
            name: "Restart Nuget",
            options: [],
            callback: async ({ options }) => {
                this.send(`/api/os/nugetcontrol?action=restart`);
            },
        },

        // port
        port_togglelock: {
            name: "Toggle the port lock",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_ALL,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/port/toggleportlockstate?port=${encodeURIComponent(options.port)}`);
            },
        },
        port_setlock: {
            name: "Set the port lock",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_ALL,
                },
                {
                    type: "checkbox",
                    label: "Locked",
                    id: "lockstate",
                    default: true,
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/port/setlockstate?port=${encodeURIComponent(options.port)}&state=${encodeURIComponent(
                        options.lockstate ? "1" : "0"
                    )}`
                );
            },
        },
        portsettings_togglemodetype: {
            name: "Toggle the port mode (HD/SD)",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_ALL,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/portsettings/togglemodetype?port=${encodeURIComponent(options.port)}`);
            },
        },

        // playout
        playout_eject: {
            name: "Eject the currently playing clip and clear the playlist",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/eject?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_repeatframes: {
            name: "Repeat the specified number of frames during playout",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "number",
                    label: "Number of frames",
                    id: "framecount",
                    required: true,
                    min: 1,
                    max: 9999,
                    default: 25,
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/repeatframes?port=${encodeURIComponent(options.port)}&framecount=${encodeURIComponent(
                        options.framecount
                    )}`
                );
            },
        },
        playout_dropframes: {
            name: "Drop the specified number of frames during playout",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "number",
                    label: "Number of frames",
                    id: "framecount",
                    required: true,
                    min: 1,
                    max: 9999,
                    default: 25,
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/dropframes?port=${encodeURIComponent(options.port)}&framecount=${encodeURIComponent(
                        options.framecount
                    )}`
                );
            },
        },
        playout_removeall: {
            name: "Remove all items from the playlist",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/removeall?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_keyframe: {
            name: "Create a user keyframe from the currently playing clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/keyframe?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_play: {
            name: "Start playout. If clip is not loaded, load and play it.",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/play?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_pause: {
            name: "Pause playout. If clip is not loaded, load and pause it on the first frame",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/pause?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_prime: {
            name: "Prime playout. Prepares and loads the next clip in a gallery playout playlist",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/prime?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_previous: {
            name: "Load the previous clip in the playlist. If playing, go back to start of current clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/previous?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_previousstep: {
            name: "Skip back 10 frames in the currently loaded clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/previousstep?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_previousframe: {
            name: "Skip back 1 frame in the currently loaded clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/previousframe?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_next: {
            name: "Load the next clip in the playlist",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/next?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_nextstep: {
            name: "Skip forward 10 frames in the currently loaded clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/nextstep?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_nextframe: {
            name: "Skip forward 1 frame in the currently loaded clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/nextframe?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_add: {
            name: "Add the specified clips to the playlist",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "textinput",
                    label: "Clip IDs (comma separated)",
                    id: "clipids",
                    required: true,
                    default: "",
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/add?port=${encodeURIComponent(options.port)}&clipids=${encodeURIComponent(
                        options.clipids
                    )}`
                );
            },
        },
        playout_loadnow: {
            name: "Replace playlist with specified clips and hold on the first frame of first clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "textinput",
                    name: "Clip IDs (comma separated)",
                    id: "clipids",
                    required: true,
                    default: "",
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/loadnow?port=${encodeURIComponent(options.port)}&clipids=${encodeURIComponent(
                        options.clipids
                    )}`
                );
            },
        },
        playout_playnow: {
            name: "Replace playlist with specified clips and play first clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "textinput",
                    label: "Clip IDs (comma separated)",
                    id: "clipids",
                    required: true,
                    default: "",
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/playnow?port=${encodeURIComponent(options.port)}&clipids=${encodeURIComponent(
                        options.clipids
                    )}`
                );
            },
        },
        playout_load: {
            name: "Load the specified clip index ready for playout",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "number",
                    label: "Playlist Index to load",
                    id: "index",
                    min: 0,
                    max: 9999,
                    default: 0,
                    required: true,
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/load?port=${encodeURIComponent(options.port)}&index=${encodeURIComponent(
                        options.index
                    )}`
                );
            },
        },
        playout_seek: {
            name: "Seek to the specified frame in the current clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "number",
                    label: "Frame",
                    id: "frame",
                    required: true,
                    default: 0,
                    min: 0,
                    max: 999999999,
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/seek?port=${encodeURIComponent(options.port)}&frame=${encodeURIComponent(
                        options.frame
                    )}`
                );
            },
        },
        playout_stop: {
            name: "Stop playout",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/stop?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_togglefield: {
            name: "Toggle field dominance for currently playling clip",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/togglefield?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_pauseafter: {
            name: "Toggle 'pauseafter' mode for the port",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/playout/pauseafter?port=${encodeURIComponent(options.port)}`);
            },
        },
        playout_loop: {
            name: "Set 'loop' mode for the port",
            options: [
                {
                    type: "dropdown",
                    label: "Port ID",
                    id: "port",
                    choices: this.PORTLIST_PLAY,
                },
                {
                    type: "checkbox",
                    label: "Loop enabled",
                    id: "loopflag",
                    default: true,
                },
            ],
            callback: async ({ options }) => {
                this.send(
                    `/api/playout/loop?port=${encodeURIComponent(options.port)}&loopflag=${encodeURIComponent(
                        options.loopflag ? "1" : "0"
                    )}`
                );
            },
        },

        // syncplay plugin
        syncplay_trigger: {
            name: "Triggers a syncplay scene",
            options: [
                {
                    type: "textinput",
                    label: "Trigger ID",
                    id: "triggerid",
                    required: true,
                    default: "",
                },
            ],
            callback: async ({ options }) => {
                this.send(`/api/syncplay/trigger?trigger=${encodeURIComponent(options.triggerid)}`);
            },
        },
    };
    this.setActionDefinitions(actions);
}
