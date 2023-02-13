import "./App.css";
import React ,{useEffect} from 'react';

import { useStopwatch } from "react-timer-hook";

const { ipcRenderer } = window.require("electron");

function App() {
  useEffect(() => {
    ipcRenderer.send('show-notification', 'This is a notification');
  }, []);
  // const [counter, setCounter] = useState(0);
  // const [mcounter, setMCounter] = useState(0);
 
  const stopwatchOffset = new Date();
  stopwatchOffset.setSeconds(stopwatchOffset.getSeconds() + 300);
  const { seconds, minutes, hours, isRunning, pause, reset } = useStopwatch({
    autoStart: false,
  });
  const hourTime = hours < 10 ? `0${hours}` : `${hours}`;
  const secondTime = seconds < 10 ? `0${seconds}` : `${seconds}`;
  const minuteTime = minutes < 10 ? `0${minutes}` : `${minutes}`;
  
  ipcRenderer.on("TIMER_SOURCE", async (event, source) => {
    const screenshot = document.getElementById("screenshot-image");
    screenshot.src = source.thumbnail.toDataURL(); // The image to display the screenshot
  });
 

  const timer = () => {
    ipcRenderer.send('TIMER', isRunning ? "Stop" : "Start");
    console.log(isRunning);
    if(isRunning)
      pause()
    else
      reset()
  }
  return (
    <div className="App">
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "50px" }}>
          <span>{hourTime}</span>:<span>{minuteTime}</span>:
          <span>{secondTime}</span>
        </div>
        <p>{isRunning ? "Running" : "Not running"}</p>
        <button onClick={timer}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <div>
        <p id="output">Click it to see the effect in this interface.</p>
          {/* <h3>Mouse Clicks Count : {mcounter}</h3>
          <h3>Keyboard Clicks Count : {counter}</h3> */}
        </div>
      </div>
      <br />
      <br />
      <img alt="" id="screenshot-image" />
    </div>
  );
}

export default App;
