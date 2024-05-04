import { useEffect, useState } from 'react';
import { Container, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const config = require('../config.json');

export default function HomePage() {
  const [reviewData, setReviewData] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState('');
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/car_fueltypes/${selectedFuelType}`)
      .then(res => res.json())
      .then(data => {
        // const reviews = resJson.map((review, index) => ({ id: index, ...review }));
        // setReviewData(reviews);
        const enrichedData = data.map((review, index) => ({
          ...review,
          id: index,
          Make: review.Make.toUpperCase(),
          Model: review.Model.toUpperCase(),
          AverageRating: review.AverageRating,
          Price: review.Price,
          AverageDepreciation: review.AverageDepreciation,
          MPG: review.MPG,
          Fuel_Type: review.Fuel_Type
        }));
        setReviewData(enrichedData);
      })
      .catch(err => console.error('Error fetching data:', err));
  }, [selectedFuelType]);

  const carReviews = [
    { field: 'Make', headerName: 'Make', width: 150 },
    { field: 'Model', headerName: 'Model', width: 150 },
    { field: 'Fuel_Type', headerName: 'Fuel', width: 150 },
    { field: 'AverageRating', headerName: 'Average Rating', width: 150 },
    { field: 'Price', headerName: 'Average Price', width: 150 },
    { field: 'AverageDepreciation', headerName: 'Average Depreciation', width: 160 },
    { field: 'MPG', headerName: 'MPG', width: 100 },
    
  ];

  const handleFuelTypeChange = (event) => {
    setSelectedFuelType(event.target.value);
  };

  return (
    <Container>
      <h2>Fuel Type: {selectedFuelType}</h2>
      <FormControl fullWidth>
        <InputLabel id="fuel-type-label">Fuel Type</InputLabel>
        <Select
          labelId="fuel-type-label"
          id="fuel-type-select"
          value={selectedFuelType}
          label="Fuel Type"
          onChange={handleFuelTypeChange}
        >
          <MenuItem value="Gasoline">Gasoline</MenuItem>
          <MenuItem value="Ethanol">Ethanol</MenuItem>
          <MenuItem value="Hybrid">Hybrid</MenuItem>
          <MenuItem value="Diesel">Diesel</MenuItem>
          <MenuItem value="Natural Gas">Natural Gas</MenuItem>
          <MenuItem value="Hydrogen">Hydrogen</MenuItem>
          <MenuItem value="Biodiesel">Biodiesel</MenuItem>
        </Select>
      </FormControl>
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
