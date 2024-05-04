import { useEffect, useState } from 'react';
import LazyTable from '../components/LazyTable';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, Slider } from '@mui/material';


const config = require('../config.json');

export default function HomePage() {
  const [reviewData, setReviewData] = useState({});
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Fetch the car of the day, which is actually a review that includes car details
    fetch(`http://${config.server_host}:${config.server_port}/car_fueltypes`)
      .then(res => res.json())
      .then(resJson => {
        const reviews = resJson.map((reviews) => ({ id: reviews.Model, ...reviews }));
        setReviewData(reviews);
      });
  }, []);

  const carReviews = [
    { field: 'Make', headerName: 'Make', width: 100 },
    { field: 'Model', headerName: 'Model', width: 100 },
    { field: 'AverageRating', headerName: 'Average Rating', width: 150 },
    { field: 'Price', headerName: 'Average Price', width: 200 },
    { field: 'AverageDepreciation', headerName: 'Average Depreciation', width: 200 },
    { field: 'MPG', headerName: 'MPG', width: 150 }
  ]
//   const filteredDiesel = reviewData.filter(item => item.Fuel_Type.includes("Diesel"));


  return (
    <Container>
      <h2> Diesel Fuel Type</h2>
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
