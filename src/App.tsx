import React, { useState, useEffect } from 'react';
import './App.css';
import Peer from 'peerjs'
import { Chat, Video } from './pages'
import { ConnectForm } from './components'

export interface IMessage {
  text: string;
  date: any;
  owner: 'me' | 'remote'
}
export type TConnectionType = 'text' | 'video';

function App() {
  const [connectionType, setConnectionType] = useState<TConnectionType>('text')

  const [peer, updatePeer] = useState<any>(null) // main peerjs object
  const [peerId, updatePeerId] = useState<string>('')
  const [remotePeerId, updateRemotePeerId] = useState<string>('')

  const [peerChatConnection, updatePeerChatConnection] = useState<any>(null) // chat connection object 
  const [messages, updateMessages] = useState<IMessage[]>([])
  const [newMessage, updateNewMessage] = useState<string>('')

  const [peerVideoConnection, updatePeerVideoConnection] = useState<any>(null) // video connection object 
  const [videoStreamSelf, setVideoStreamSelf] = useState<any>(null)
  const [videoStreamRemote, setVideoStreamRemote] = useState<any>(null)

  useEffect(() => {
    updatePeer(new Peer())
  }, [])

  useEffect(() => {
    if (peer !== null) {
      peer.on('open', function(id: string) {
        updatePeerId(id) 
      });

      peer.on('connection', function(data: any) {
        updatePeerChatConnection(data)
      })

      peer.on('call', function(call: any) {
        updatePeerVideoConnection(call)
      });
    }
  }, [peer])

  useEffect(() => {
     if (peerChatConnection !== null) {
        peerChatConnection.on('open', function() {
          peerChatConnection.on('data', function(message: string) {
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
  }, [peerChatConnection])

  useEffect(() => {
    if (peerVideoConnection !== null) {
      peerVideoConnection.answer(videoStreamSelf)
      peerVideoConnection.on('stream', function(stream: any) {
        setVideoStreamRemote(stream)
      })
    }
  }, [peerVideoConnection])

  function handleConnectText() {
    updatePeerChatConnection(peer.connect(remotePeerId))
  }
  function handleConnectVideo() {
    updatePeerVideoConnection(peer.call(remotePeerId, videoStreamSelf))
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
    peerChatConnection.send(newMessage)
    updateNewMessage('')
  }

  function handleFetchingStream(stream: MediaStream) {
    setVideoStreamSelf(stream)
  }

  if (peer !== null) {
      return (
        <div className="app">
          {
             (connectionType === 'text'
                          ? peerChatConnection === null
                          : peerVideoConnection === null) && 
              <ConnectForm
                peerId={peerId}
                remotePeerId={remotePeerId}
                connectionType={connectionType}
                onConnectionTypeChange={setConnectionType}
                isButtonDisabled={connectionType === 'text' ? false : (videoStreamSelf === null)}
                onRemotePeerChange={updateRemotePeerId}
                onConnectClick={connectionType === 'text' ? handleConnectText : handleConnectVideo}
                />
          }
          {
            (connectionType === 'text' && peerChatConnection !== null) &&
            <Chat
              messages={messages}
              newMessage={newMessage}
              sendMessage={sendMessage}
              updateNewMessage={updateNewMessage}
              />
          }
          {
            connectionType === 'video' &&
            <Video 
              onFetchingStream={handleFetchingStream}
              remoteStream={videoStreamRemote}
              />
          }
        </div>
      );
    }
  return <p>loading peer</p>
}

export default App;