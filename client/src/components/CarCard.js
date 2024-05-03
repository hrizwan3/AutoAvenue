import { useEffect, useState } from 'react';
import { Box, Button, Modal } from '@mui/material';

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
        <Button onClick={handleClose} style={{ marginTop: 20 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}
