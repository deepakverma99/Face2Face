import { createContext, useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

export const SocketContext = createContext();

export const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [messages, setMessages] = useState([]); // 🆕 Chat messages state
  const [message, setMessage] = useState(""); // 🆕 Input field

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const screenTrackRef = useRef(null);

  // ✅ Use a ref to hold socket
  const socket = useRef();

  useEffect(() => {
    // ✅ Connect socket once
    socket.current = io("https://face2face-evpj.onrender.com");

    // ✅ Get socket ID
    socket.current.on("me", (id) => {
      // console.log("📡 Got socket ID:", id);
      setMe(id);
    }); // 🆕 Chat listener
    socket.current.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });


    // ✅ Incoming call
    socket.current.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivedCall: true, from, name: callerName, signal });
    });

    // ✅ Get media
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      });

   
    return () => {
      // ✅ Clean up socket on unmount
      socket.current.disconnect();
    };
  }, []);

  // Set local video when stream is ready
  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream]);


  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    peer.on("stream", (currentStream) => {
      if (userVideo.current) userVideo.current.srcObject = currentStream;
    });

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current?.destroy();
    window.location.reload();
  };

  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const screenTrack = screenStream.getVideoTracks()[0];
      screenTrackRef.current = screenTrack;

      const sender = connectionRef.current?.peerConnection
        ?.getSenders()
        .find((s) => s.track.kind === "video");

      if (sender) {
        sender.replaceTrack(screenTrack);
      }

      if (myVideo.current) {
        myVideo.current.srcObject = screenStream;
      }

      setIsScreenSharing(true);

      screenTrack.onended = () => {
        stopScreenShare(); // If user clicks "stop sharing" from browser UI
      };
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  const stopScreenShare = () => {
    const screenTrack = screenTrackRef.current;
    const videoTrack = stream?.getVideoTracks()[0];

    if (!screenTrack || !videoTrack) return;

    const sender = connectionRef.current?.peerConnection
      ?.getSenders()
      .find((s) => s.track.kind === "video");

    if (sender) {
      sender.replaceTrack(videoTrack);
    }

    if (myVideo.current) {
      myVideo.current.srcObject = stream;
    }

    screenTrack.stop();
    screenTrackRef.current = null;
    setIsScreenSharing(false);
  };

  // 🆕 Send message
 const sendMessage = () => {
  if (message.trim()) {
    socket.current.emit("sendMessage", { message, name });
    setMessages((prev) => [...prev, { message, name: "You" }]);
    setMessage("");
  }
};


  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        // 🆕 Screen sharing
        startScreenShare,
        stopScreenShare,
        isScreenSharing,
        // 🆕 Chat-related
        message,
        setMessage,
        messages,
        sendMessage,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
