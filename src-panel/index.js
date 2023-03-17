import React from "react";
import { createRoot } from 'react-dom/client'

/** Prefix used for each wheel slice */
const wheelPrefix = 'wheel-slice'

/** Last item that was hovered over */
let lastHoverID = ''

/**
 * Radial wheel component that shows quick actions.
 */
export default class App extends React.PureComponent {

    /** Initial state */
    state = {
        showWheel: false
    }

    /** Slots that are available */
    slots = [
        { id: '1', name: 'Text', action: '', rotation: 0, translate: '0px, 0px' },
        { id: '2', name: 'Text', action: '', rotation: 45, translate: '135px, 55px' },
        { id: '3', name: 'Text', action: '', rotation: 90, translate: '190px, 190px' },
        { id: '4', name: 'Text', action: '', rotation: 135, translate: '135px, 325px' },
        { id: '5', name: 'Text', action: '', rotation: 180, translate: '0px, 380px' },
        { id: '6', name: 'Text', action: '', rotation: 225, translate: '-135px, 325px' },
        { id: '7', name: 'Text', action: '', rotation: 270, translate: '-190px, 190px' },
        { id: '8', name: 'Text', action: '', rotation: 315, translate: '-135px, 55px' },
    ]

    /** Called after first render */
    componentDidMount() {
        window.addEventListener('message', this.onMessage)
        window.addEventListener('click', this.onClick)
    }

    /** Called when the component is unloaded */
    componentWillUnmount() {
        window.removeEventListener('message', this.onMessage)
        window.removeEventListener('click', this.onClick)
    }

    /** Called when this panel is clicked */
    onClick = evt => {
        const targetID = evt?.target?.id || ''
        window.parent.postMessage({ event: 'click', id: targetID.startsWith(wheelPrefix) ? targetID.slice(wheelPrefix.length + 1) : '' }, '*')
        window.parent.focus()
    }

    /** Receives messages from plugin */
    onMessage = evt => {
        if (!evt?.data) {
            return
        }

        const data = evt.data

        // Create wheel
        if (data.action === 'create-wheel' && !this.state.showWheel) {
            this.setState({ showWheel: true })
            return
        }

        // Destroy wheel
        if (data.action === 'destroy-wheel' && this.state.showWheel) {
            this.setState({ showWheel: false })
            return
        }

        // Check which item we are hovering over
        if (data.action === 'check-hover') {
            window.parent.postMessage({ event: 'hover', id: lastHoverID }, '*')
            return
        }

        // Assign actions to available slots
        if (data.action === 'assign-slots') {
            let slotItems = data.slots
            console.log(slotItems)
            return
        }
    }

    /** Render UI */
    render() {
        if (!this.state.showWheel) {
            return <></>
        }

        // Render UI
        return <div style={{ position: 'fixed', top: '15%', left: '40%', transform: 'translate(-50%, -50%)', zIndex: 9 }}>
            { this.slots.map(slot => <WheelSlice slot={slot} />) }
        </div>
    }
}

/**
 * Wheel slice.
 * @param {object} props Properties for the wheel slice.
 * @param {object} props.slot Slot information.
 */
const WheelSlice = props => {
    let [isHovering, setHovering] = React.useState(false)

    // Updates the last hovered item
    function updateHover(hover) {
        lastHoverID = hover ? props.slot.id : ''
        setHovering(hover)
    }

    return <img id={`${wheelPrefix}-${props.slot.id}`} draggable="false" src={require('./slice.svg')} onMouseEnter={e => updateHover(true)} onMouseLeave={e => updateHover(false)} style={{ position: 'fixed', transform: `translate(${props.slot.translate}) rotate(${props.slot.rotation}deg)`, opacity: isHovering ? 0.94 : 0.5, userSelect: 'none', transition: 'all 0.3s' }} />
}

// Render app
let appContainer = document.createElement('div')
appContainer.id = 'react-app'
document.body.appendChild(appContainer)
let root = createRoot(appContainer)
root.render(<App />)
