const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock');

/**
 * GET request to /stocks/get/:id
 */
router.get("/get/:symbol", async(req, res, next) => {

    // req.params.stock
    // req.query <- if doing query params (kvps)
    try {
        let stockData = await stockController.get(req.params.symbol);
        res.json(stockData);
    } catch(e) {
        console.log(e);
    }
});

module.exports = router;