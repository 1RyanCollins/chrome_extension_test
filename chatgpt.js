// Hook EventSource for ChatGPT SSE
const OriginalEventSource = window.EventSource;

class HookedEventSource extends OriginalEventSource {
    constructor(url, config) {
        super(url, config);

        this.addEventListener('message', (e) => {
            try {
                const dataObj = JSON.parse(e.data);
                const entries = dataObj.v?.message?.metadata?.search_result_groups || [];
                let chatGPTLinks = [];
                entries.forEach(group => {
                    group.entries.forEach(entry => {
                        chatGPTLinks.push(entry.url);
                    });
                });

                if (chatGPTLinks.length > 0) {
                    chrome.storage.local.get({ chatGPTLinks: [] }, (res) => {
                        const updated = res.chatGPTLinks.concat(chatGPTLinks);
                        chrome.storage.local.set({ chatGPTLinks: updated });
                        console.log("Captured ChatGPT links:", chatGPTLinks);
                    });
                }
            } catch(err) {
                // ignore non-JSON messages
            }
        });
    }
}

window.EventSource = HookedEventSource;
