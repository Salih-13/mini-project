import React from 'react'
import Sidebar from './Sidebar1'
import Chat from './Chat'

const Message = () => {
  return (
    <div className='home'>
      <div className="container">
        <Sidebar/>
        <Chat/>
      </div>
    </div>
  )
}

export default Message