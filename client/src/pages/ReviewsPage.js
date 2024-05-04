import { useEffect, useState } from 'react';
import LazyTable from '../components/LazyTable';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, Slider } from '@mui/material';


const config = require('../config.json');

export default function HomePage() {
  const [reviewData, setReviewData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');

  useEffect(() => {
    // Fetch the car of the day, which is actually a review that includes car details
    fetch(`http://${config.server_host}:${config.server_port}/car_reviews`)
      .then(res => res.json())
      .then(resJson => {
        const reviews = resJson.map((reviews) => ({ id: reviews.Review_Id, ...reviews }));
        setReviewData(reviews);
      });
  }, []);

  const carReviews = [
    { field: 'Title', headerName: 'Review Title', width: 150 },
    { field: 'Rating', headerName: 'Rating', width: 150 },
    { field: 'Review', headerName: 'Review', width: 10000 }
  ]

  const search = () => {
    // const queryParams = new URLSearchParams({
    //   make,
    //   model
    // }).toString();


    fetch(`http://${config.server_host}:${config.server_port}/car_reviews/${make}/${model}`)      
    .then(res => res.json())
      .then(resJson => {
        const reviews = resJson.map((reviews) => ({ id: reviews.Review_Id, ...reviews }));
        setReviewData(reviews);
      });
  }

  return (
    <Container>
      <h2> Search Reviews</h2>
      <Grid container spacing={2}>
      <Grid item xs={6}>
          <TextField label='Make' value={make} onChange={(e) => setMake(e.target.value)} fullWidth/>
        </Grid>
        <Grid item xs={6}>
          <TextField label='Model' value={model} onChange={(e) => setModel(e.target.value)} fullWidth/>
        </Grid>
        <Button onClick={() => search() } style={{ left: '50%', transform: 'translateX(-50%)' }}>
        Search
      </Button>
      </Grid>
      {/* Display car of the day details, assuming the API returns a review that includes car details */}
      <DataGrid
        rows={reviewData}
        columns={carReviews}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
    </Container>
  );
};
