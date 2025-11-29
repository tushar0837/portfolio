const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFCP, getLCP, getTTFB, getFID }) => {
      // Core Web Vitals
      getCLS(onPerfEntry);  // Cumulative Layout Shift
      getLCP(onPerfEntry);  // Largest Contentful Paint
      getFID(onPerfEntry);  // First Input Delay

      // Additional Performance Metrics
      getFCP(onPerfEntry);  // First Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    }).catch(error => {
      console.error('Error loading web-vitals:', error);
    });
  }
};

export default reportWebVitals;
