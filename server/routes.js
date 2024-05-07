const mysql = require('mysql');
// const config = require('./config.json');

require('dotenv').config();

const config = {
  rds_host: process.env.RDS_HOST,
  rds_port: process.env.RDS_PORT,
  rds_user: process.env.RDS_USER,
  rds_password: process.env.RDS_PASSWORD,
  rds_db: process.env.RDS_DB,
  server_host: process.env.SERVER_HOST,
  server_port: process.env.SERVER_PORT
};

const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

// Route 1: GET /car/:car_id
const car = async function(req, res) {
  const car_id = req.params.car_id;
  connection.query(`
  SELECT *
  FROM UsedCars
  WHERE Car_Id = "${car_id}"
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 2: GET /car_of_the_day
const car_of_the_day = async function(req, res) {
  connection.query(`
  SELECT *
  FROM Reviews
  WHERE Rating > 3
      AND Year > 2015
  ORDER BY RAND()
  LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json({
        make: data[0].Make,
        model: data[0].Model,
        year: data[0].Year
      });
    }
  });
}

// Route 3: GET /car_reviews/:make/:model
const car_reviews = async function(req, res) {
  const make = req.params.make;
  const model = req.params.model;
  const year = req.query.year ?? 0;
  qry = `
  SELECT *
  FROM Reviews
  WHERE Make LIKE "${make}%" AND Model LIKE "${model}%"
  `;
  if (year) {
    qry += ` AND Year = ${year}`
  }
  connection.query(
    qry, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


// Route 4: GET /car_ratings
const car_ratings = async function(req, res) {

  const year = req.query.year ?? 0;
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const disp = (page - 1) * pageSize;

  qry = `
  SELECT UPPER(Make) AS Make, UPPER(Model) AS Model, avg_rating
  FROM CarRatings
  `
  if (year) {
    qry += `WHERE Year = ${year}`
  }
  if (page) {
    qry += `LIMIT ${pageSize} OFFSET ${disp}`
  }
  connection.query(
    qry, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 5: GET /car_efficiency/:make/:model
const car_efficiency = async function(req, res) {
  const make = req.params.make;
  const model = req.params.model;
  const year = req.query.year ?? 0;
  qry = `
  SELECT AVG(MPG)
  FROM UsedCars
  WHERE Make = "${make}" AND Model = "${model}"
  `;
  if (year) {
    qry += ` AND Year = ${year}`
  }
  connection.query(qry, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}


// Route 6: GET /reviewer/:reviewer
// fetches all reviews by a given reviewer
const reviewer = async function(req, res) {
  const reviewer = req.params.reviewer_name;
  connection.query(`
  SELECT *
  FROM Reviews
  WHERE Reviewer = "${reviewer}"
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 7: GET /reviewer_avg/:reviewer_name
// fetches the average rating of a given reviewer
const reviewer_avg = async function(req, res) {
  const reviewer = req.params.reviewer_name;
  connection.query(`
  SELECT AVG(Rating)
  FROM Reviews
  WHERE Reviewer = "${reviewer}"
  GROUP BY Reviewer
  `, (err, data) => {
    if (err) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 8: GET /search_cars
const search_cars = async function(req, res) {
  console.log(req.query);

  const make = req.query.make ?? '';
  const model = req.query.model ?? '';
  const priceLow = req.query.price_low ?? 15000;
  const priceHigh = req.query.price_high ?? 50000;
  const mileageLow = req.query.mileage_low ?? 10000;
  const mileageHigh = req.query.mileage_high ?? 100000;
  const mpgLow = req.query.mpg_low ?? 30;
  const mpgHigh = req.query.mpg_high ?? 50;
  const yearLow = req.query.year_low ?? 2010;
  const yearHigh = req.query.year_high ?? 2020;

  const noAccident = req.query.no_accident === 'true' ? 1 : 0;
  const oneOwner = req.query.one_owner === 'true' ? 1 : 0;

  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const disp = (page - 1) * pageSize;

  qry = `
  SELECT *
  FROM UsedCars
  WHERE Price BETWEEN ${priceLow} AND ${priceHigh}
    AND Mileage BETWEEN ${mileageLow} AND ${mileageHigh}
    AND MPG BETWEEN ${mpgLow} AND ${mpgHigh}
    AND Year BETWEEN ${yearLow} AND ${yearHigh}
  `;
  if (noAccident) {
    qry += ` AND Accident = 0`
  }

  if (oneOwner) {
    qry += ` AND One_owner = 1`
  }

  if (make === '' && model === '') {
    qry += `
    ORDER BY Make, Model`
  } else if (model === '') {
    qry += `
      AND Make LIKE '${make}%'
    ORDER BY Make, Model
    `
  } else if (make === '') {
    qry += 
    `
     AND Model LIKE '${model}%'
    ORDER BY Make, Model
    `
  } else {
    qry += `
     AND Make LIKE '${make}%'
    AND Model LIKE '${model}%'
    ORDER BY Make, Model
    `
  }
  if (page) {
    qry += `LIMIT ${pageSize} OFFSET ${disp}`
  }
  connection.query(
    qry, (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

// Route 9: GET /price_estimates/:make/:model/:year
const price_estimates = async function(req, res) {
  const make = req.params.make;
  const model = req.params.model;
  const year = req.params.year;

  qry = `
  SELECT Make, Model, Year, AVG(Price) AS AveragePrice
  FROM UsedCars
  WHERE Make = '${make}' AND Model = '${model}' AND Year=${year}
  GROUP BY Make, Model, Year
  `
  
  connection.query(
    qry, (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

// Route 10: GET /car_rankings
const car_rankings = async function(req, res) {

  qry = `
  WITH ReviewThreshold AS (
    SELECT Make, Model, COUNT(*) as NumReviews
    FROM Reviews r
    GROUP BY Make, Model
    HAVING COUNT(*) >= 10
)
SELECT rm.Make, rm.Model, rm.AverageRating, rm.AveragePrice, rm.AverageMileage, rm.PercentageAccidents, rt.NumReviews, rm.Ranking
FROM RankedModels rm JOIN ReviewThreshold rt ON rm.Make=rt.Make AND rm.Model=rt.Model
WHERE rm.AverageMileage < 100000 AND rm.PercentageAccidents < 50
ORDER BY rm.AverageMileage DESC, rm.PercentageAccidents;
  `
  connection.query(
    qry, (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

// Route 11: GET /car_safety_and_rankings
const car_safety_and_rankings = async function(req, res) {
  const avgRating = req.query.avg_rating ?? 1.0;

  qry = `
  SELECT
        u.Make, u.Model, AVG(u.Price) AS AvgPrice,
        AVG(u.Mileage) AS AvgMileage,
        SUM(CASE WHEN u.Accident = 1.0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS PercentAccidents,
        COUNT(CASE WHEN r.Rating >= 4 THEN 1 END) AS HighRatingsCount,
        AVG(r.Rating) AS AvgRating
    FROM UsedCars u
    JOIN Reviews r ON u.Make = r.Make AND u.Model = r.Model AND u.Year = r.Year
    JOIN HighlyRatedModels hrm ON u.Make = hrm.Make AND u.Model = hrm.Model
    WHERE u.One_owner = 1.0
    GROUP BY u.Make, u.Model
    ORDER BY PercentAccidents, HighRatingsCount DESC;
  `
  connection.query(
    qry, (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

// Route 12: GET /car_zscore/:car_id
const car_zscore = async function(req, res) {
  const car_id = req.params.car_id;
  qry = `
  WITH CurrentCar AS (
    SELECT Car_Id, Make, Model, Year, Price
    FROM UsedCars
    WHERE Car_Id = ${car_id}
  ),
  ComparableSales AS (
      SELECT c.Model, c.Year, AVG(u.Price) AS Avg_Price, STDDEV(u.Price) AS Price_StdDev
      FROM UsedCars u
      JOIN CurrentCar c ON u.Make = c.Make AND u.Model = c.Model
          AND u.Year BETWEEN c.Year - 3 AND c.Year + 3
          AND u.Car_Id != c.Car_Id 
      GROUP BY c.Model, c.Year
  )
  SELECT cc.Car_Id, cc.Make, cc.Model, cc.Year, cc.Price, cs.Avg_Price, cs.Price_StdDev,
        (cc.Price - cs.Avg_Price) / cs.Price_StdDev AS Z_Score
  FROM CurrentCar cc
  JOIN ComparableSales cs ON cc.Model = cs.Model AND cc.Year = cs.Year
  `;
  connection.query(
    qry, (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

// Route 13: GET /hidden_gems
const hidden_gems = async function(req, res) {
  const minReviews = req.query.min_reviews ?? 0;
  const minRating = req.query.min_rating ?? 4;
  const percBelow = req.query.perc_below ?? 0.1;

  qry = `
  WITH DecentlyRated AS (
      SELECT r.Make, r.Model, r.Year, r.Rating, AVG(Rating) AS AvgRating
      FROM Reviews r
      WHERE Rating >= ${minRating}
      GROUP BY r.Make, r.Model, r.Year
      HAVING COUNT(r.Review_Id) >= ${minReviews} AND AVG(Rating) >= 3
  ),
  UnderpricedCars AS (
      SELECT u.Car_Id, u.Make, u.Model, u.Year, u.Price, m.AvgPrice AS MarketAvgPrice
      FROM UsedCars u
      JOIN MarketAveragePrice m ON u.Make = m.Make AND u.Model = m.Model
      WHERE u.Price < m.AvgPrice * (1- ${percBelow})
  )
  SELECT u.Car_Id, dr.Make, dr.Model, dr.Year, dr.Rating, dr.AvgRating AS ModelAvgRating, u.Price, u.MarketAvgPrice,
          (u.MarketAvgPrice - u.Price) AS PriceBelowMarket
  FROM DecentlyRated dr
  JOIN UnderpricedCars u ON dr.Make = u.Make AND dr.Model = u.Model AND dr.Year = u.Year
  ORDER BY dr.Rating DESC, dr.AvgRating DESC, PriceBelowMarket DESC;
  `;

  connection.query(
    qry, (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

// Route 14: GET /car_reliability
const car_reliability = async function(req, res) {
  qry = `
  WITH ReliabilityData AS (
    SELECT u.Make, u.Model,
        AVG(r.Rating) AS AverageRating,
        SUM(CASE WHEN u.Accident = 1 THEN 1 ELSE 0 END) AS TotalAccidents,
        COUNT(u.Car_Id) AS TotalCars
    FROM UsedCars u
    JOIN Reviews r ON u.Make = r.Make AND u.Model = r.Model
    GROUP BY u.Make, u.Model
  ),
  ReliabilityScore AS (
      SELECT Make, Model,
          AverageRating,
          (TotalAccidents * 100.0 / TotalCars) AS PercAccidents
      FROM ReliabilityData
  )
  SELECT Make, Model, AverageRating, PercAccidents,
      CASE
          WHEN PercAccidents < 10 AND AverageRating > 4 THEN 'High'
          WHEN PercAccidents < 20 AND AverageRating > 3 THEN 'Moderate'
          ELSE 'Low'
      END AS ReliabilityLevel
  FROM ReliabilityScore
  ORDER BY
      CASE ReliabilityLevel
          WHEN 'High' THEN 1
          WHEN 'Moderate' THEN 2
          WHEN 'Low' THEN 3
      END,
      AverageRating DESC;
  `;
  connection.query(
    qry, (err, data) => {
      if (err) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    }
  );
}

// Route 15: GET /fueltype_ranks


const car_fueltypes = async function(req, res) {
  const fuelTypeQuery = req.params.fuel_types;
  const qry = `
    SELECT DISTINCT Make, Model, Year, Fuel_Type, Price, AverageRating,
      ROUND(DepreciationPercent, 2) AS AverageDepreciation, MPG 
    FROM CheapestHighRated
    WHERE Fuel_Type = "${fuelTypeQuery}"
    ORDER BY MPG DESC, Price;
  `;

  connection.query(qry, (err, data) => {
    if (err) {
      console.error("Error querying database:", err);
      res.status(500).json({error: "Internal server error"});
      return;
    }
    res.json(data);
  });
}


module.exports = {
  car,
  car_reviews,
  reviewer,
  search_cars,
  reviewer_avg,
  price_estimates,
  car_efficiency,
  car_ratings,
  car_rankings,
  car_safety_and_rankings,
  car_zscore,
  car_of_the_day,
  hidden_gems,
  car_reliability,
  car_fueltypes
}

