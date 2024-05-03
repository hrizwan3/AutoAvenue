import { useEffect, useState } from 'react';
import { Button, Container, Grid, Slider, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function SongsPage() {
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState([]);
  const [minReviews, setMinReviews] = useState(0);
  const [minRating, setMinRating] = useState(4);
  const [percBelow, setPercBelow] = useState(0.1);

  useEffect(() => {
    search();
  }, []);

  const search = () => {
    fetch(`http://${config.server_host}:${config.server_port}/hidden_gems?min_reviews=${minReviews}&min_rating=${minRating}&perc_below=${percBelow}`)
      .then(res => res.json())
      .then(resJson => {
        setData(resJson);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  const columns = [
    { field: 'Make', headerName: 'Make', width: 150 },
    { field: 'Model', headerName: 'Model', width: 150 },
    { field: 'Year', headerName: 'Year', width: 100 },
    { field: 'Rating', headerName: 'Rating', width: 100 },
    { field: 'ModelAvgRating', headerName: 'Model Avg Rating', width: 180 },
    { field: 'Price', headerName: 'Price', width: 120 },
    { field: 'MarketAvgPrice', headerName: 'Market Avg Price', width: 180 },
    { field: 'PriceBelowMarket', headerName: 'Price Below Market', width: 200 },
  ]

  return (
    <Container>
      <h2>Search Hidden Gems</h2>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <TextField label='Min Reviews' value={minReviews} onChange={(e) => setMinReviews(e.target.value)} type="number" />
        </Grid>
        <Grid item xs={4}>
          <TextField label='Min Rating' value={minRating} onChange={(e) => setMinRating(e.target.value)} type="number" />
        </Grid>
        <Grid item xs={4}>
          <TextField label='% Below Market' value={percBelow} onChange={(e) => setPercBelow(e.target.value)} type="number" />
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
