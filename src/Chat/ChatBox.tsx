import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import EmojiPicker from "../EmojiPicker";
import { sendMessage, useSubscribeToMessages } from "../services/chatService";
import ChatBubble from "./ChatBubble";
import { IMessageData } from "../types";
import SmileyIcon from "../icons/SmileyIcon";
import SendMessageIcon from "../icons/SendMessageIcon";
import MicIcon from "../icons/MicIcon";
import TickIcon from "../icons/TickIcon.tsx";
import CancelIcon from "../icons/CancelIcon";
import AudioPlayer from "../AudioRecorder/AudioPlayer.tsx";
import CrossWithBlueCircleIcon from "../icons/CrossWithBlueCircleIcon.tsx";

interface ChatBoxProps {
  loggedInUser: string;
  receiverId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  loggedInUser: currentUser,
  receiverId,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessageData[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const waveFormRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<any>();

  useSubscribeToMessages(receiverId, setMessages);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || audioBlob) {
      const messageData: IMessageData = {
        senderId: currentUser,
        receiverId,
        message: audioBlob ? URL.createObjectURL(audioBlob) : message,
        type: audioBlob ? "audio" : "text",
      };
      sendMessage(messageData);
      setMessage("");
      setAudioBlob(null);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      setAudioBlob(event.data);
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);

    // Initialize WaveSurfer
    const waveSurferInstance = WaveSurfer.create({
      container: "#waveform",
      waveColor: "violet",
      progressColor: "purple",
    });
    setWaveSurfer(waveSurferInstance);

    // Update WaveSurfer with the audio stream
    waveSurferInstance.load(stream as any);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  if (!receiverId)
    return (
      <div className="flex w-full h-full justify-center items-center">
        Select a chat
      </div>
    );

  const filteredMessages = messages.filter((msg) => {
    return (
      (msg.senderId === currentUser && msg.receiverId === receiverId) ||
      (msg.senderId === receiverId && msg.receiverId === currentUser)
    );
  });

  return (
    <div className="h-full p-4 flex flex-col w-full relative ">
      <h1 className="text-lg font-bold mb-4">Chat with {receiverId}</h1>
      <div className="flex-grow overflow-y-scroll border p-4 mb-4">
        {filteredMessages.map((messageData: IMessageData) => (
          <ChatBubble
            key={messageData.id}
            message={messageData.message}
            isSent={messageData.senderId === currentUser}
            type={messageData.type === "audio" ? "audio" : "text"}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      {isRecording && (
        <div className="flex items-center justify-between bg-white rounded-lg border-2 p-2 w-80 absolute bottom-20 right-10 border-[#424BF9]">
          <div id="waveform" ref={waveFormRef} className="flex-grow"></div>
          <button
            onClick={() => {
              setIsRecording(false);
              setAudioBlob(null);
            }}
            className="ml-4 p-2"
          >
            <CancelIcon />
          </button>
        </div>
      )}
      <div className="border border-red-500 flex flex-col p-3 gap-2">
        {audioBlob && (
          <div className="rounded-md relative w-fit">
            <div
              className="top-0 right-0 absolute z-10 cursor-pointer -mr-2 -mt-2"
              onClick={() => {
                setAudioBlob(null);
              }}
            >
              <CrossWithBlueCircleIcon />
            </div>
            <AudioPlayer audioBlob={audioBlob} />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex relative gap-3">
          <div className="flex flex-row w-full pr-1 rounded-md">
            <input
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete="off"
              className="rounded-md flex-grow mr-2 p-2"
              placeholder="Type a message"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="mr-4 cursor-pointer"
            >
              <SmileyIcon />
            </button>
            {message || audioBlob ? (
              <button type="submit" className="cursor-pointer">
                <SendMessageIcon />
              </button>
            ) : (
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className="cursor-pointer"
              >
                {isRecording ? <TickIcon /> : <MicIcon />}
              </button>
            )}
          </div>
          <div
            className={`z-10 absolute h-96 w-80 bottom-full mb-2 right-10 ${
              showEmojiPicker ? "block" : "hidden"
            }`}
          >
            <EmojiPicker
              open={showEmojiPicker}
              isForInputBox={{ inputRef, setInputValue: setMessage }}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;
