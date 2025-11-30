let searchQueries = [];
let searchUrls = [];

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.event === "searchQueries") {
    searchQueries = msg.data;
  }

  if (msg.event === "searchUrls") {
    searchUrls = msg.data;
  }

  // Allow popup.js to request the data
  if (msg.event === "getData") {
    chrome.runtime.sendMessage({
      event: "dataResponse",
      searchQueries,
      searchUrls
    });
  }
});

    }
}

window.EventSource = HookedEventSource;
