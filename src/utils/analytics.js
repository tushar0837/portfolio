/**
 * Google Analytics Event Tracking Utility
 * Centralizes all GA event tracking for consistent analytics
 */

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else {
    console.warn('Google Analytics (gtag) not loaded');
  }
};

/**
 * Track button clicks
 * @param {string} buttonName - Name/identifier of the button
 * @param {string} location - Where the button is located
 */
export const trackButtonClick = (buttonName, location = 'Unknown') => {
  trackEvent('button_click', {
    button_name: buttonName,
    screen_name: location,
  });
};

/**
 * Track social media link clicks
 * @param {string} platform - Social platform (linkedin, github, etc.)
 */
export const trackSocialClick = (platform) => {
  trackEvent('social_click', {
    platform: platform,
    category: 'Social Media',
  });
};

/**
 * Track AI Chat interactions
 */
export const trackChatOpen = () => {
  trackEvent('chat_opened', {
    category: 'AI Assistant',
    interaction_type: 'open',
  });
};

export const trackChatClose = () => {
  trackEvent('chat_closed', {
    category: 'AI Assistant',
    interaction_type: 'close',
  });
};

export const trackChatMessage = (questionLength) => {
  trackEvent('chat_message_sent', {
    category: 'AI Assistant',
    message_length: questionLength,
  });
};

export const trackChatSuggestion = (suggestion) => {
  trackEvent('chat_suggestion_clicked', {
    category: 'AI Assistant',
    suggestion_text: suggestion,
  });
};

export const trackChatClear = () => {
  trackEvent('chat_cleared', {
    category: 'AI Assistant',
    interaction_type: 'clear',
  });
};

/**
 * Track Calendly interactions
 */
export const trackCalendlyScroll = () => {
  trackEvent('calendly_scrolled', {
    category: 'Calendly',
    action: 'scroll_to_booking',
  });
};

export const trackCalendlyEventScheduled = () => {
  trackEvent('meeting_scheduled', {
    category: 'Calendly',
    action: 'event_scheduled',
    value: 1, // High-value conversion
  });
};

/**
 * Track navigation actions
 */
export const trackScrollToTop = () => {
  trackEvent('scroll_to_top', {
    category: 'Navigation',
    action: 'back_to_top',
  });
};

export const trackResumeView = () => {
  trackEvent('resume_viewed', {
    category: 'Resume',
    action: 'view_resume',
  });
};

export const trackResumeDownload = () => {
  trackEvent('resume_downloaded', {
    category: 'Resume',
    action: 'download_resume',
    value: 1, // Important conversion event
  });
};

/**
 * Track page engagement
 */
export const trackTimeOnPage = (seconds) => {
  trackEvent('time_on_page', {
    category: 'Engagement',
    time_seconds: seconds,
  });
};

export const trackScrollDepth = (percentage) => {
  trackEvent('scroll_depth', {
    category: 'Engagement',
    scroll_percentage: percentage,
  });
};

/**
 * Track errors
 */
export const trackError = (errorMessage, component = 'Unknown') => {
  trackEvent('exception', {
    description: errorMessage,
    component: component,
    fatal: false,
  });
};
