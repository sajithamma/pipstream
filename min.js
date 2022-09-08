let PipStream = require ('./pipstream.js');

let $P_PipStreamObject = false;
let $P_connectedStatus = false;
let $P_localStream = false;
let $P_IncomingStreams = [];
let $P_Devices = []; //To save audio/video devices


let $P = (selector="") => {

    //Prompt variable to save the type of selectors
    let prompt = '';
    let selectedDom = false;

    prompt = selector.charAt(0);

    switch(prompt)
    {
        case '#':   selectedDom = document.getElementById(selector.substring(1));
                    break;

        default:   break;
    }
    
    return {

        
        //init PIP Stream
        init: function(channel=false, callback = function(){}, errorCallback = function(){}  ){

            if(channel === false)
            {
                console.error("Pass channel name as a parameter when initliaze");
            }
            $P_PipStreamObject = new PipStream({channel: channel});

            $P_PipStreamObject.diabledAutoPublish = true; //Do publish to live automatically

            //Register connection success callback
            $P_PipStreamObject.onStreamerConnectSuccess = function(){

                $P_connectedStatus = true;
                callback({status: "connected"})

            }

            $P_PipStreamObject.onInitialised  = function(devices){

                $P_Devices = devices;

            }

            $P_PipStreamObject.onError = errorCallback;
            $P_PipStreamObject.init();     
       
        },

        cameraTrigger: function(){

            selectedDom.onclick = function(){

                        if($P_connectedStatus !== false)
                        {
                            $P_PipStreamObject.enableCamera();
                        }
                        else 
                        {
                            console.error('Connection is not yet ready');
                            return false;
                        }    
            }

        },

        localVideoStream: function( callback = function(){}){

           if($P_PipStreamObject === false)
           {
               console.error('PIP Stream is not initialised');
               return;
           }
           $P_PipStreamObject.onLocalStream = function(localStream, streamerClient){

                //Set localstream status as true.
                $P_localStream = localStream;

                selectedDom.srcObject = localStream.stream;

                selectedDom.onloadeddata = () => {

                    selectedDom.play();

                };

                callback();

            }


        } //end local video
        ,

        //to go live to all
        goLive: function(){

            if( $P_localStream === false )
            {
                console.error('Stream is not yet active');
                return false;
            }
            $P_PipStreamObject.publishLocalStream();

        }
        
        ,

        //Set a select to handle remove stream
        remoteVideoStream: function( callback = ()=>{} ){

                $P_PipStreamObject.onIncomingStream = function(remoteStream){

                     //Get unique ID for each stream
                    let streamId= remoteStream.getId();
                    $P_IncomingStreams.push(remoteStream.stream);

                    if(selectedDom !== false)
                    {
                        //Set video source as the remote stream
                        selectedDom.srcObject = remoteStream.stream;
                        selectedDom.setAttribute('streamId', streamId);
                        selectedDom.onloadeddata = () => {

                            selectedDom.play();

                        };

                    }

                    callback($P_IncomingStreams);

                   

                }   

        },

        onStreamRemoved: function( callback = ()=>{} ){

            $P_PipStreamObject.onStreamRemoved = function(streamId){

                callback(streamId);
            }

        },

        //To enable or disable video    
        turnVideo: function(action = 'off'){

           if($P_PipStreamObject === false)
           {
               console.error('PIP Stream is not initialised');
               return;
           }

            if(action == 'off' || action === true )
            {
                $P_PipStreamObject.localStream.muteVideo();
            }
            else {

                $P_PipStreamObject.localStream.unmuteVideo();
            }
            

        },

        //To enable or disable audio    
        turnAudio: function(action = 'off'){

           if($P_PipStreamObject === false)
           {
               console.error('PIP Stream is not initialised');
               return;
           }

            if(action == 'off' || action === true )
            {
                $P_PipStreamObject.localStream.muteAudio();
            }
            else {

                $P_PipStreamObject.localStream.unmuteAudio();
            }
            

        },

        onRemoteAudioChange: function( callback = function(){} ){


                $P_PipStreamObject.onPeerMuteAudio = function(uid){

                    callback(uid, {muted: true})

                };

                $P_PipStreamObject.onPeerUnmuteAudio = function(uid){

                    callback(uid, {muted: false})

                };

        },

        //To mute html video
        muteSpeaker: function(){

            selectedDom.muted = true;
            return true;

        },

        //To unmute html video
        unMuteSpeaker: function(){

            selectedDom.muted = false;
            return true;

        },



    }
} //end $P

//To get current connected devices
$P.getDevices = function(filter="all"){

    return $P_Devices;

}

$P.getLocalStream = function(){

    return $P_localStream;
}

$P.getConnectionStatus = function(){

    return $P_connectedStatus;
}
$P.getIncomingStreams = function (){
     
     return $P_IncomingStreams;
}

$P.getPipStreamObject = function(){

    return $P_PipStreamObject;
}
$P.enableCamera = function(){

    $P_PipStreamObject.enableCamera();
    return true;
}

$P.disconnect = function(){

    $P_PipStreamObject.streamerClient.leave(() =>    
      {

          $P_PipStreamObject.localStream.stop();
          $P_PipStreamObject.localStream.close();
          $P_PipStreamObject.streamerClient.unpublish($P_PipStreamObject.localStream);

      });
}


exports.$P = $P;
exports.PipStream =  PipStream;
exports.$P_PipStreamObject = $P_PipStreamObject;