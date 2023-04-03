import { BasePlugin } from 'vatom-spaces-plugins'

/**
 * Radial wheel for performing quick actions.
 */
export default class RadialWheelPlugin extends BasePlugin {

    /** Plugin info */
    static id = 'radial-wheel'
    static name = 'Radial Wheel'
    static description = 'Radial wheel that can be used to perform actions.'

    /** Identifier of the current user */
    userID = null

    /** Identifier of the menu item */
    menuID = 'wheel'

    /** Key that is used to show the wheel */
    keyCode = 'KeyR'

    /** Last key that was pressed */
    lastKeyDown = ''

    /** Time at which a key was started to be held */
    keyHoldStart = 0

    /** `true` if the wheel is open, `false` otherwise */
    isOpen = false

    /** Actions that have been registered */
    actions = [{ id: '-', name: '-' }]

    /** Actions that have been assigned to slots */
    assigned = []

    /** Called on load */
    onLoad() {
        this.hooks.addHandler('controls.key.down', this.onKeyDown)
        this.hooks.addHandler('controls.key.up', this.onKeyUp)

        // Get current user identifier
        this.user.getID().then(uid => this.userID = uid)

        // Register overlay
        this.menus.register({
            id: this.menuID,
            section: 'overlay-top',
            panel: {
                iframeURL: this.paths.absolute('ui-build/panel/index.html'),
                pointerEvents: 'none',
            },
        })

        // Retrieve all available actions
        this.getActions().then(() => {

            // Use names as values
            const values = this.actions.map(act => act.name)

            // Register settings
            this.menus.register({
                id: 'radial-wheel-settings',
                section: 'plugin-settings',
                panel: {
                    fields: [
                        { type: 'section', id: 'options', name: 'Options' },
                        { id: 'slot-1', name: 'Slot 1', type: 'two-stack', help: 'Action that will be assigned to the first slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[1]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-1') },
                        },
                        { id: 'slot-2', name: 'Slot 2', type: 'two-stack', help: 'Action that will be assigned to the second slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[2]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-2') },
                        },
                        { id: 'slot-3', name: 'Slot 3', type: 'two-stack', help: 'Action that will be assigned to the third slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[3]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-3') },
                        },
                        { id: 'slot-4', name: 'Slot 4', type: 'two-stack', help: 'Action that will be assigned to the fourth slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[4]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-4') },
                        },
                        { id: 'slot-5', name: 'Slot 5', type: 'two-stack', help: 'Action that will be assigned to the fifth slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[5]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-5') },
                        },
                        { id: 'slot-6', name: 'Slot 6', type: 'two-stack', help: 'Action that will be assigned to the sixth slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[6]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-6') },
                        },
                        { id: 'slot-7', name: 'Slot 7', type: 'two-stack', help: 'Action that will be assigned to the seventh slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[7]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-7') },
                        },
                        { id: 'slot-8', name: 'Slot 8', type: 'two-stack', help: 'Action that will be assigned to the eighth slot.',
                            heightBetween: 5,
                            first: { type: 'select', values: values },
                            second: { type: 'bind-key', boundTo: this.assigned[8]?.key || '', onKeyBound: key => this.onKeyBound(key, 'slot-8') },
                        },
                    ]
                }
            })

        })
    }

    /** Called on unload */
    onUnload() {
        this.hooks.removeHandler('controls.key.down', this.onKeyDown)
        this.hooks.removeHandler('controls.key.up', this.onKeyUp)
    }

    /** Called when we have bound a key to a slot */
    onKeyBound(key, id) {
        console.log('bound key', key, 'to', id)

        // Update key that has been bound to this action
        const idx = id.split('-')[1]
        if (this.actions[idx]) {
            this.actions[idx].key = key
        }
    }

    /** Called when the settings have been updated */
    onSettingsUpdated() {
        const values = [
            { id: 'slot-1', value: this.getField('slot-1:first') },
            { id: 'slot-2', value: this.getField('slot-2:first') },
            { id: 'slot-3', value: this.getField('slot-3:first') },
            { id: 'slot-4', value: this.getField('slot-4:first') },
            { id: 'slot-5', value: this.getField('slot-5:first') },
            { id: 'slot-6', value: this.getField('slot-6:first') },
            { id: 'slot-7', value: this.getField('slot-7:first') },
            { id: 'slot-8', value: this.getField('slot-8:first') }
        ]

        let data = []
        console.log('== values', values)

        // Assign relevant actions to the slots
        for (let info of values) {
            if (info.value == null) {
                continue
            }

            // Find action based on name
            let action = this.actions.find(act => act.name === info.value)
            if (!action) {
                continue
            }

            // Add action
            data.push({ ...action, slotID: info.id })
        }

        // Send message to assign slots
        this.menus.postMessage({ action: 'assign-slots', slots: data })
    }

    /** Called when we receive a message */
    onMessage(msg) {
        // Not enough message information
        if (!msg || !msg.event) {
            console.warn('[RadialWheel] Not enough information from message', msg)
            return
        }

        // User hovered over wheel item
        if (msg.event === 'hover') {
            if (msg.id) this.performAction(msg.id)
            return
        }

        // User clicked on a wheel item
        if (msg.event === 'click') {
            this.close(true)
            if (msg.id) this.performAction(msg.id)
            return
        }
    }

    /** Retrieves all actions that can be assigned */
    async getActions() {
        let acts = await this.hooks.triggerAll('plugins.radial-wheel.add')
        if (!acts || acts.length < 1) {
            return
        }

        // Add all actions
        let idx = 1
        this.actions = [{ id: '-', name: '-', key: '' }]
        for (let act of acts) {
            this.actions.push({ id: act.id, name: act.name, key: `Digit${idx}`, icon: act.icon, hookName: act.hookName })
            idx += 1
        }
    }

    /** Called when a key is pressed */
    onKeyDown = evt => {
        let pressed = evt.code
        this.menus.postMessage({ action: 'key-down', key: pressed })

        // Set last key initially
        if (!this.lastKeyDown) {
            this.lastKeyDown = pressed
            this.keyHoldStart = Date.now()
        }

        // Pressed different key
        if (pressed != this.lastKeyDown) {
            this.keyHoldStart = Date.now()
        }

        // Update last key pressed
        this.lastKeyDown = pressed

        // Only open if held for long enough
        if (!this.isOpen && this.lastKeyDown === this.keyCode && Date.now() - this.keyHoldStart >= 600) {
            this.open()
        }
    }

    /** Called when a key is released */
    onKeyUp = evt => {
        let released = evt.code
        this.menus.postMessage({ action: 'key-up', key: released })

        // Not same key that has been recorded
        if (this.lastKeyDown != released) {
            return
        }

        // Reset key
        this.lastKeyDown = ''

        // Only close wheel if previously open
        if (this.isOpen) {
            this.close()
        }
    }

    /** Opens the radial wheel, if not already open */
    open() {
        // Do not open if already opened
        if (this.isOpen) {
            return
        }

        // Open wheel
        this.isOpen = true
        this.menus.update(this.menuID, { panel: { pointerEvents: 'auto' } })
        this.menus.postMessage({ action: 'create-wheel' })
    }

    /** Closes the radial wheel, if not already closed */
    close(fromClick = false) {
        // Do not close if already closed
        if (!this.isOpen) {
            return
        }

        // Send a hover check if we are not closing from a click
        if (!fromClick) {
            this.menus.postMessage({ action: 'check-hover' })
        }

        // Close wheel
        this.isOpen = false
        this.menus.update(this.menuID, { panel: { pointerEvents: 'none' } })
        this.menus.postMessage({ action: 'destroy-wheel' })

        // Reset key pressed
        this.lastKeyDown = null
        this.keyHoldStart = Date.now()
    }

    /**
     * Perfoms the action that matches the given identifier.
     * @param {string} id Identifier of the action to perform.
     */
    performAction(id) {
        if (!this.actions || this.actions.length < 1) {
            return
        }

        // Find action to perform
        let action = this.actions.find(act => act.id === id)
        if (!action) {
            return
        }

        // Trigger given hook if applicable
        if (action.hookName) {
            this.hooks.trigger(action.hookName)
        }
    }

}
