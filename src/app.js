const requestTime = 5000;
const tickersHandlers = new Map();

const loadTickers = () => {
  if (!tickersHandlers.size) {
    return;
  }

  const tickers = tickersHandlers.keys() || [];
  const formattedTickers = [...tickers].join(",");

  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${formattedTickers}&tsyms=USD`
  )
    .then((res) => res.json())
    .then((res) => {
      const data = Object.fromEntries(
        Object.entries(res).map(([key, value]) => [key, value.USD])
      );

      Object.entries(data).forEach(([ticker, price]) => {
        const handlers = tickersHandlers.get(ticker) || [];
        handlers.forEach((fn) => fn(price));
      });
    });
};

export const subscribeToTicker = (ticker, cb) => {
  const prevSubscribers = tickersHandlers.get(ticker) || [];

  tickersHandlers.set(ticker, [...prevSubscribers, cb]);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, requestTime);
