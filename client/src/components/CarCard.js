import { useEffect, useState } from 'react';
import { Box, Button, Modal } from '@mui/material';
import { Line } from 'react-chartjs-2';

const config = require('../config.json');

export default function CarCard({ Car_Id, handleClose }) {
  const [carData, setCarData] = useState({});

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/car/${Car_Id}`)
      .then(res => res.json())
      .then(carData => {
        setCarData(carData);
      });
  }, [Car_Id]);


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
        radius: 0 // this will hide points
      }
    }
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ background: 'white', borderRadius: '16px', border: '2px solid #000', width: 'auto' }}
      >
        <h1>{carData.Make} {carData.Model}</h1>
        <h2>Year: {carData.Year}</h2>
        <p>Price: ${carData.Price?.toFixed(2)}</p>
        <p>Mileage: {carData.Mileage?.toLocaleString()} miles</p>
        <p>MPG: {carData.MPG}</p>
        <p>Drivetrain: {carData.Drivetrain}</p>
        <p>Fuel Type: {carData.Fuel_type}</p>
        <p>Accident History: {carData.Accident ? 'Yes' : 'No'}</p>
        <p>One Owner: {carData.One_owner ? 'Yes' : 'No'}</p>
        <Line data={bellCurveData} options={bellCurveOptions} />
        <Button onClick={handleClose} style={{ marginTop: 20 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
