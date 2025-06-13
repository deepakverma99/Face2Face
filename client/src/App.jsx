import "./App.css";
import VideoPlayer from "./Components/VideoPlayer";
import Options from "./Components/Options";
import Notifications from "./Components/Notifications";
import ChatBox from "./Components/ChatBox";

function App() {
  return (
    <div className="wrapper">
      <div className="appBar">🎦 Face2Face</div>
      <VideoPlayer />
      <ChatBox />
      <Options>
        <Notifications />
      </Options>
      <p className="btmtext">
        © 2025 Face2Face, Deepak Verma. All Rights Reserved.
      </p>
    </div>
  );
}

export default App;
