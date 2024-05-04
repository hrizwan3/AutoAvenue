import { useEffect, useState } from 'react';
import { Container, Divider, Link, Typography } from '@mui/material';
import LazyTable from '../components/LazyTable';

const config = require('../config.json');

export default function HomePage() {
  const [carOfTheDay, setCarOfTheDay] = useState({});
  const [carImage, setCarImage] = useState('');

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/car_of_the_day`)
      .then(res => res.json())
      .then(resJson => {
        setCarOfTheDay({
          make: resJson.make.toUpperCase(),
          model: resJson.model.toUpperCase(),
          year: resJson.year
        });
        // Fetch the image using another API (e.g., Unsplash)
        fetch(`https://api.unsplash.com/search/photos?query=${resJson.make} ${resJson.model}&client_id=mdrWUkxYZXgG38Fo5TcaHZP98l1Guqs0Q3qejCL5nX8`)
          .then(imgRes => imgRes.json())
          .then(imgJson => {
            setCarImage(imgJson.results[0]?.urls?.regular); // Change according to the API you are using
          })
          .catch(imgError => console.error("Failed to fetch image:", imgError));
      })
      .catch(error => console.error("Failed to fetch car of the day:", error));
  }, []);

  // Define the columns for the car table
  const toUpperCase = (text) => text ? text.toUpperCase() : 'N/A';  // Default to 'N/A' if no text

  const carColumns = [
    {
      field: 'Make',
      headerName: 'Make',
    },
    {
      field: 'Model',
      headerName: 'Model',
    },
    {
      field: 'avg_rating',
      headerName: 'Rating',
    }
  ];
   
return (
  <Container>
    <Typography variant="h5">Check out our featured car of the day:</Typography>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div>
        <p>
          {carOfTheDay.make && carOfTheDay.model && carOfTheDay.year ?
            `${carOfTheDay.make} ${carOfTheDay.model}, ${carOfTheDay.year}` :
            "Loading or no car of the day available."
          }
        </p>
      </div>
      <img src={carImage} alt="Car of the Day" style={{ width: '200px', height: 'auto', marginLeft: '20px' }} />
    </div>
    <Divider />
    <Typography variant="h6">Top Cars By Rating</Typography>
    <LazyTable route={`http://${config.server_host}:${config.server_port}/car_ratings`} columns={carColumns} defaultPageSize={5} rowsPerPageOptions={[5, 10, 25]} />
  </Container>
);
};