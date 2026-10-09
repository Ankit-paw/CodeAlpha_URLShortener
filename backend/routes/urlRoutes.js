const express = require("express");

const {
  createShortUrl,
  redirectToOriginalUrl,
  getUrlAnalytics,
  getUrlHistory,
} = require("../controllers/urlController");

const router = express.Router();

// ==========================================
// CREATE SHORT URL
// POST /api/urls
// ==========================================

router.post("/", createShortUrl);


// ==========================================
// GET URL HISTORY
// GET /api/urls/history
// ==========================================

router.get("/history", getUrlHistory);


// ==========================================
// GET URL ANALYTICS
// GET /api/urls/analytics/:shortCode
// ==========================================

router.get("/analytics/:shortCode", getUrlAnalytics);


// ==========================================
// REDIRECT
// GET /api/urls/:shortCode
// ==========================================

router.get("/:shortCode", redirectToOriginalUrl);


module.exports = router;