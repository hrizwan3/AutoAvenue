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
      .then(resJson => setSongOfTheDay(resJson));

    
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
      <h2>Check out your car of the day:</h2>
      {/* Display car of the day details, assuming the API returns a review that includes car details */}
      <p>
        {carOfTheDay.make && carOfTheDay.model && carOfTheDay.year ?
          `${carOfTheDay.make} ${carOfTheDay.model}, ${carOfTheDay.year}` :
          "Loading or no car of the day available."
        }
      </p>
      <Divider />
      <h2>Top Songs</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_songs`} columns={songColumns} />
      <Divider />
      {/* TODO (TASK 16): add a h2 heading, LazyTable, and divider for top albums. Set the LazyTable's props for defaultPageSize to 5 and rowsPerPageOptions to [5, 10] */}
      <h2>Top Albums</h2>
      <LazyTable route={`http://${config.server_host}:${config.server_port}/top_albums`} columns={albumColumns} defaultPageSize={5} rowsPerPageOptions={[5,10]}/>
      <Divider />
      {/* TODO (TASK 17): add a paragraph (<p></p>) that displays “Created by [name]” using the name state stored from TASK 13/TASK 14 */}
      
    </Container>
  );
};
