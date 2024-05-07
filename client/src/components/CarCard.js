import { useEffect, useState } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { NavLink } from 'react-router-dom';

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
  const [error, setError] = useState(false);

  useEffect(() => {
    // Initial fetch to get car data
    fetch(`http://${config.server_host}:${config.server_port}/car/${Car_Id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(carData => {
        setCarData(carData); // Update car data
  
        // Fetch image from Unsplash
        fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(carData.Make + ' ' + carData.Model)}&client_id=mdrWUkxYZXgG38Fo5TcaHZP98l1Guqs0Q3qejCL5nX8`)
          .then(imgRes => {
            if (!imgRes.ok) {
              throw new Error('Image fetch failed');
            }
            return imgRes.json();
          })
          .then(imgJson => {
            if (imgJson.results && imgJson.results.length > 0) {
              setCarImage(imgJson.results[0].urls.regular); // Update car image if available
            } else {
              throw new Error('No images found');
            }
          })
          .catch(err => {
            console.error("Error fetching image:", err);
            setError(true);
          });
  
        // Fetch average price, ensure this is nested or chained properly
        return fetch(`http://${config.server_host}:${config.server_port}/price_estimates/${carData.Make}/${carData.Model}/${carData.Year}`)
          .then(priceRes => {
            if (!priceRes.ok) {
              throw new Error('Failed to fetch average price');
            }
            return priceRes.json();
          })
          .then(priceData => {
            setCarData(prev => ({ ...prev, AvgPrice: priceData[0].AveragePrice })); // Update car data with average price
          })
          .catch(err => {
            console.error("Error fetching average price:", err);
            setError(true);
          });
      })
      .catch(error => {
        console.error("Failed to fetch car data:", error);
        setError(true);
      });
  }, [Car_Id]); // Dependency array
  

  const bellCurveData = {
    labels: Array.from({ length: 400 }, (_, i) => (i - 200) / 100),
    datasets: [{
      label: 'Bell Curve',
      data: Array.from({ length: 400 }, (_, i) => {
        let x = (i - 200) / 100;
        return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
      }),
      borderColor: 'black',
      borderWidth: 2,
    }]
  };

  const bellCurveOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        min: -4,
        max: 4,
        title: {
          display: true,
          text: 'Z-Score'
        }
      },
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      legend: {display: false},
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.parsed.y.toFixed(2);
          }
        }
      }
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  if (error) {
    return <p>Failed to load data, please try again later.</p>;
  }

return (
  <Modal
    open={true}
    onClose={handleClose}
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <Box
      p={3}
      style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 'auto', maxHeight: '90vh', overflowY: 'auto' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1>{carData.Make} {carData.Model}</h1>
        <h2>Year: {carData.Year}</h2>
        {carImage && <img src={carImage} alt={`${carData.Make} ${carData.Model}`} style={{ maxWidth: '100%', maxHeight: '200px' }} />}
        <p>Price: ${carData.Price?.toFixed(2)}</p>
        <p>Market Average: ${carData.AvgPrice?.toFixed(2)}</p>
        <p>Mileage: {carData.Mileage?.toLocaleString()} miles</p>
        <p>MPG: {carData.MPG}</p>
        <p>Drivetrain: {carData.Drivetrain}</p>
        <p>Fuel Type: {carData.Fuel_Type}</p>
        <p>Accident History: {carData.Accident ? 'Yes' : 'No'}</p>
        <p>One Owner: {carData.One_owner ? 'Yes' : 'No'}</p>
        {/* <Line data={bellCurveData} options={bellCurveOptions} /> */}
        <p>&nbsp;
          <NavLink to={`/reviews/${carData.Make}/${carData.Model}`}>See Reviews!</NavLink>
        </p>
        <Button onClick={handleClose} style={{ marginTop: 20 }}>
          Close
        </Button>
      </div>
    </Box>
  </Modal>
);
}