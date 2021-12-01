import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Peer from 'peerjs'

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

function App() {
  const [peer, updatePeer] = useState<any>(null)
  const [peerId, updatePeerId] = useState<string>('')
  const [remotePeerId, updateRemotePeerId] = useState<string>('')
  const [peerConnection, updatePeerConnection] = useState<any>(null)
  const [messages, updateMessages] = useState<IMessage[]>([])
  const [newMessage, updateNewMessage] = useState<string>('')

  useEffect(() => {
    updatePeer(new Peer())

    getVideoStream().then(stream => {
        const video: any = document.querySelector('#video')
        video.srcObject = stream
    })

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

  function handleConnect() {
    updatePeerConnection(peer.connect(remotePeerId))
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

  if (peer !== null) {
    return (
      <div className="App">
        <video id='video' autoPlay />
        {/*
          peerConnection === null
          ? <>
            <p>my id is <strong>{peerId}</strong></p>
            <input type="text" value={remotePeerId} onChange={(e: any) => updateRemotePeerId(e.target.value)} /><button onClick={handleConnect}>connect to another peer</ button>
          </>
          : <div className='chat'>
            <div className='messages'>
              {  messages.map((message, index) => <Message key={`${message.text}-${index}`} {...message} />) }
            </div>
            <input 
              type="text" 
              value={newMessage} 
              onKeyDown={
                (e: any) => {
                  if (e.key === 'Enter') {
                    sendMessage()
                  }
                }
              } 
              onChange={(e: any) => updateNewMessage(e.target.value)} 
              />
          </ div>
        */}
      </div>
    );
  }
  return <p>loading peer</p>
}

export default App;