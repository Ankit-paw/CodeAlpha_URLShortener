const crypto = require("crypto");
const Url = require("../models/url");

// ==========================================
// CREATE SHORT URL
// ==========================================

const createShortUrl = async (req, res) => {
  try {
    const { originalUrl, alias } = req.body;

    // Check original URL
    if (!originalUrl) {
      return res.status(400).json({
        success: false,
        message: "Original URL is required",
      });
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid URL",
      });
    }

    // ==========================================
    // CUSTOM ALIAS VALIDATION
    // ==========================================

    let cleanAlias;

    if (alias) {
      cleanAlias = alias.trim().toLowerCase();

      // 3-30 characters
      if (cleanAlias.length < 3 || cleanAlias.length > 30) {
        return res.status(400).json({
          success: false,
          message: "Alias must be between 3 and 30 characters",
        });
      }

      // Only letters, numbers, hyphen and underscore
      if (!/^[a-z0-9_-]+$/.test(cleanAlias)) {
        return res.status(400).json({
          success: false,
          message:
            "Alias can contain only letters, numbers, hyphens and underscores",
        });
      }

      // Check if alias already exists
      const existingAlias = await Url.findOne({
        alias: cleanAlias,
      });

      if (existingAlias) {
        return res.status(409).json({
          success: false,
          message: "This custom alias is already taken",
        });
      }
    }

    // ==========================================
    // GENERATE UNIQUE SHORT CODE
    // ==========================================

    let shortCode;
    let existingUrl;

    do {
      shortCode = crypto.randomBytes(4).toString("hex");

      existingUrl = await Url.findOne({
        shortCode,
      });
    } while (existingUrl);

    // ==========================================
    // SAVE URL
    // ==========================================

    const newUrl = await Url.create({
      originalUrl: originalUrl.trim(),
      shortCode,
      alias: cleanAlias || undefined,
    });

    // Use alias if available
    const shortPath = newUrl.alias || newUrl.shortCode;

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",

      data: {
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        alias: newUrl.alias || null,
        shortUrl: `${process.env.BASE_URL}/${shortPath}`,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Short URL Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// REDIRECT SHORT URL
// ==========================================

const redirectToOriginalUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find using shortCode OR alias
    const url = await Url.findOne({
      $or: [
        { shortCode: shortCode },
        { alias: shortCode.toLowerCase() },
      ],
    });

    // URL not found
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    // ==========================================
    // INCREASE CLICK COUNT
    // ==========================================

    url.clicks += 1;

    await url.save();

    // ==========================================
    // REDIRECT
    // ==========================================

    return res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET URL ANALYTICS
// ==========================================

const getUrlAnalytics = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find using shortCode OR alias
    const url = await Url.findOne({
      $or: [
        { shortCode: shortCode },
        { alias: shortCode.toLowerCase() },
      ],
    });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    // Determine active path
    const shortPath = url.alias || url.shortCode;

    return res.status(200).json({
      success: true,

      data: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        alias: url.alias || null,
        shortUrl: `${process.env.BASE_URL}/${shortPath}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        updatedAt: url.updatedAt,
      },
    });
  } catch (error) {
    console.error("Analytics Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// GET URL HISTORY
// ==========================================

const getUrlHistory = async (req, res) => {
  try {
    const urls = await Url.find()
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      count: urls.length,

      data: urls.map((url) => {
        const shortPath = url.alias || url.shortCode;

        return {
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          alias: url.alias || null,
          shortUrl: `${process.env.BASE_URL}/${shortPath}`,
          clicks: url.clicks,
          createdAt: url.createdAt,
        };
      }),
    });
  } catch (error) {
    console.error("History Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlAnalytics,
  getUrlHistory,
};