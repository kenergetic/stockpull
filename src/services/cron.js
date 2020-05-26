const moment = require('moment');
const fetch = require('node-fetch');
const stockController = require('../controllers/stock');


const STOCK_SYMBOL = 'SPY';

const dotenv = require('dotenv');
dotenv.config();

// AlphaVantage API
const AV_API_KEY = process.env.AV_API_KEY;
const AV_OUTPUT_SIZE = process.env.AV_OUTPUT_SIZE || 'full';
const AV_BASE_URL = process.env.AV_BASE_URL;
const AV_API_CALL = `${AV_BASE_URL}/query?function=TIME_SERIES_INTRADAY&symbol=${STOCK_SYMBOL}&interval=5min&outputsize=${AV_OUTPUT_SIZE}&apikey=${AV_API_KEY}`;

// console.log(`Your key is ${AV_API_KEY}`);

const getApiData = async(apiRows, stockSymbol) => {

    const results = 'Time Series (5min)';

    // Call AlphaVantage and get Intraday data
    //
    // Meta Data: {1. Information: 'Intraday (5min) open, high, low, close prices and volume', 2. Symbol: 'SPY', 
    //             3. Last Refreshed: '2020-05-01 16:00:00', 4. Interval: '5min', 5. Output Size: 'Compact', …}
    //
    // Time Series (5min):
    // 2020-04-30 14:15:00: {1. open: '289.5600', 2. high: '289.9500', 3. low: '289.4700', 4. close: '289.9200', 5. volume: '464059'}
    // 2020-04-30 14:20:00: {1. open: '289.9100', 2. high: '289.9100', 3. low: '289.4800', 4. close: '289.4900', 5. volume: '664424'}
    await fetch(AV_API_CALL)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            for (var key in data[results]) {
                let tick = {
                    name: stockSymbol,
                    date: key,
                    open: data[results][key]['1. open'],
                    high: data[results][key]['2. high'],
                    low: data[results][key]['3. low'],
                    close: data[results][key]['4. close'],
                    volume: data[results][key]['5. volume'],
                }
                apiRows.push(tick);
            }
        }
    );
}

module.exports = {
    updateStocks: async() => {
        // Wait a few seconds after the 5 minute mark
        //await new Promise(resolve => setTimeout(resolve, 5000));
    
        // Ticker data returned from the API
        let apiRows = [];
    
        // -- Grab api data
        await getApiData(apiRows, 'SPY');
        
        // // -- Insert new ticks into the database
        await stockController.update(apiRows);
    
        console.log(moment().format("MM/DD H:mm:ss"));
    }
}