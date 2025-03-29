import { useState, useEffect } from 'react';


function App() {
  const [btcData, setBtcData] = useState(null);
  const [jasmyData, setJasmyData] = useState(null);
  const [solData, setSolData] = useState(null);
  const [solBalance, setSolBalance] = useState(null);
  const [cryptoAccounts, setCryptoAccounts] = useState([]);

  useEffect(() => {
    const fetchMarketData = () => {
      fetch('http://localhost:3001/api/market-price?product_id=BTC-USD')
        .then((response) => response.json())
        .then((data) => setBtcData((prev) => ({ ...prev, ...data })))
        .catch((err) => console.error(err));

      fetch('http://localhost:3001/api/market-price?product_id=JASMY-USD')
        .then((res) => res.json())
        .then((data) => setJasmyData(data))
        .catch((err) => console.error(err));

      fetch('http://localhost:3001/api/market-price?product_id=SOL-USD')
        .then((res) => res.json())
        .then((data) => setSolData(data))
        .catch((err) => console.error(err));
      
        fetch('http://localhost:3001/api/rsi-trade?product_id=BTC-USD')
        .then((response) => response.json())
        .then((data) => setBtcData((prev) => ({ ...prev, rsi: data.rsi })))
        .catch((err) => console.error(err));
    };


    const fetchAccountData = () => {
      fetch('http://localhost:3001/api/accounts')
        .then((response) => response.json())
        .then((data) => {
          // console.log("Fetched account data:", data);
          let accountsArray = [];
          if (data && Array.isArray(data.accounts)) {
            accountsArray = data.accounts;
          } else if (Array.isArray(data)) {
            accountsArray = data;
          } else if (data && Array.isArray(data.data)) {
            accountsArray = data.data;
          } else {
            console.error("Unexpected account data structure:", data);
          }
          const nonZeroAccounts = accountsArray.filter(acc => {
            return acc.available_balance && Number(acc.available_balance.value) > 0;
          });
          setCryptoAccounts(nonZeroAccounts);
          
          // Find the SOL account (making sure to handle case sensitivity)
          const solAcc = accountsArray.find(
            (acc) => acc.currency && acc.currency.toUpperCase() === 'SOL'
          );
          if (solAcc) {
            // Use available_balance.value if available, or fallback to solAcc.balance
            const balance = solAcc.available_balance?.value || solAcc.balance;
            setSolBalance(balance);
          } else {
            console.error('SOL account not found in account data:', data);
          }
        })
        .catch((err) => console.error(err));
    };

    // Initial fetch as soon as the component mounts
    fetchMarketData();
    fetchAccountData();

    // Now set an interval to fetch every 5 seconds (5000 ms)
    const marketInterval = setInterval(() => {
      fetchMarketData();
    }, 9000);

    const accountInterval = setInterval(() => {
      fetchAccountData();
    },  30000);

   // Cleanup intervals on component unmount
   return () => {
    clearInterval(marketInterval);
    clearInterval(accountInterval);
  };
}, []);

  if (!btcData || !jasmyData || !solData) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome to Crypto Gunc</h1>
      <h2>BTC-USD Market Price</h2>
      <p>Price: {btcData.price}</p>
      <p>Bid: {btcData.bid}</p>
      <p>Ask: {btcData.ask}</p>
      <p>RSI: {btcData.rsi ?? 'Calculating...'}</p>

      <hr />

      <h2>JASMY-USD Market Price</h2>
      <p>Price: {jasmyData.price}</p>
      <p>Bid: {jasmyData.bid}</p>
      <p>Ask: {jasmyData.ask}</p>

      <hr />

      <h2>SOL-USD Market Price</h2>
      <p>Price: {solData.price}</p>
      <p>Bid: {solData.bid}</p>
      <p>Ask: {solData.ask}</p>
      <p>SOL Balance: {solBalance ?? 'Loading...'}</p>

      <hr />

      <h2>Your Crypto Balances</h2>
      <ul>
        {cryptoAccounts.map((acc) => (
          <li key={acc.uuid}>
            {acc.name}: {acc.available_balance.value} {acc.currency}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;