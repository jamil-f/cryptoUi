import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function HistoricalChart() {
  const [priceHistory, setPriceHistory] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/price-history?product_id=BTC-USD&limit=50')
      .then((res) => res.json())
      .then((data) => {
        setPriceHistory(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Transform `priceHistory` into chart data
  // e.g., x-axis = created_at, y-axis = price
  const chartData = {
    labels: priceHistory.map(entry => new Date(entry.created_at).toLocaleTimeString()),
    datasets: [
      {
        label: 'BTC Price',
        data: priceHistory.map(entry => entry.price),
        borderColor: 'blue',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1>BTC Price History</h1>
      <Line data={chartData} />
    </div>
  );
}

export default HistoricalChart;