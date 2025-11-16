import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

const ChatMessage = ({ message, isUser, isTyping }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-avatar">
        {isUser ? (
          <i className="fas fa-user"></i>
        ) : (
          <i className="fas fa-robot"></i>
        )}
      </div>
      <div className="message-content">
        {isTyping ? (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown>{message}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
