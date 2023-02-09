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

    /** Last key that was pressed */
    lastKeyDown = ''

    /** Time at which a key was started to be held */
    keyHoldStart = 0

    /** `true` if the wheel is open, `false` otherwise */
    isOpen = false

    /** Actions that have been registered */
    actions = []

    /** Called on load */
    onLoad() {
        this.hooks.addHandler('controls.key.down', this.onKeyDown)
        this.hooks.addHandler('controls.key.up', this.onKeyUp)

        // Get current user identifier
        this.user.getID().then(uid => this.userID = uid)

        // Retrieve all available actions
        this.getActions()

        this.menus.register({
            id: 'wheel',
            section: 'overlay-top',
            panel: {
                iframeURL: this.paths.absolute('ui-build/panel/index.html')
            }
        })
    }

    /** Called on unload */
    onUnload() {
        this.hooks.removeHandler('controls.key.down', this.onKeyDown)
        this.hooks.removeHandler('controls.key.up', this.onKeyUp)
    }

    /** Called when we receive a message */
    onMessage(msg) {
        // Not enough message information
        if (!msg || !msg.id || !msg.event) {
            console.log('[RadialWheel] Not enough information from message', msg)
            return
        }

        // User clicked on a wheel item
        if (msg.event === 'click') {
            this.close(true)
            this.performAction(msg.id)
            return
        }

        // User hovered over wheel item
        if (msg.event === 'hover') {
            this.performAction(msg.id)
            return
        }
    }

    /** Retrieves all actions that can be assigned */
    async getActions() {
        let acts = await this.hooks.triggerAll('radial-wheel.action')

        // Add all actions
        this.actions = []
        for (let act of acts) {
            this.actions.push({ id: act.id, name: act.name, icon: act.icon, hookName: act.hookName })
        }
    }

    /** Called when a key is pressed */
    onKeyDown = evt => {
        let pressed = evt.code

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
        if (!this.isOpen && this.lastKeyDown === 'Digit1' && Date.now() - this.keyHoldStart >= 600) {
            this.open()
        }
    }

    /** Called when a key is released */
    onKeyUp = evt => {
        let released = evt.code

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

        // TODO: Open wheel
        this.isOpen = true
        console.log('== opening radial menu')
        this.menus.postMessage({action: 'create-wheel'}, "*")
    }

    /** Closes the radial wheel, if not already closed */
    close(fromClick = false) {
        // Do not close if already closed
        if (!this.isOpen) {
            return
        }

        // Send a hover check if we are not closing from a click
        if (!fromClick) {
            this.messages.send('radial-wheel.check-hover', false, this.userID)
        }

        // TODO: Close wheel
        this.isOpen = false
        console.log('== closing radial menu')
        this.menus.postMessage({action: 'destroy-wheel'}, "*")
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
