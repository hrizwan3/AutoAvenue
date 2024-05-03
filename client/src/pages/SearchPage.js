import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

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

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_cars`)
      .then(res => res.json())
      .then(resJson => {
        const carsWithId = resJson.map((car) => ({ id: car.car_id, ...car }));
        setData(carsWithId);
      });
  }, []);

  const search = () => {
    const queryParams = new URLSearchParams({
      make,
      model,
      year_low: year[0],
      year_high: year[1],
      price_low: price[0],
      price_high: price[1],
      mileage_low: mileage[0],
      mileage_high: mileage[1],
      mpg_low: mpg[0],
      mpg_high: mpg[1],
      one_owner: isOne,
      no_accident: noAccident
    }).toString();

    fetch(`http://${config.server_host}:${config.server_port}/search_cars?${queryParams}`)
      .then(res => res.json())
      .then(resJson => {
        const carsWithId = resJson.map((car) => ({ id: car.car_id, ...car }));
        setData(carsWithId);
      });
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
          <TextField label='Make' value={make} onChange={(e) => setMake(e.target.value)} fullWidth/>
        </Grid>
        <Grid item xs={6}>
          <TextField label='Model' value={model} onChange={(e) => setModel(e.target.value)} fullWidth/>
        </Grid>
        <Grid item xs={6}>
          <p>Year Range</p>
          <Slider
            value={year}
            min={1960}
            max={2024}
            onChange={(e, newValue) => setYear(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={6}>
          <p>Price Range ($)</p>
          <Slider
            value={price}
            min={0}
            max={500000}
            step={100}
            onChange={(e, newValue) => setPrice(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={6}>
          <p>Mileage Range</p>
          <Slider
            value={mileage}
            min={0}
            max={500000}
            step={1000}
            onChange={(e, newValue) => setMileage(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={6}>
          <p>MPG Range</p>
          <Slider
            value={mpg}
            min={0}
            max={128}
            onChange={(e, newValue) => setMpg(newValue)}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            label='No Accidents'
            control={<Checkbox checked={noAccident} onChange={(e) => setNoAccident(e.target.checked)} />}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControlLabel
            label='One Owner Only'
            control={<Checkbox checked={isOne} onChange={(e) => setIsOne(e.target.checked)} />}
          />
        </Grid>
      </Grid>
      <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
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
