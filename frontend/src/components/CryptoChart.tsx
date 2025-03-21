import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

interface ChartProps {
  data: number[];
}

const CryptoChart: React.FC<ChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((_, index) => index.toString()),
    datasets: [
      {
        label: '7d Price',
        data: data,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return <Line data={chartData} />;
};

export default CryptoChart;
