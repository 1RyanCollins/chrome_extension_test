(function () {
  const originalFetch = window.fetch;

  window.fetch = async (...args) => {
    const response = await originalFetch(...args);

    // Only inspect streaming conversation events
    if (typeof args[0] === "string" && args[0].includes("/conversation")) {
      const clone = response.clone();
      const reader = clone.body.getReader();
      const decoder = new TextDecoder("utf-8");

      async function readStream() {
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          const lines = chunk.split("\n");
          for (const line of lines) {
            if (!line.startsWith("data:")) continue;

            try {
              const json = JSON.parse(line.replace("data:", "").trim());

              // SEARCH MODEL QUERIES
              if (json.p === "/message/metadata/search_model_queries") {
                window.postMessage({
                  source: "myExtension",
                  event: "searchQueries",
                  data: json.v
                });
              }

              // SEARCH RESULT GROUPS → URLs
              if (json.p === "/message/metadata/search_result_groups") {
                const urls = [];
                json.v.forEach(group => {
                  group.entries.forEach(entry => {
                    if (entry.url) urls.push(entry.url);
                  });
                });

                window.postMessage({
                  source: "myExtension",
                  event: "searchUrls",
                  data: urls
                });
              }
            } catch (e) {
              // ignore partial chunks
            }
          }
        }
      }

      readStream().catch(console.error);
    }

    return response;
  };
})();
