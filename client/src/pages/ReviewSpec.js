import { useEffect, useState } from 'react';
import LazyTable from '../components/LazyTable';
import { DataGrid } from '@mui/x-data-grid';
import { useParams } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, Typography, DialogActions, Button, Container } from '@mui/material';


const config = require('../config.json');

export default function HomePage() {
    const { make, model } = useParams();

  const [reviewData, setReviewData] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [selectedReview, setSelectedReview] = useState(null);


  useEffect(() => {
    // Fetch the car of the day, which is actually a review that includes car details
    fetch(`http://${config.server_host}:${config.server_port}/car_reviews/${make}/${model}`)
      .then(res => res.json())
      .then(resJson => {
        const reviews = resJson.map((reviews) => ({ id: reviews.Review_Id, ...reviews }));
        setReviewData(reviews);
      });
  }, []);

  const handleRowClick = (params) => {
    setSelectedReview(params.row);
  };

  const carReviews = [
    { field: 'Title', headerName: 'Review Title', width: 250 },
    { field: 'Rating', headerName: 'Rating', width: 100 },
    { field: 'Review', headerName: 'Review', width: 1000 }
  ]

  function ReviewDetailsModal({ review, open, handleClose }) {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Review Details</DialogTitle>
            <DialogContent>
                <Typography variant="h6">Title: {review.Title}</Typography>
                <Typography variant="body1">Rating: {review.Rating}</Typography>
                <Typography variant="body2" style={{ whiteSpace: 'pre-wrap' }}>{review.Review}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

return (
  <Container>
      <h2>Here's reviews for {make.toUpperCase()} {model.toUpperCase()}</h2>
      <DataGrid
          rows={reviewData}
          columns={carReviews}
          pageSize={pageSize}
          rowsPerPageOptions={[5, 10, 25]}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onRowClick={handleRowClick}
          autoHeight
      />
      {selectedReview && (
          <ReviewDetailsModal
              review={selectedReview}
              open={!!selectedReview}
              handleClose={() => setSelectedReview(null)}
          />
      )}
  </Container>
);
};
