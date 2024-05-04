import { useEffect, useState } from 'react';
import { Button, Checkbox, Container, FormControlLabel, Grid, Link, Slider, TextField } from '@mui/material';
import CarCard from '../components/CarCard';
import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');

export default function HiddenGemsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [minReviews, setMinReviews] = useState(0);
  const [minRating, setMinRating] = useState(4);
  const [percBelow, setPercBelow] = useState(0.1);

  const [selectedCarId, setSelectedCarId] = useState(null);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/hidden_gems`)
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
    .catch(err => console.error('Error fetching hidden gems:', err));
  }, []);

  const fetchData = () => {
    fetch(`http://${config.server_host}:${config.server_port}/hidden_gems?min_reviews=${minReviews}&min_rating=${minRating}&perc_below=${percBelow}`)
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
      .catch(err => console.error('Error fetching hidden gems:', err));
  };

  const columns = [
    // { field: 'Car_Id', headerName: 'Car ID', width: 120 },
    // { field: 'Make', headerName: 'Make', width: 150 },
    { field: 'Make', headerName: 'Make', width: 150, renderCell: (params) => (
      <Link onClick={() => setSelectedCarId(params.row.Car_Id)}>{params.value}</Link>
  ) },
    { field: 'Model', headerName: 'Model', width: 150 },
    { field: 'Year', headerName: 'Year', width: 100 },
    { field: 'Rating', headerName: 'Rating', width: 100 },
    { field: 'ModelAvgRating', headerName: 'Model Avg Rating', width: 150 },
    { field: 'Price', headerName: 'Price', width: 100 },
    { field: 'MarketAvgPrice', headerName: 'Market Average Price', width: 180 },
    { field: 'PriceBelowMarket', headerName: 'Price Below Market', width: 180 }
  ];

  return (
    <Container>
      {selectedCarId && <CarCard Car_Id={selectedCarId} handleClose={() => setSelectedCarId(null)} />}
      <h2>Search Hidden Gems</h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Minimum Reviews"
            type="number"
            value={minReviews}
            onChange={e => setMinReviews(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Minimum Rating"
            type="number"
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <p>Percentage Below Market Price</p>
          <Slider
            label="Percentage Below Market Price"
            value={percBelow}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, newValue) => setPercBelow(newValue)}
            valueLabelDisplay="auto"
            valueLabelFormat={value => `${(value * 100).toFixed(2)}%`}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={() => fetchData()} variant="contained" style={{ marginTop: 20 }}>
            Search
          </Button>
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
