// ChatWindow.js
import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import logo from "/images/logo_stockgro.png";
import InputBox from "./InputBox";
import axios from "axios";
import "../assets/ChatWindow.css";
const ChatWindow = () => {
  const chatContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (inputText) => {
    if (!inputText) {
      return;
    }
    console.log(inputText)
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, sender: "user", timestamp: new Date() },
    ]);

    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/answer/", {
        question: inputText,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setTimeout(6000);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: response.data.answer,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      // Handle error, e.g., display an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat-window`}>
      <div className="header">
        <div id="chat-header">
          <img src={logo} alt="gemini" className="logo" />
          <div>
            <h1>Conversational ChatBot</h1>
            <small>Making Investment Social</small>
          </div>
        </div>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "ai"}`}
          >
            <p className="message-text">{message.text}</p>
            <span className={`time ${message.sender === "user" ? "user" : "ai"}`}>
              {message.timestamp
                ? dayjs(message.timestamp).format("DD.MM.YYYY HH:mm:ss")
                : ""}
            </span>
          </div>
        ))}
        {loading && (
          <div className="message ai">
            <p className="message-text">AI is thinking...</p>
          </div>
        )}
      </div>
      <InputBox sendMessage={sendMessage} loading={loading} />
    </div>
  );
};

export default ChatWindow;
