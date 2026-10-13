const crypto = require("crypto");
const Url = require("../models/url");

const BASE_URL = (
    process.env.BASE_URL ||
    "https://codealpha-urlshortener-4n5t.onrender.com"
).replace(/\/+$/, "");

// Create a short URL
async function createShortUrl(req, res) {
    try {
        const { originalUrl } = req.body;

        if (!originalUrl || typeof originalUrl !== "string") {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid URL."
            });
        }

        let parsedUrl;

        try {
            parsedUrl = new URL(originalUrl);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Invalid URL provided."
            });
        }

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return res.status(400).json({
                success: false,
                message: "Only HTTP and HTTPS URLs are supported."
            });
        }

        // Generate a unique short code
        let shortCode;

        do {
            shortCode = crypto.randomBytes(4).toString("hex");
        } while (await Url.exists({ shortCode }));

        // Save the URL in MongoDB
        const savedUrl = await Url.create({
            originalUrl: parsedUrl.href,
            shortCode
        });

        // Generate the complete short URL
        const shortUrl = `${BASE_URL}/${savedUrl.shortCode}`;

        return res.status(201).json({
            success: true,
            originalUrl: savedUrl.originalUrl,
            shortCode: savedUrl.shortCode,
            shortUrl: shortUrl
        });

    } catch (error) {
        console.error("Create Short URL Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create short URL."
        });
    }
}

// Redirect to the original URL
async function redirectToOriginalUrl(req, res) {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOneAndUpdate(
            { shortCode },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!url) {
            return res.status(404).send("Short URL not found.");
        }

        return res.redirect(url.originalUrl);

    } catch (error) {
        console.error("Redirect Error:", error);

        return res.status(500).send("Server error.");
    }
}

// Get URL analytics
async function getUrlAnalytics(req, res) {
    try {
        const { shortCode } = req.params;

        const url = await Url.findOne({ shortCode });

        if (!url) {
            return res.status(404).json({
                success: false,
                message: "Short URL not found."
            });
        }

        return res.json({
            success: true,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${BASE_URL}/${url.shortCode}`,
            clicks: url.clicks,
            createdAt: url.createdAt
        });

    } catch (error) {
        console.error("Analytics Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics."
        });
    }
}

// Get URL history
async function getUrlHistory(req, res) {
    try {
        const urls = await Url.find()
            .sort({ createdAt: -1 })
            .limit(50);

        return res.json({
            success: true,
            urls: urls.map((url) => ({
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `${BASE_URL}/${url.shortCode}`,
                clicks: url.clicks,
                createdAt: url.createdAt
            }))
        });

    } catch (error) {
        console.error("URL History Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch URL history."
        });
    }
}

module.exports = {
    createShortUrl,
    redirectToOriginalUrl,
    getUrlAnalytics,
    getUrlHistory
};