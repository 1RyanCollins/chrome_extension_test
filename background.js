let searchQueries = [];
let searchUrls = [];

// Receive messages from content.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Store queries
  if (msg.event === "searchQueries") {
    searchQueries = msg.data;
  }

  // Store URLs
  if (msg.event === "searchUrls") {
    searchUrls = msg.data;
  }

  // Popup requests data
  if (msg.event === "getData") {
    sendResponse({
      event: "dataResponse",
      searchQueries,
      searchUrls
    });
  }

  return true; // allows async sendResponse
});
