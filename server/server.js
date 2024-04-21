const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/car/:car_id', routes.car);
app.get('/car_of_the_day', routes.car_of_the_day);
app.get('/car_reviews/:make/:model', routes.car_reviews);
app.get('/car_ratings', routes.car_ratings);
app.get('/car_efficiency/:make/:model', routes.car_efficiency);
app.get('/reviewer/:reviewer_name', routes.reviewer);
app.get('/reviewer_avg/:reviewer_name', routes.reviewer_avg);
app.get('/search_cars', routes.search_cars);
app.get('/price_estimates/:make/:model', routes.price_estimates);
app.get('/car_rankings', routes.car_rankings);
app.get('/car_safety_and_rankings', routes.car_safety_and_rankings);
app.get('/car_zscore/:car_id', routes.car_zscore);
app.get('/hidden_gems', routes.hidden_gems);
app.get('/car_reliability', routes.car_reliability);


app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
