import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './PieCharts.css'; // CSS dosyasını içe aktar

ChartJS.register(ArcElement, Tooltip, Legend);

const RandomCategoryChart = () => {
  const categories = ['Kategori A', 'Kategori B', 'Kategori C', 'Kategori D', 'Kategori E'];

  const getRandomData = () => {
    const randomPercentages = categories.map(() => Math.floor(Math.random() * 100));
    const total = randomPercentages.reduce((acc, val) => acc + val, 0);
    return randomPercentages.map(value => ((value / total) * 100).toFixed(2));
  };

  const data = {
    labels: categories,
    datasets: [
      {
        data: getRandomData(),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
        ],
      },
    ],
  };


  const options = {
    plugins: {
      legend: {
        labels: {
          color: 'black', // Kategori yazıları siyah
        },
      },
      tooltip: {
        titleColor: 'black', // Tooltip başlığı siyah
        bodyColor: 'black', // Tooltip içeriği siyah
      },
    },
  };

  return (
    <div className="chart-card">
      <h3 className="chart-title">Rate Of Past Events</h3>
      <div className="chart-container">
        <Pie data={data} options={options} style={
          { width: '100%', height: '200px' ,}} />
      </div>
    </div>
  );
};

export default RandomCategoryChart;