import { useEffect, useState } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Bar } from 'react-chartjs-2';


// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const config = require('../config.json');

export default function CarCard({ Car_Id, handleClose }) {
  const [carData, setCarData] = useState({});
  const [carImage, setCarImage] = useState('');
  const [carZscore, setCarZscore] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/car/${Car_Id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(carData => {
        setCarData(carData);
        return fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(carData.Make + ' ' + carData.Model)}&client_id=mdrWUkxYZXgG38Fo5TcaHZP98l1Guqs0Q3qejCL5nX8`)
      })
      .then(res => res.json())
      .then(imgData => {
        setCarImage(imgData.results[0]?.urls?.regular);
        return fetch(`http://${config.server_host}:${config.server_port}/car_zscore/${Car_Id}`)
      })
      .then(res => res.json())
      .then(zscoreData => {
        setCarZscore(zscoreData.Z_Score);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setError(true);
      });
  }, [Car_Id]);

  // Create histogram data
  const numBars = 100;
  const range = 10; // Typically, Z-Scores range from -5 to 5 for visualization
  const binWidth = range * 2 / numBars;
  const histogramData = Array(numBars).fill(0);
  const barLabels = Array.from({ length: numBars }, (_, i) => (-range + i * binWidth).toFixed(2));

  // Assuming Z-Score falls into this histogram
  if (carZscore !== null) {
    const index = Math.floor((carZscore + range) / binWidth);
    if (index >= 0 && index < numBars) {
      histogramData[index] = 1; // Set the frequency of the bin where the Z-Score falls
    }
  }

  const chartData = {
    labels: barLabels,
    datasets: [{
      label: 'Frequency',
      data: histogramData,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  if (error) {
    return <p>Failed to load data, please try again later.</p>;
  }

  return (
    <Modal open={true} onClose={handleClose} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box p={3} style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 'auto', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1>{carData.Make} {carData.Model}</h1>
          <h2>Year: {carData.Year}</h2>
          {carImage && <img src={carImage} alt={`${carData.Make} ${carData.Model}`} style={{ maxWidth: '100%', maxHeight: '200px' }} />}
          <p>Price: ${carData.Price?.toFixed(2)}</p>
          <p>Mileage: {carData.Mileage?.toLocaleString()} miles</p>
          <p>MPG: {carData.MPG}</p>
          <p>Drivetrain: {carData.Drivetrain}</p>
          <p>Fuel Type: {carData.Fuel_type}</p>
          <p>Accident History: {carData.Accident ? 'Yes' : 'No'}</p>
          <p>One Owner: {carData.One_owner ? 'Yes' : 'No'}</p>
          <Bar data={chartData} options={chartOptions} />
          <Button onClick={handleClose} style={{ marginTop: 20 }}>Close</Button>
        </div>
      </Box>
    </Modal>
  );
}