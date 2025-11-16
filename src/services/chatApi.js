// Chat API Service with streaming support

const API_BASE_URL = process.env.REACT_APP_CHAT_API_URL || 'http://localhost:8000';
const LOCALHOST_TOKEN = process.env.REACT_APP_LOCALHOST_TOKEN;

/**
 * Get headers for API requests
 * Includes X-API-Token for localhost development
 * @returns {Object} - Headers object
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // Add token for localhost requests
  if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
    if (LOCALHOST_TOKEN) {
      headers['X-API-Token'] = LOCALHOST_TOKEN;
    } else {
      console.warn('Warning: Localhost detected but REACT_APP_LOCALHOST_TOKEN is not set!');
    }
  }

  return headers;
};

/**
 * Send a chat message with streaming support
 * @param {string} question - The user's question
 * @param {string} sessionId - Unique session identifier
 * @param {function} onChunk - Callback function for each streaming chunk
 * @returns {Promise<string>} - Complete response text
 */
export const sendChatMessage = async (question, sessionId, onChunk) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat?question=${question}&session_id=${sessionId}`, {
      method: 'GET',
      headers: getHeaders()
    });
    

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before sending more messages.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle Server-Sent Events (SSE) streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      // Decode the chunk and add to buffer
      buffer += decoder.decode(value, { stream: true });

      // Process complete lines from buffer
      const lines = buffer.split('\n');

      // Keep the last incomplete line in buffer
      buffer = lines.pop() || '';

      for (const line of lines) {
        // Parse SSE format: "data: content"
        if (line.startsWith('data: ')) {
          const content = line.substring(6); // Remove "data: " prefix

          // Ignore the [DONE] message
          if (content === '[DONE]') {
            continue;
          }

          // Check for error messages from backend
          if (content.includes('Error:') || content.includes('error:')) {
            console.warn('Backend error detected:', content);
            // Still continue processing but log the error
          }

          // Add content to full text
          fullText += content;

          // Call the callback with the parsed content
          if (onChunk) {
            onChunk(content);
          }
        }
      }
    }

    return fullText;
  } catch (error) {
    console.error('Error sending chat message:', error);
    // Provide user-friendly error messages
    if (error.message.includes('Rate limit')) {
      throw new Error('Too many messages! Please wait before chatting again.');
    }
    throw error;
  }
};

/**
 * Send a chat message without streaming (simple version)
 * @param {string} question - The user's question
 * @param {string} sessionId - Unique session identifier
 * @returns {Promise<string>} - Complete response text
 */
export const sendChatMessageSimple = async (question, sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat?question=${question}&session_id=${sessionId}`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      // Handle rate limiting
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait before sending more messages.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Error sending chat message:', error);
    // Provide user-friendly error messages
    if (error.message.includes('Rate limit')) {
      throw new Error('Too many messages! Please wait before chatting again.');
    }
    throw error;
  }
};

/**
 * Generate a unique session ID for the chat
 * @returns {string} - Unique session ID
 */
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get or create session ID from localStorage
 * @returns {string} - Session ID
 */
export const getOrCreateSessionId = () => {
  const storageKey = 'chat_session_id';
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
};

/**
 * Clear the current session
 */
export const clearSession = () => {
  localStorage.removeItem('chat_session_id');
};
