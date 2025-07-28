// Debug utility for API responses
export const debugAPI = (response, endpoint) => {
  console.log(`🔍 API Debug - ${endpoint}:`, {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    headers: response.headers
  });
};

export const debugError = (error, endpoint) => {
  console.error(`❌ API Error - ${endpoint}:`, {
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
    config: error.config
  });
};

// Helper to check if response has new format
export const hasNewFormat = (response) => {
  return response.data && typeof response.data.success === 'boolean' && response.data.data;
};

// Helper to extract data from response (handles both old and new formats)
export const extractData = (response) => {
  if (hasNewFormat(response)) {
    return response.data.data;
  }
  return response.data;
}; 