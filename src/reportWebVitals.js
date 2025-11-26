const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getINP, getFCP, getLCP, getTTFB, getFID }) => {
      // Core Web Vitals - Updated for 2024-2025
      getCLS(onPerfEntry);  // Cumulative Layout Shift
      getINP(onPerfEntry);  // Interaction to Next Paint (replaced FID in March 2024)
      getLCP(onPerfEntry);  // Largest Contentful Paint

      // Additional Performance Metrics
      getFCP(onPerfEntry);  // First Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte

      // Legacy support for FID (deprecated but kept for compatibility)
      if (getFID) {
        getFID(onPerfEntry);
      }
    }).catch(error => {
      console.error('Error loading web-vitals:', error);
    });
  }
};

export default reportWebVitals;
