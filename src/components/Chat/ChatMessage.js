import React from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatMessage.css';

const ChatMessage = ({ message, isUser, isTyping, onLinkClick }) => {
  // Handle clicks on links within markdown content
  const handleContentClick = (e) => {
    // Check if the clicked element is a link
    const link = e.target.closest('a');
    if (link && link.hash) {
      // If it's an internal hash link (like #book-meeting)
      e.preventDefault();

      // Close the chat first
      if (onLinkClick) {
        onLinkClick();
      }

      // Wait a bit for chat to close, then scroll
      setTimeout(() => {
        const targetId = link.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Update URL hash
        window.history.pushState(null, null, link.hash);
      }, 300); // 300ms delay to allow chat close animation
    }
  };

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-avatar">
        {isUser ? (
          <i className="fas fa-user"></i>
        ) : (
          <i className="fas fa-robot"></i>
        )}
      </div>
      <div className="message-content" onClick={handleContentClick}>
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
