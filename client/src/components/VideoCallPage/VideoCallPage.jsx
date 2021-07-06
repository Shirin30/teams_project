import React, { Component } from 'react'
import {withRouter} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faVideo,faMicrophone,faPhone,faDesktop,faMicrophoneSlash, faVideoSlash,faCommentAlt,faThList,faCamera,faStopCircle} from '@fortawesome/free-solid-svg-icons';


class JitsiComponent extends Component {

    domain = 'meet.jit.si';
    api = {};

    constructor(props) {
        super(props);
        this.state = {
            room: window.location.pathname,
            user: {
                name: 'Shirin Jain'
            },
            isAudioMuted: false,
            isVideoMuted: false,

        }
    }

    startMeet = () => {
        const options = {
            roomName: this.state.room,
            width: '100%',
            height: 600,
            configOverwrite: { prejoinPageEnabled: false},
            interfaceConfigOverwrite: {
                // overwrite interface properties
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
                displayName: this.state.user.name
            }
        }
        this.api = new window.JitsiMeetExternalAPI(this.domain, options);

        this.api.addEventListeners({
            readyToClose: this.handleClose,
            participantLeft: this.handleParticipantLeft,
            participantJoined: this.handleParticipantJoined,
            videoConferenceJoined: this.handleVideoConferenceJoined,
            videoConferenceLeft: this.handleVideoConferenceLeft,
            audioMuteStatusChanged: this.handleMuteStatus,
            videoMuteStatusChanged: this.handleVideoStatus
        });
    }

    handleClose = () => {
        console.log("handleClose");
        this.executeCommand('hangup');
    }

    handleParticipantLeft = async (participant) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await this.getParticipants();
    }

    handleParticipantJoined = async (participant) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await this.getParticipants();
    }

    handleVideoConferenceJoined = async (participant) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        const data = await this.getParticipants();
    }

    handleVideoConferenceLeft = () => {
        console.log("handleVideoConferenceLeft");
        console.log(this.props);
        return this.props.history.push('/');
    }

    handleMuteStatus = (audio) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }

    handleVideoStatus = (video) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    getParticipants() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    // custom events
    executeCommand(command) {
        this.api.executeCommand(command);;
        if(command == 'hangup') {
            return this.props.history.push('/');
        }
        

        if(command == 'toggleAudio') {
            this.setState({ isAudioMuted: !this.state.isAudioMuted });
        }

        if(command == 'toggleVideo') {
            this.setState({ isVideoMuted: !this.state.isVideoMuted });
        }
    }
  
   

    componentDidMount() {
        if (window.JitsiMeetExternalAPI) {
            this.startMeet();
        } else {
            alert('JitsiMeetExternalAPI not loaded');
        }
    }

    render() {
        const { isAudioMuted, isVideoMuted } = this.state;
        return (
            <>
            <div id="jitsi-iframe" className="jitsi-frame"></div>
            
            <div style={{"position":"relative"}}>
                <span className="jitsi-custom">&nbsp;&nbsp;</span>
                <i className="custom-meet-icon"onClick={ () => this.executeCommand('toggleAudio') }   title="Mute / Unmute">
                    <FontAwesomeIcon className="icon" icon={isAudioMuted ?faMicrophoneSlash : faMicrophone}/>
                </i>
                <i className="custom-meet-icon" onClick={ () => this.executeCommand('hangup') }  title="Leave">
                    <FontAwesomeIcon className="icon red" icon={faPhone}/>
                </i>
                <i className="custom-meet-icon" onClick={ () => this.executeCommand('toggleVideo') } title="Start / Stop camera">
                    <FontAwesomeIcon className="icon" icon={isVideoMuted ? faVideoSlash : faVideo}/>
                </i>
                <i className="custom-meet-icon" onClick={ () => this.executeCommand('toggleShareScreen') }  title="Share your screen">
                    <FontAwesomeIcon className="icon red" icon={faDesktop}/>
                </i>
                <i className="custom-meet-icon" onClick={ () => this.executeCommand('toggleChat') }  title="Chat/Message">
                    <FontAwesomeIcon className="icon red" icon={faCommentAlt}/>
                </i>
                 <i className="custom-meet-icon" onClick={ () => this.executeCommand('toggleTileView') }  title="Tile View">
                    <FontAwesomeIcon className="icon red" icon={faThList}/>
                </i>
                <i className="custom-meet-icon" onClick={ () => this.api.executeCommand('startRecording',{mode: 'file',dropboxToken: "sl.Az5WSCY-xIfnuoQX6w8pqdFgSnn0P0trgmnXj6rSznyrP028ep7mRP49PFcAPwO90EKhKUhN6CIAsnfpio6le5DiDbNY5-Z1gqxhj3obxLGqAdATT5xHgk_pO0vl86wZivYBf3c",}) }  title="Start Recording">
                    <FontAwesomeIcon className="icon red" icon={faCamera}/>
                </i>
                <i className="custom-meet-icon" onClick={ () => this.api.executeCommand('stopRecording','file') }  title="Stop Recording">
                    <FontAwesomeIcon className="icon red" icon={faStopCircle}/>
                </i>

                
                
            </div>

            </>
        );
    }
}

export default withRouter(JitsiComponent);