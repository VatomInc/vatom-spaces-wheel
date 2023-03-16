import React from "react";
import { createRoot } from 'react-dom/client'


export default class App extends React.PureComponent {

    state={
        showWheel: false,
        slot1: null,
        slot2: null,
        slot3: null,
        slot4: null,
        slot5: null,
        slot6: null,
        slot7: null,
        slot8: null
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
            if(!this.state.showWheel){
                this.setState({showWheel: true})
            }
        }

        if(e.data.action == 'destroy-wheel'){
            if(this.state.showWheel){
                this.setState({showWheel: false})
            }
        }

        if(e.data.action == 'assign-slots'){
            let slotItems = e.data.data
            console.log(slotItems)
        }
    }

   render = () => {
    return <>
        {this.state.showWheel ? <>
            <div style={{position: 'fixed', top: '15%', left: '40%', transform: 'translate(-50%, -50%)'}}>
          
                <div>
                    <img src={require('../resources/wheel-segment-gradient.svg')} style={{position: 'fixed', transform: 'translate(0px, 0px)', opacity: '40%'}}/>
                    <img width={64} src={require('../resources/wheel-segment-gradient.svg')} style={{position:'absolute', top: 32, left: 62}}/>
                    <div style={{position: 'absolute', color: 'black', top: 98, left: 78}}>TEXT</div>
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
