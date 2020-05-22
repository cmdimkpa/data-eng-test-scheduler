// fire relay-in endpoint every burst interval

/*
    at up to 90 requests per day preferred limit and 4 API calls per burst,
    we can only do 23 bursts per 24 hours or 1 burst every hour approximately
*/

let burstInterval = 3600000; // 1 hour, in milliseconds
let axios = require('axios');
const relay_in_url = require('./settings.json').relay_api.relay_in_url; // fetch relay_in URL
// fetch app security key for relay_in
const security_key_relay_in = require('./settings.json').relay_api.security_key_relay_in;

function fire_relay_in() {
    // Make 4 parallel requests to relay_in API for the 4 Crypto Symbols
    // app security key must match for successful relay_in
    let relay_in_requests = [
        // Bitcoin
        axios.get(`${relay_in_url}?Symbol=BTC`, { headers : { Authorization : security_key_relay_in } }),
        // Ethereum
        axios.get(`${relay_in_url}?Symbol=ETH`, { headers : { Authorization : security_key_relay_in } }),
        // Ripple
        axios.get(`${relay_in_url}?Symbol=XRP`, { headers : { Authorization : security_key_relay_in } }),
        // Litecoin
        axios.get(`${relay_in_url}?Symbol=LTC`, { headers : { Authorization : security_key_relay_in } })
    ];
    axios.all(relay_in_requests).then(axios.spread((...responses) => {
      // success logging
      console.log(responses) // visible in Heroku logs
    })).catch(errors => {
      // error logging
      console.log(errors) // visible in Heroku logs
    });
}

let burst = setInterval(fire_relay_in, burstInterval); // burst controller
