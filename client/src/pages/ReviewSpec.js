import { useEffect, useState } from 'react';
import LazyTable from '../components/LazyTable';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Checkbox, Container, FormControlLabel, Grid, TextField, Slider } from '@mui/material';
import { useParams } from 'react-router-dom';


const config = require('../config.json');

export default function HomePage() {
    const { make, model } = useParams();

  const [reviewData, setReviewData] = useState({});
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Fetch the car of the day, which is actually a review that includes car details
    fetch(`http://${config.server_host}:${config.server_port}/car_reviews/${make}/${model}`)
      .then(res => res.json())
      .then(resJson => {
        const reviews = resJson.map((reviews) => ({ id: reviews.Review_Id, ...reviews }));
        setReviewData(reviews);
      });
  }, []);

  const carReviews = [
    { field: 'Review_Id', headerName: 'Reviewer ID', width: 150 },
    { field: 'Title', headerName: 'Review Title', width: 150 },
    { field: 'Rating', headerName: 'Rating', width: 150 },
    { field: 'Review', headerName: 'Review', width: 10000 }
  ]


  return (
    <Container>
    <h1>
        Here are the reviews about the {make.toUpperCase()} {model.toUpperCase()}
    </h1>
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
