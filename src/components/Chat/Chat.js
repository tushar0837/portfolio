import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { sendChatMessage, getOrCreateSessionId, clearSession } from '../../services/chatApi';
import { trackChatOpen, trackChatClose, trackChatMessage, trackChatSuggestion, trackChatClear } from '../../utils/analytics';
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sessionId] = useState(() => getOrCreateSessionId());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: trimmedInput,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Create a placeholder for bot response
    const botMessageId = Date.now() + 1;
    const botMessage = {
      id: botMessageId,
      text: '',
      isUser: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);

    try {
      // Track chat message sent
      trackChatMessage(trimmedInput.length);

      let accumulatedText = '';

      await sendChatMessage(
        trimmedInput,
        sessionId,
        (chunk) => {
          // Accumulate streamed content
          accumulatedText += chunk;

          // Update message immediately
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId
                ? { ...msg, text: accumulatedText }
                : msg
            )
          );
        }
      );

    } catch (error) {
      console.error('Error sending message:', error);

      // Update with error message
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, text: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    trackChatClear();
    setMessages([]);
    clearSession();
    window.location.reload(); // Reload to get new session
  };

  const toggleChat = () => {
    const newState = !isChatOpen;
    setIsChatOpen(newState);

    // Track open/close events
    if (newState) {
      trackChatOpen();
    } else {
      trackChatClose();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    trackChatSuggestion(suggestion);
    setInputValue(suggestion);
    // Optionally auto-send the message
    // You can uncomment the next line to auto-send when clicking a suggestion
    // handleSendMessage({ preventDefault: () => {} });
  };

  // Suggested questions for quick access
  const suggestions = [
    "What is Tushar's experience?",
    "Tell me about his projects",
    "What skills does Tushar have?",
    "How can I contact Tushar?"
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className={`chat-toggle-btn ${isChatOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle AI Assistant"
      >
        {isChatOpen ? (
          <i className="fas fa-times"></i>
        ) : (
          <i className="fas fa-robot"></i>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chat-container ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <i className="fas fa-robot"></i>
            <div>
              <h3>AI Assistant</h3>
              <span className="chat-status">
                <span className="status-dot"></span>
                Online
              </span>
            </div>
          </div>
          <div className="chat-header-actions">
            <button
              onClick={handleClearChat}
              className="chat-action-btn"
              title="Clear chat"
            >
              <i className="fas fa-trash"></i>
            </button>
            <button
              onClick={toggleChat}
              className="chat-action-btn"
              title="Close chat"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <i className="fas fa-robot"></i>
              <h4>Welcome to AI Chat!</h4>
              <p>Ask me anything about Tushar's experience, skills, or projects.</p>

              <div className="chat-suggestions">
                <p className="suggestions-label">Try asking:</p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-chip"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isUser={msg.isUser}
                isTyping={!msg.isUser && !msg.text && isLoading}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-container" onSubmit={handleSendMessage}>
          <input
            ref={inputRef}
            type="text"
            className="chat-input"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default Chat;
