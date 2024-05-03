import { useEffect, useState } from 'react';
import { Button, Container, Grid, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
const config = require('../config.json');

export default function HiddenGemsPage() {
  const [data, setData] = useState([]);
  const [minReviews, setMinReviews] = useState(0);
  const [minRating, setMinRating] = useState(4);
  const [percBelow, setPercBelow] = useState(0.1);

  // Define fetchData function to fetch data based on filters
  const fetchData = () => {
    fetch(`http://${config.server_host}:${config.server_port}/hidden_gems?min_reviews=${minReviews}&min_rating=${minRating}&perc_below=${percBelow}`)
      .then(res => res.json())
      .then(data => {
        // Ensure each row has a unique 'id' for DataGrid to use
        const enrichedData = data.map((item, index) => ({ id: index, ...item }));
        setData(enrichedData);
      })
      .catch(err => console.error('Error fetching hidden gems:', err));
  };

  // Initial fetch and re-fetch on parameter change
  useEffect(() => {
    fetchData();
  }, [minReviews, minRating, percBelow]);

  const columns = [
    { field: 'Car_Id', headerName: 'Car ID', width: 120 },
    { field: 'Make', headerName: 'Make', width: 150 },
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
      <h2>Search Hidden Gems</h2>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="Minimum Reviews"
            type="number"
            value={minReviews}
            onChange={e => setMinReviews(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Minimum Rating"
            type="number"
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
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
          <Button onClick={fetchData} variant="contained" style={{ marginTop: 20 }}>
            Search
          </Button>
        </Grid>
      </Grid>
      <h2>Results</h2>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25]}
        autoHeight
      />
    </Container>
  );
}
