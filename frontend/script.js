// ==========================================
// API CONFIGURATION
// ==========================================

const API_URL = "http://localhost:5000/api/urls";


// ==========================================
// DOM ELEMENTS
// ==========================================

const shortenForm = document.getElementById("shortenForm");

const originalUrlInput =
    document.getElementById("originalUrl");

const customAliasInput =
    document.getElementById("customAlias");

const shortenBtn =
    document.getElementById("shortenBtn");

const resultBox =
    document.getElementById("resultBox");

const shortUrlInput =
    document.getElementById("shortUrl");

const copyBtn =
    document.getElementById("copyBtn");

const errorBox =
    document.getElementById("errorBox");

const historyList =
    document.getElementById("historyList");

const refreshHistoryBtn =
    document.getElementById("refreshHistoryBtn");


// ==========================================
// SHORTEN URL
// ==========================================

shortenForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const originalUrl =
        originalUrlInput.value.trim();

    const customAlias =
        customAliasInput.value.trim();

    // Reset messages
    resultBox.classList.add("hidden");
    errorBox.classList.add("hidden");

    // Validate URL
    if (!originalUrl) {
        showError("Please enter a URL.");
        return;
    }

    // Validate alias on frontend
    if (
        customAlias &&
        !/^[a-zA-Z0-9_-]{3,30}$/.test(customAlias)
    ) {
        showError(
            "Alias must be 3-30 characters and contain only letters, numbers, hyphens or underscores."
        );

        return;
    }

    // Loading state
    shortenBtn.disabled = true;
    shortenBtn.innerHTML =
        "Shortening... ⏳";

    try {

        // ==========================================
        // API REQUEST
        // ==========================================

        const response = await fetch(API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                originalUrl,
                alias: customAlias || undefined
            })
        });


        const data = await response.json();


        // ==========================================
        // HANDLE API ERROR
        // ==========================================

        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Unable to shorten URL."
            );
        }


        // ==========================================
        // SHOW RESULT
        // ==========================================

        shortUrlInput.value =
            data.data.shortUrl;

        resultBox.classList.remove("hidden");


        // ==========================================
        // CLEAR FORM
        // ==========================================

        originalUrlInput.value = "";
        customAliasInput.value = "";


        // ==========================================
        // REFRESH HISTORY
        // ==========================================

        loadHistory();


    } catch (error) {

        console.error(
            "Shorten URL Error:",
            error
        );

        showError(
            error.message ||
            "Something went wrong."
        );

    } finally {

        // Restore button
        shortenBtn.disabled = false;

        shortenBtn.innerHTML =
            'Shorten URL <span>→</span>';
    }
});


// ==========================================
// COPY SHORT URL
// ==========================================

copyBtn.addEventListener(
    "click",
    async () => {

        const shortUrl =
            shortUrlInput.value;

        if (!shortUrl) {
            return;
        }

        try {

            await navigator.clipboard
                .writeText(shortUrl);

            copyBtn.textContent =
                "Copied ✓";

            setTimeout(() => {

                copyBtn.textContent =
                    "Copy";

            }, 2000);


        } catch (error) {

            console.error(
                "Copy Error:",
                error
            );

            // Fallback copy
            shortUrlInput.select();

            document.execCommand("copy");

            copyBtn.textContent =
                "Copied ✓";

            setTimeout(() => {

                copyBtn.textContent =
                    "Copy";

            }, 2000);
        }
    }
);


// ==========================================
// LOAD URL HISTORY
// ==========================================

async function loadHistory() {

    historyList.innerHTML = `
        <p class="history-empty">
            Loading history... ⏳
        </p>
    `;

    try {

        const response =
            await fetch(`${API_URL}/history`);

        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Unable to load history."
            );
        }


        // ==========================================
        // NO HISTORY
        // ==========================================

        if (
            !data.data ||
            data.data.length === 0
        ) {

            historyList.innerHTML = `
                <p class="history-empty">
                    No shortened URLs yet.
                </p>
            `;

            return;
        }


        // ==========================================
        // DISPLAY HISTORY
        // ==========================================

        historyList.innerHTML =
            data.data.map((url) => {

                return `
                    <div class="history-item">

                        <div class="history-info">

                            <div
                                class="history-original"
                                title="${escapeHtml(url.originalUrl)}"
                            >
                                ${escapeHtml(url.originalUrl)}
                            </div>

                            <a
                                class="history-short"
                                href="${url.shortUrl}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${escapeHtml(url.shortUrl)}
                            </a>

                        </div>

                        <div class="history-stats">

                            👆 ${url.clicks} clicks

                        </div>

                    </div>
                `;

            }).join("");


    } catch (error) {

        console.error(
            "History Error:",
            error
        );

        historyList.innerHTML = `
            <p class="history-empty">
                Unable to load history.
            </p>
        `;
    }
}


// ==========================================
// REFRESH HISTORY
// ==========================================

refreshHistoryBtn.addEventListener(
    "click",
    loadHistory
);


// ==========================================
// SHOW ERROR
// ==========================================

function showError(message) {

    errorBox.textContent =
        message;

    errorBox.classList.remove(
        "hidden"
    );
}


// ==========================================
// HTML ESCAPING
// ==========================================

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// LOAD HISTORY ON PAGE LOAD
// ==========================================

loadHistory();