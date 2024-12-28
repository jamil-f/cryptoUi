import { useState, useEffect } from 'react'


function App() {
  const [btcData, setBtcData] = useState(null);
  const [jasmyData, setJasmyData] = useState(null);
  const [solData, setSolData] = useState(null);

  useEffect(() => {
    // Define a function that fetches BTC and JASMY
    const fetchData = () => {
      fetch('http://localhost:3001/api/market-price?product_id=BTC-USD')
        .then((response) => response.json())
        .then((data) => setBtcData(data))
        .catch((err) => console.error(err));

      fetch('http://localhost:3001/api/market-price?product_id=JASMY-USD')
        .then((res) => res.json())
        .then((data) => setJasmyData(data))
        .catch((err) => console.error(err));

      fetch('http://localhost:3001/api/market-price?product_id=SOL-USD')
        .then((res) => res.json())
        .then((data) => setSolData(data))
        .catch((err) => console.error(err));
    };

    // Initial fetch as soon as the component mounts
    fetchData();

    // Now set an interval to fetch every 5 seconds (5000 ms)
    const intervalId = setInterval(() => {
      fetchData();
    }, 3000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (!btcData || !jasmyData) return <div>Loading...</div>;

  return (
    <div>
      <h2>BTC-USD Market Price</h2>
      <p>Price: {btcData.price}</p>
      <p>Bid: {btcData.bid}</p>
      <p>Ask: {btcData.ask}</p>

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
    </div>
  );
}

export default App;