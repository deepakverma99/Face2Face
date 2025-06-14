import React, { useContext, useState } from "react";
import "../styles/Options.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Button, Typography } from "@mui/material";
import { Assignment, Phone, PhoneDisabled, StopScreenShare,ScreenShare} from "@mui/icons-material";
import { SocketContext } from "../Context/SocketContext.jsx";

const Options = ({ children }) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
  } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  // console.log(me);
  return (
    <div className="container">
      <div className="options">
        <form className="root" noValidate autoComplete="off">
          <div className="gridContainer1">
            <div className="optContainer">
              <Typography gutterBottom variant="h6">
                Account Info
              </Typography>
              <input
                className="textfield"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                fullwidth="true"
                required
              /><div className="margin">
              <CopyToClipboard text={me}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Assignment fontSize="large" />}
                >
                  Copy your Id
                </Button>
              </CopyToClipboard>
              
              {isScreenSharing ? (
                <Button
                  variant="contained"
                  style={{ marginLeft: "10px" }}
                  color="warning"
                  startIcon={<StopScreenShare fontSize="large" />}
                  onClick={stopScreenShare}
                >
                  Stop Sharing
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                   style={{ marginLeft: "10px" }}
                  startIcon={<ScreenShare fontSize="large" />}
                  onClick={startScreenShare}
                >
                  Share Screen
                </Button>
              )}</div>
            </div>
            <div className="optContainer">
              <Typography gutterBottom variant="h6">
                Make a call
              </Typography>
              <input
                className="textfield"
                placeholder="Id to call"
                value={idToCall}
                onChange={(e) => setIdToCall(e.target.value)}
                variant="outlined"
                fullwidth="true"
              />
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  onClick={leaveCall}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Phone fontSize="large" />}
                  onClick={() => callUser(idToCall)}
                >
                  Call
                </Button>
              )}
            </div>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default Options;
