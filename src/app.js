export const loadTickers = (tickers) =>
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers}&tsyms=USD`
  )
    .then((res) => res.json())
    .then((res) =>
      Object.fromEntries(
        Object.entries(res).map(([key, value]) => [key, value.USD])
      )
    );
