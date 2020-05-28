# stockpull
Simple node cron/API project that periodically grabs 5-minute stock data from the AlphaVantage API and stores it in a Sqlite db. Provides  an endpoint to access that data. 

To use this
* Get a free API key from AlphaVantage (https://www.alphavantage.co/support/#api-key)
* Create an .env file with the following 

PORT=3128

AV_BASE_URL=https://www.alphavantage.co

AV_API_KEY=<YOUR_API_KEY>

AV_OUTPUT_SIZE=full
