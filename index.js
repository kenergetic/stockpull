/**
 * Periodically gets stock 5-minute data from AlphaVantage and saves it to a ticker.db
 * 
 * The purpose is to store data for other web applications to use; AlphaVantage limits 
 * requests on a free key (5 requests per minute, 500 per day)
 * 
 * This requires an AlphaVantage API key (free)
 */

const cron = require('node-cron');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

app = express();

//routes 
const stocksRoutes = require('./src/routes/stocks');

// cron job
const cronService = require('./src/services/cron');

// port
dotenv.config();
const port = process.env.PORT || 3128;

// * Gets raw data from AlphaVantage and stores it in a sqlite db
// * Run from 9am-4pm EDT, Monday-Friday
// * https://crontab.guru/
// * Note: Pull more frequently then the 5 minute candle - close values sometimes update
//      - AlphaVantage is limited to 500 API calls per day
cron.schedule('*/2 9-16 * * 1-5', async() => {
    cronService.updateStocks();
}, {
    start: true,
    timeZone: 'US/Eastern'
});

//cron.schedule('*/5 * * * * *', async() => {

app.use(cors());
app.use('/stocks', stocksRoutes);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
