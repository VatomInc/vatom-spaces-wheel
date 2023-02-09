import React from "react";
import { createRoot } from 'react-dom/client'


export default class App extends React.PureComponent {

    showWheel = false

    /** Show Wheel */
    static show() {
        // Already showing
        // if (this.div) {
        //     return
        // }

        // // Create container div
        // this.div = document.createElement('div')
        // document.body.appendChild(this.div)

        // // Render it
        // ReactDOM.render(<Wheel ref={r => this.singleton = r} />, this.div)

    }

    /** Remove Wheel */
    static destroy() {
        // // Already destroyed
        // if (!this.div) {
        //     return
        // }

        // ReactDOM.unmountComponentAtNode(this.div)
        // this.div?.parentElement?.removeChild(this.div)
        // this.div = null
    }

    componentDidMount(){
        window.addEventListener('message', this.onMessage)
    }

    componentWillUnmount(){
        window.removeEventListener('message', this.onMessage)
    }

    /** Receives messages from plugin */
    onMessage = e => {

        if(e.data.action == 'create-wheel'){
            this.showWheel = true
            this.forceUpdate()
        }

        if(e.data.action == 'destroy-wheel'){
            this.showWheel = false
            this.forceUpdate()
        }
    }

   render = () => {
    return <>
        {this.showWheel ? <>
            <div style={{position: 'fixed', top: '15%', left: '40%', transform: 'translate(-50%, -50%)'}}>
          
                <div>
                    <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'translate(0px, 0px)', opacity: '40%'}}/>
                    {/* <img src={require('../resources/wheel-segment-gradient.svg')} style={{position:'absolute'}}/>
                    <div style={{position: 'absolute', color: 'black'}}>TEXT</div> */}
                </div>

                <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'rotate(45deg) translate(128px, -58px)', opacity: '40%'}}/>
                <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'rotate(90deg) translate(177px, -189px)', opacity: '40%'}}/>
                <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'rotate(135deg) translate(119px, -316px)', opacity: '40%'}}/>
                <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'rotate(180deg) translate(-12px, -365px)', opacity: '40%'}}/>
                <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'rotate(225deg) translate(-139px, -307px)', opacity: '40%'}}/>
                <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'rotate(270deg) translate(-188px, -176px)', opacity: '40%'}}/>
                <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'rotate(315deg) translate(-130px, -49px)', opacity: '40%'}}/>
            </div>
        </>: null}   
    </>
   }
}

// Render app
let appContainer = document.createElement('div')
appContainer.id = 'react-app'
document.body.appendChild(appContainer)
let root = createRoot(appContainer)
root.render(<App />)
