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
  const [sessionId, setSessionId] = useState(() => getOrCreateSessionId());
  const [showTooltip, setShowTooltip] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);
  const audioRef = useRef(null);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      if (!audioEnabled && audioRef.current) {
        // Try to play and immediately pause to unlock audio
        audioRef.current.play()
          .then(() => {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setAudioEnabled(true);
            console.log('Audio unlocked and ready!');
          })
          .catch(err => console.log('Audio unlock failed, will try on next interaction:', err));
      }
    };

    // Listen for user interactions
    document.addEventListener('click', enableAudio, { once: false });
    document.addEventListener('touchstart', enableAudio, { once: false });
    document.addEventListener('keydown', enableAudio, { once: false });
    document.addEventListener('scroll', enableAudio, { once: false });

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      document.removeEventListener('scroll', enableAudio);
    };
  }, [audioEnabled]);

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

  // Show tooltip with sound and bounce effect once after page load
  useEffect(() => {
    // Show tooltip + sound after 3 seconds (one time only)
    tooltipTimeoutRef.current = setTimeout(() => {
      if (!isChatOpen && audioEnabled && audioRef.current) {
        console.log('Showing tooltip and playing sound...');
        setShowTooltip(true);

        // Play notification sound
        audioRef.current.currentTime = 0;
        audioRef.current.play()
          .then(() => console.log('✓ Notification sound played!'))
          .catch(err => console.error('Sound play failed:', err));

        // Hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      } else if (!audioEnabled && !isChatOpen) {
        console.log('Audio not enabled yet - waiting for user interaction');
      }
    }, 3000);

    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [isChatOpen, audioEnabled]);

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
    // Generate new session ID
    const newSessionId = getOrCreateSessionId();
    setSessionId(newSessionId);
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

  const handleSuggestionClick = async (suggestion) => {
    trackChatSuggestion(suggestion);
    setInputValue(suggestion);

    // Auto-submit the suggestion
    if (!isLoading) {
      // Add user message
      const userMessage = {
        id: Date.now(),
        text: suggestion,
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
        trackChatMessage(suggestion.length);

        let accumulatedText = '';

        await sendChatMessage(
          suggestion,
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
    }
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
      {/* Audio element for notification sound */}
      <audio
        ref={audioRef}
        preload="auto"
        onError={(e) => console.error('Audio load error:', e)}
        onCanPlay={() => console.log('Audio ready to play')}
      >
        <source src="/notification-pop.wav" type="audio/wav" />
      </audio>

      {/* Chat Toggle Button */}
      <div className="chat-toggle-wrapper">
        <button
          className={`chat-toggle-btn ${isChatOpen ? 'active' : ''} ${showTooltip ? 'bounce' : ''}`}
          onClick={toggleChat}
          aria-label="Toggle AI Assistant"
        >
          {isChatOpen ? (
            <i className="fas fa-times"></i>
          ) : (
            <i className="fas fa-robot"></i>
          )}
        </button>

        {/* Tooltip Message */}
        {showTooltip && !isChatOpen && (
          <div className="chat-tooltip">
            <div className="chat-tooltip-content">
              <span className="tooltip-icon">👋</span>
              <span className="tooltip-text">Hi! Ask me anything about Tushar!</span>
            </div>
            <div className="chat-tooltip-arrow"></div>
          </div>
        )}
      </div>

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
