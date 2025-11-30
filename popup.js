function displayLinks() {
    chrome.storage.local.get(['googleLinks', 'chatGPTLinks'], (res) => {
        const googleLinks = res.googleLinks || [];
        const chatGPTLinks = res.chatGPTLinks || [];

        const bothDiv = document.getElementById('both');
        const googleOnlyDiv = document.getElementById('googleOnly');
        const chatOnlyDiv = document.getElementById('chatOnly');

        const googleSet = new Set(googleLinks);
        const chatSet = new Set(chatGPTLinks);

        const both = googleLinks.filter(link => chatSet.has(link));
        const googleOnly = googleLinks.filter(link => !chatSet.has(link));
        const chatOnly = chatGPTLinks.filter(link => !googleSet.has(link));

        function populate(div, links) {
            div.innerHTML = '';
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = link;
                a.textContent = link;
                a.target = "_blank";
                div.appendChild(a);
            });
        }

        populate(bothDiv, both);
        populate(googleOnlyDiv, googleOnly);
        populate(chatOnlyDiv, chatOnly);
    });
}

displayLinks();
