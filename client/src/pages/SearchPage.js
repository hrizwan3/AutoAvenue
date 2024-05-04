import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
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

  const handleRowClick = (params) => {
    setSelectedCarId(params.row.id);
  };

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/search_cars`)
      .then(res => res.json())
      .then(data => {
        const enrichedData = data.map((car) => ({
          ...car,
          id: car.Car_Id,
          Make: car.Make.toUpperCase(),
          Model: car.Model.toUpperCase()
        }));
        setData(enrichedData);
      })
      .catch(err => console.error('Error fetching cars:', err));
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/search_cars?make=${make}` +
    `&model=${model}&year_low=${year[0]}&year_high=${year[1]}&price_low=${price[0]}` +
    `&price_high=${price[1]}&mileage_low=${mileage[0]}&mileage_high=${mileage[1]}` +
    `&mpg_low=${mpg[0]}&mpg_high=${mpg[1]}&one_owner=${isOne}&no_accident=${noAccident}`)
      .then(res => res.json())
      .then(data => {
        const enrichedData = data.map((car) => ({
          ...car,
          id: car.Car_Id,
          Make: car.Make.toUpperCase(),
          Model: car.Model.toUpperCase()
        }));
        
        setData(enrichedData);
      })
      .catch(err => console.error('Error fetching cars:', err));
  }

  const columns = [
    { field: 'Make', headerName: 'Make', width: 150, renderCell: (params) => (
      <Link onClick={() => setSelectedCarId(params.row.Car_Id)}>{params.value}</Link>
  ) },
    // { field: 'Make', headerName: 'Make', width: 200 },
    { field: 'Model', headerName: 'Model', width: 200 },
    { field: 'Year', headerName: 'Year'},
    { field: 'Price', headerName: 'Price'},
    { field: 'Mileage', headerName: 'Mileage'},
    { field: 'MPG', headerName: 'MPG'},
    { field: 'Accident', headerName: 'Accident', renderCell: (params) => (
      params.value ? "Yes" : "No"
  ) },
    { field: 'One_owner', headerName: 'One Owner', renderCell: (params) => (
        params.value ? "Yes" : "No"
    ) }
  ]

  return (
    <Container>
      {selectedCarId && <CarCard Car_Id={selectedCarId} handleClose={() => setSelectedCarId(null)} />}
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
      <Button onClick={() => search()} style={{ left: '50%', transform: 'translateX(-50%)' }}>
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
