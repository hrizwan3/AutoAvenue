import { useEffect, useState } from 'react';
import { Container, Divider, Link } from '@mui/material';
import NavBar from '../components/NavBar'; // Ensure NavBar is properly imported
import LazyTable from '../components/LazyTable';

const config = require('../config.json');

export default function HomePage() {
  const [carOfTheDay, setCarOfTheDay] = useState({});

  useEffect(() => {
    // Fetch the car of the day, which is actually a review that includes car details
    fetch(`http://${config.server_host}:${config.server_port}/car_of_the_day`)
      .then(res => res.json())
      .then(resJson => setCarOfTheDay(resJson))
      .catch(error => console.error("Failed to fetch car of the day:", error));
  }, []);

  // Define the columns for the car table
  const carColumns = [
    {
      field: 'make',
      headerName: 'Make'
    },
    {
      field: 'model',
      headerName: 'Model'
    },
    {
      field: 'year',
      headerName: 'Year'
    }
  ];

  return (
    <Container>
      <h2>Check out our featured car of the day:</h2>
      {/* Display car of the day details, assuming the API returns a review that includes car details */}
      <p>
        {carOfTheDay.make && carOfTheDay.model && carOfTheDay.year ?
          `${carOfTheDay.make} ${carOfTheDay.model}, ${carOfTheDay.year}` :
          "Loading or no car of the day available."
        }
      </p>
      <Divider />
      <h2>Top Cars</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_cars`} columns={carColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
    </Container>
  );
};