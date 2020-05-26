# stockpull
Simple node cron/API project that pulls data from AlphaVantage API and has an endpoint to access that data

To use this
* Get a free API key from AlphaVantage (https://www.alphavantage.co/support/#api-key)
* Create an .env file with the following information

PORT=3128
AV_BASE_URL=https://www.alphavantage.co
AV_API_KEY=<YOUR_API_KEY>
AV_OUTPUT_SIZE=full
