export const loadTickers = (tickers) =>
  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers}`
  )
    .then((res) => res.json())
    .then((res) =>
      Object.fromEntries(
        Object.entries(res).map(([key, value]) => [key, 1 / value])
      )
    );
