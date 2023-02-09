import { BasePlugin, BaseComponent } from 'vatom-spaces-plugins'

/**
 * Radial wheel for performing quick actions.
 */
export default class RadialWheelPlugin extends BasePlugin {

    /** Plugin info */
    static id = 'radial-wheel'
    static name = 'Radial Wheel'
    static description = 'Radial wheel that can be used to perform actions.'

    /** Last key that was pressed */
    lastKeyDown = ''

    /** Time at which a key was started to be held */
    keyHoldStart = 0

    /** Called on load */
    onLoad() {
        this.hooks.addHandler('controls.key.down', this.onKeyDown)
        this.hooks.addHandler('controls.key.up', this.onKeyUp)
    }

    /** Called on unload */
    onUnload() {
        this.hooks.removeHandler('controls.key.down', this.onKeyDown)
        this.hooks.removeHandler('controls.key.up', this.onKeyUp)
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

        // Update key that was last pressed
        this.lastKeyDown = pressed
        // TODO: Open radial wheel
    }

    /** Called when a key is released */
    onKeyUp = evt => {
        let released = evt.code

        // Not same key that has been recorded
        if (this.lastKeyDown != released) {
            return
        }

        // TODO:
        // - Close the radial wheel
        // - Check if mouse is hovering over item
    }

}
