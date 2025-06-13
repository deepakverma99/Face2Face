import React, { useContext } from 'react'
import '../styles/Notifications.css'
import { SocketContext } from '../Context/SocketContext.jsx'
const Notifications = () => {
  const { answerCall, call, callAccepted} = useContext(SocketContext);
  return (
    <>
    {call.isReceivedCall && !callAccepted && (
      <div className='options1'>
        <h1 className='h1'>{call.name} is calling:</h1>
        <button className='ansBtn' onClick={answerCall}>PickUp</button>
      </div>
    )}
      
    </>
  )
}

export default Notifications
