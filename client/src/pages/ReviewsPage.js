import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import LazyTable from '../components/LazyTable';

const config = require('../config.json');

export default function HomePage() {
  const [reviewData, setReviewData] = useState({});

  useEffect(() => {
    // Fetch the car of the day, which is actually a review that includes car details
    fetch(`http://${config.server_host}:${config.server_port}/car_safety_and_rankings`)
      .then(res => res.json())
      .then(resJson => {
        // Capitalize the car details before setting the state
        setReviewData(resJson);
      })
      .catch(error => console.error("Failed to fetch car of the day:", error));
  }, []);

  // Define the columns for the car table
  const toUpperCase = (text) => text ? text.toUpperCase() : 'N/A';  // Default to 'N/A' if no text

  const carReviews = [
    {
      field: 'Make',
      headerName: 'Make',
    },
    {
      field: 'Model',
      headerName: 'Model',
    },
    {
      field: 'AvgMileage',
      headerName: 'Average Miles',
    }
  ];
  

  return (
    <Container>
      <h2>All Cars And Their Average Reviews:</h2>
      {/* Display car of the day details, assuming the API returns a review that includes car details */}
      <LazyTable route={`http://${config.server_host}:${config.server_port}/car_ratings`} columns={carReviews} defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
      <Divider />
    </Container>
  );
};
