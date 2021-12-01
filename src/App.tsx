import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Peer from 'peerjs'
import { from } from 'rxjs'
import { map } from 'rxjs/operators';

interface IMessage {
  text: string;
  date: any;
  owner: 'me' | 'remote'
}

async function getVideoStream() {
  return new Promise((resolve, reject) => {
     navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(stream => resolve(stream))
  })
}
const stream = getVideoStream()

function Message(props: IMessage) {
  return <div className={`message ${props.owner === 'me' ? 'right' : 'left'}`}>
    <p>{props.date.toLocaleTimeString()}</p>
    <p>{props.text}</p>
  </div> 
}

interface IChatProps {
  messages: IMessage[];
  newMessage: string;
  sendMessage: any;
  updateNewMessage: any;
}
function Chat(props: any) {
  return <div className='chat'>
    <div className='messages'>
      {  props.messages.map((message: IMessage, index: number) => <Message key={`${message.text}-${index}`} {...message} />) }
    </div>
    <input 
      type="text" 
      value={props.newMessage} 
      onKeyDown={
        (e: any) => {
          if (e.key === 'Enter') {
            props.sendMessage()
          }
        }
      } 
      onChange={(e: any) => props.updateNewMessage(e.target.value)} 
      />
  </ div>
}


function VideoChat(props: any) {
  const [isStreamFetching, setStreamFetching] = useState(false)

  useEffect(() => {
    getVideoStream().then(stream => {
      setStreamFetching(true)
      const video: any = document.querySelector('#video')

      props.onGetStream(stream)

      video.srcObject = stream
    })
  }, [])

  return <>
    <video id='video' autoPlay />
    <video id='remoteVideo' autoPlay />
  </>

}

function App() {
  const [chatType, setChatType] = useState<'text' | 'video'>('text')
  const [stream, updateStream] = useState<any>(null)
  const [peer, updatePeer] = useState<any>(null)
  const [peerId, updatePeerId] = useState<string>('')
  const [remotePeerId, updateRemotePeerId] = useState<string>('')
  const [peerConnection, updatePeerConnection] = useState<any>(null)
  const [peerCall, updatePeerCall] = useState<any>(null)
  const [messages, updateMessages] = useState<IMessage[]>([])
  const [newMessage, updateNewMessage] = useState<string>('')

  const [isStreamFetching, setStreamFetching] = useState(true)


  useEffect(() => {
    getVideoStream().then(stream => {
      setStreamFetching(false)

      updateStream(stream)

      const video: any = document.querySelector('#video')
      video.srcObject = stream
    })
  }, [])

  useEffect(() => {
    updatePeer(new Peer())
  }, [])

  useEffect(() => {
    if (peer !== null) {
      peer.on('open', function(id: string) {
        updatePeerId(id)
      });

      peer.on('connection', function(data: any) {
        updatePeerConnection(data)
      })
    }
  }, [peer])

  useEffect(() => {
     if (peerConnection !== null) {
        peerConnection.on('open', function() {
          peerConnection.on('data', function(message: string) {
            updateMessages(_messages => 
              [
                ..._messages, 
                {
                  text: message,
                  date: new Date(),
                  owner: 'remote'
                }
                ])
          });
      });
    }
  }, [peerConnection])

  useEffect(() => {
    if (peerCall !== null) {
      peerCall.on('stream', function(stream) {
        const remoteVideo: any = document.querySelector('#removeVideo')
        remoteVideo.srcObject = stream
      });
    }
  }, [peerCall])

  function handleGetStream(stream: any) {
    updateStream(stream)
  }

  function handleConnectText() {
    setChatType('text')
    updatePeerConnection(peer.connect(remotePeerId))
  }
  function handleConnectVideo() {
    setChatType('video')
    updatePeerCall(peer.call(remotePeerId, stream))
  }

  function sendMessage() {
    updateMessages(_messages => 
      [
        ..._messages, 
        {
          text: newMessage,
          date: new Date(),
          owner: 'me'
        }
        ])
    peerConnection.send(newMessage)
    updateNewMessage('')
  }

  if (peer !== null && stream !== null) {

      console.log(stream)

      return (
        <div className="App">
          <p>my id is <strong>{peerId}</strong></p>
          <input type="text" value={remotePeerId} onChange={(e: any) => updateRemotePeerId(e.target.value)} />
          <button onClick={handleConnectVideo}>connect to p2p video</ button>
          {/*
            peerConnection === null
            ? ...
            : chatType === 'text'
              ? <Chat
                messages={messages}
                newMessage={newMessage}
                sendMessage={sendMessage}
                updateNewMessage={updateNewMessage}
                />
              : <VideoChat 
                onGetStream={handleGetStream}
                />
          */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <video id='video' width='300' autoPlay />
            {
              peerConnection !== null && 
              <video id='remoteVideo' autoPlay />
            }
          </div>
        </div>
      );
    }
  return <p>loading peer</p>
}

export default App;