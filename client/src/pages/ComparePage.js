import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';


import CarCard from '../components/CarCard';
const config = require('../config.json');

export default function SearchCarsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState(null);

  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [mileage, setMileage] = useState([0, 500000]);
  const [year, setYear] = useState([2000, 2020]);
  const [price, setPrice] = useState([5000, 75000]);
  const [mpg, setMpg] = useState([30, 50]);
  const [isOne, setIsOne] = useState(false);
  const [noAccident, setNoAccident] = useState(false);
  const { car_id1 } = useParams();

  const [carData, setCarData] = useState([]);


  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_cars`)
      .then(res => res.json())
      .then(resJson => setCarData(resJson));
  }, []);

  const search = () => {

    fetch(`http://${config.server_host}:${config.server_port}/car/${car_id1}`)
      .then(res => res.json())
      .then(resJson => setCarData(resJson));
  }

  const columns = [
    { field: 'make', headerName: 'Make', width: 150 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'year', headerName: 'Year'},
    { field: 'price', headerName: 'Price'},
    { field: 'mileage', headerName: 'Mileage'},
    { field: 'mpg', headerName: 'MPG'},
    { field: 'isAccident', headerName: 'Accident', renderCell: (params) => (
      params.value ? "Yes" : "No"
  ) },
    { field: 'isOne', headerName: 'One Owner', renderCell: (params) => (
        params.value ? "Yes" : "No"
    ) }
  ]

  return (
    <Container>
      {selectedCarId && <CarCard carId={selectedCarId} handleClose={() => setSelectedCarId(null)} />}
      <h2>Search Cars</h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField label='Car ID' value={car_id1} onChange={(e) => setMake(e.target.value)} fullWidth/>
        </Grid>
      </Grid>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
}
