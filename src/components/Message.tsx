import React from 'react'
import { IMessage } from '../App'

function Message(props: IMessage) {
  return <div className={`message ${props.owner === 'me' ? 'right' : 'left'}`}>
    <p className='date'>{props.date.toLocaleTimeString()}</p>
    <p className='text'>{props.text}</p>
  </div> 
}

export default Message