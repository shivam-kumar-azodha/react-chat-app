/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
import AudioRecorder from "../AudioRecorder/AudioRecorder";

const AudioRecorderExample = () => {
  // const [messages, setMessages] = useState<any>([]);

  // const handleRecordingComplete = (audioBlob: any) => {
  //   // You can upload the audioBlob to your server here
  //   setMessages((prev: any) => [...prev, { type: "audio", blob: audioBlob }]);
  // };

  return (
    <div>
      {/* <div className="messages">
        {messages.map((msg: any, index: number) =>
          msg.type === "audio" ? (
            <audio key={index} controls src={URL.createObjectURL(msg.blob)} />
          ) : (
            <div key={index}>{msg.text}</div>
          )
        )}
      </div> */}
      {/* <AudioRecorder /> */}
    </div>
  );
};

export default AudioRecorderExample;
