# PIPStream

## Live Streaming Library from Volcano.live

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

PIPstream is a quick and easy live streaming library.
PIP has the same "selector" strcture as jQuery, instead of $, PIP uses $P.

**Quick 3 Steps**

- Install PIP usng npm
- $P("document").init();
- $P("#mybutton").cameraTrigger();

## Install

```bash
npm install pipstream
```

`Note`: You need `HTTPS` connection for WEBRTC to work. (Only localhost will work without https)

## Features

- Stream live video content using WEBRTC (from your browser).
- Supports upto 18 live streamers and unlimted live viewers.
- Option to control camera, switch devices, mute, unmute etc.

## Usage

### 1. Initialise WebRTC

```javascript
import { $P } from "pipstream";

$P("document").init("mychannelname");
```

> Here the **channelname** parameter can be any unique string used by both the broadcaster and the viewer.

To check the status, we can pass a callback function, to the above function. The first callback is for success, second callback is for failure.

```javascript
$P("document").init("mychannelname", successCallback, failureCallback);
```

**For example:**

```javascript
$P("document").init("mychannelname", function (response) {
  console.log("success");
});
```

### 2. Trigger the Camera

Make a button/link/or any html element to trigger the camera popup. Clicking on the element will trigger the camera permission popup, and get permission from the browser.

**HTML**

```html
<a href="#" id="startlink">Start</a>
```

**JS**

```javascript
$P("#startlink").cameraTrigger();
```

### 3. Show Webcam Video

Creat a html video tag, and make that video element to display local stream video.

**HTML**

```html
<video width="500" id="myvideo" muted></video>
```

**JS**

```javascript
$P("#myvideo").localVideoStream();
```

`Note`: This function accept a success callback method as a parameter.

**For example:**

```javascript
$P("#myvideo").localVideoStream(function () {
  $P.getDevices(); // this method is for listing all available video/audio devices in the system.
});
```

### 4. Go Live

The above function, 'localVideoStream' get the video/audio stream from the device and play locally. You need to make it go live to broadcast the video.

```javascript
$P("#myvideo").goLive();
```

**OR**

```html
<a href="#live" onclick='$P("#myvideo").goLive()'>Go Live</a>
```

**To End the Stream (Leave Stream)**

```javascript
$P.disconnect();
```

### 5. Show Remote Video (Or Watch any live stream)

Create a html video element anywhere and make the video to play the remote stream.

**For Example:**

```html
<video width="500" id="remotevideo" muted></video>
```

**JS**

```javascript
$P("#remotevideo").remoteVideoStream(function () {
  /* Callback when the stream begins */
});
```

**On Stream End Callback**

Use the follwing function to get the callback when the stream ends. (On the receiver side)

```javascript
$P("#remotevideo").onStreamRemoved(function () {
  /* callback function */
});
```

### Some other quick functions

**1. Switch Camera Device**

```javascript
$P.getLocalStream().switchDevice("video", deviceID);
// $P.getDevices() can be used to get a list of Device IDs
```

**2. Switch Audio Device**

```javascript
$P.getLocalStream().switchDevice("audio", deviceID);
// $P.getDevices() can be used to get a list of Device IDs
```

**3. Disable/Enable Local Video (Turn Video Off)**

```javascript
$P("#myvideo").turnVideo("off");
$P("#myvideo").turnVideo("on");
```

**3. Disable/Enable Local Audio (Mute/Unmute)**

```javascript
$P("#myvideo").turnAudio("off");
$P("#myvideo").turnAudio("on");
```

**4. Manually Trigger Camera**

If you want any event other than onClick on an element to trigger the camera, (Alternative Fuction to `cameraTrigger` ) use the following function.

```javascript
$P.enableCamera();
```

**For example**

```html
<p ondblclick="$P.enableCamera()">Double-click me</p>
```

**5. Get Connection Status at any time**

```javascript
$P.getConnectionStatus(); //returns true or false
```

## Advanced Functions

**Get Local Stream Object**

```javascript
$P.getLocalStream(); //Single Object
```

**Get Remote Stream Object**

```javascript
$P.getIncomingStreams(); // Array of Objects
```

**Get PIP Stream Object**

```javascript
$P.getPipStreamObject();
```

## WebRTC backend
AgoraRTC is used to support the live streaming service. For production integration, create an agora account and get API key and access token. 

https://www.agora.io 


