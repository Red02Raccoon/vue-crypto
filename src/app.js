export const loadTickers = (tickers) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers}`
  ).then((res) => res.json());
