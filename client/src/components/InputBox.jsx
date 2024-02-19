// InputBox.js
import React, { useState } from "react";
import axios from "axios";

const InputBox = ({ sendMessage, loading }) => {
  const [input, setInput] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  const handleClick = () => {
    if (input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="input-box">
      {loading && <progress style={{ width: "100%" }} />}
      <input
        disabled={loading}
        type="text"
        className="form-control"
        placeholder="Type a message..."
        value={loading ? "Loading..." : input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button disabled={loading} onClick={handleClick}>
        Send
      </button>
    </div>
  );
};

export default InputBox;
