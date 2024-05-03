import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import LazyTable from '../components/LazyTable';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function HomePage() {
  const [reviewData, setReviewData] = useState({});
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Fetch the car of the day, which is actually a review that includes car details
    fetch(`http://${config.server_host}:${config.server_port}/car_safety_and_rankings`)
      .then(res => res.json())
      .then(resJson => {
        const reviews = resJson.map((reviews) => ({ id: reviews.Make, ...reviews }));
        setReviewData(reviews);
      });
  }, []);

  // Define the columns for the car table
  const toUpperCase = (text) => text ? text.toUpperCase() : 'N/A';  // Default to 'N/A' if no text

//   const carReviews = [
//     {
//       field: 'Make',
//       headerName: 'Make',
//     },
//     {
//       field: 'Model',
//       headerName: 'Model',
//     },
//     {
//       field: 'AverageRating',
//       headerName: 'Rating',
//     },
//     {
//      field: 'PercentAccidents',
//      headerName: 'Percent of Cars in Accidents',
//     }, 
//     {
//         field: 'AvgMileage',
//         headerName: 'Average Mileage',
//     }, 
//   ];
  

  const carReviews = [
    { field: 'Make', headerName: 'Make', width: 150 },
    { field: 'Model', headerName: 'Model', width: 150 },
    { field: 'AvgMileage', headerName: 'Average Mileage'},
    { field: 'PercentAccidents', headerName: 'Percent of Accidents'},
    { field: 'AverageRating', headerName: 'Average Rating'}
  ]

  return (
    <Container>
      <h2>All Cars And Their Average Reviews:</h2>
      {/* Display car of the day details, assuming the API returns a review that includes car details */}
      <DataGrid
        rows={reviewData}
        columns={carReviews}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 25]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        autoHeight
      />
          <Divider />
    </Container>
  );
};
