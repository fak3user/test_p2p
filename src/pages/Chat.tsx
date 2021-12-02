import React, { useRef, useEffect } from 'react'
import { Message } from '../components'
import { IMessage } from '../App'

interface IChatProps {
  messages: IMessage[];
  newMessage: string;
  sendMessage: any;
  updateNewMessage: any;
}

function Chat(props: IChatProps) {
  const messagesRef = useRef<any>(null)

  useEffect(() => {
    if (messagesRef !== null && messagesRef.current !== null) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth'
      })
    }
  }, [props.messages])

  return <div className='chat'>
    <div className='messages' ref={messagesRef}>
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


export default Chat