import React, { useContext } from "react";
import "../styles/VideoPlayer.css";
import { SocketContext } from "../Context/SocketContext.jsx";

const VideoPalyer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } =
    useContext(SocketContext);

  return (
    <div className="gridContainer">
      {stream ? (
        <div className="paper">
          <p className="name">{name || "Name"}</p>
          <video
            className="video"
            // muted
            ref={myVideo}
            playsInline
            autoPlay
          ></video>
        </div>
      ) : (
        <div className="paper">📷 Waiting for camera...</div>
      )}

      {callAccepted && !callEnded ? (
        <div className="paper">
          <p className="name">{call?.name || "Caller Name"}</p>
          <video className="video" ref={userVideo} playsInline autoPlay></video>
        </div>
      ) : (
        <div className="paper">🔕 No active call or call ended.</div>
      )}
    </div>
  );
};

export default VideoPalyer;
