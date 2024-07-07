/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, useRef } from "react";

// const AudioRecorder = ({
//   onRecordingComplete,
// }: {
//   onRecordingComplete: (audioBlob: any) => void;
// }) => {
//   const [isRecording, setIsRecording] = useState<unknown>(false);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
//   const [audioChunks, setAudioChunks] = useState<any[]>([]);
//   const audioRef = useRef<any>(null);

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     setMediaRecorder(recorder as MediaRecorder);

//     recorder.ondataavailable = (e) => {
//       setAudioChunks((prev) => [...prev, e.data]);
//     };

//     recorder.start();
//     setIsRecording(true);
//   };

//   const stopRecording = () => {
//     if (mediaRecorder) {
//       mediaRecorder.stop();

//       mediaRecorder.onstop = () => {
//         const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         audioRef.current.src = audioUrl;
//         onRecordingComplete(audioBlob);
//         setIsRecording(false);
//         setAudioChunks([]);
//       };
//     }
//   };

//   return (
//     <div>
//
//       <audio ref={audioRef} controls />
//     </div>
//   );
// };

// export default AudioRecorder;

import { useRef, useState } from "react";
const AudioRecorder = () => {
  const [recordedUrl, setRecordedUrl] = useState("");
  const mediaStream = useRef<any>(null);
  const mediaRecorder = useRef<any>(null);
  const chunks = useRef<any>([]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e: any) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: "audio/webm" });
        const url = URL.createObjectURL(recordedBlob);
        setRecordedUrl(url);
        chunks.current = [];
      };
      mediaRecorder.current.start();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track: any) => {
        track.stop();
      });
    }
  };
  return (
    <div>
      <audio controls src={recordedUrl} />
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
    </div>
  );
};
export default AudioRecorder;
