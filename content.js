// Inject intercept.js into the page
const script = document.createElement("script");
script.src = chrome.runtime.getURL("intercept.js");
document.documentElement.appendChild(script);

// Listen for messages coming from intercept.js
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== "myExtension") return;

  chrome.runtime.sendMessage(event.data);
});

