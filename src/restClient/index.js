const config = require('../config');

//get converting for selected currency
export async function convert(currency = config.defaultCurrency, set = config.defaultSet) {
    let response = await fetch(`${config.exchangeUrl}/indices/${set}/ticker/${currency}`);
    let data = await response.json();
    return data.last;
}

//download all available currencies
export async function getCurrencies() {
    let response = await fetch(`${config.exchangeUrl}/symbols/indices/ticker`);
    let data = await response.json();
    return data;
}
