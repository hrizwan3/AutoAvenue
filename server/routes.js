const mysql = require('mysql')
const config = require('./config.json')

// Creates MySQL connection using database credential provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = mysql.createConnection({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
});
connection.connect((err) => err && console.log(err));

/******************
 * WARM UP ROUTES *
 ******************/

// Route 1: GET /author/:type
const author = async function(req, res) {
  // TODO (TASK 1): replace the values of name and pennkey with your own
  const name = 'Hassan Rizwan';
  const pennkey = 'hrizwan3';

  // checks the value of type in the request parameters
  // note that parameters are required and are specified in server.js in the endpoint by a colon (e.g. /author/:type)
  if (req.params.type === 'name') {
    // res.send returns data back to the requester via an HTTP response
    res.json({ name: name });
  } else if (req.params.type === 'pennkey') {
    // TODO (TASK 2): edit the else if condition to check if the request parameter is 'pennkey' and if so, send back a JSON response with the pennkey
    res.json({ pennkey: pennkey })
  } else {
    res.status(400).json({});
  }
}

// Route 2: GET /random
const random = async function(req, res) {
  // you can use a ternary operator to check the value of request query values
  // which can be particularly useful for setting the default value of queries
  // note if users do not provide a value for the query it will be undefined, which is falsey
  const explicit = req.query.explicit === 'true' ? 1 : 0;

  // Here is a complete example of how to query the database in JavaScript.
  // Only a small change (unrelated to querying) is required for TASK 3 in this route.
  connection.query(`
    SELECT *
    FROM Songs
    WHERE explicit <= ${explicit}
    ORDER BY RAND()
    LIMIT 1
  `, (err, data) => {
    if (err || data.length === 0) {
      // If there is an error for some reason, or if the query is empty (this should not be possible)
      // print the error message and return an empty object instead
      console.log(err);
      // Be cognizant of the fact we return an empty object {}. For future routes, depending on the
      // return type you may need to return an empty array [] instead.
      res.json({});
    } else {
      // Here, we return results of the query as an object, keeping only relevant data
      // being song_id and title which you will add. In this case, there is only one song
      // so we just directly access the first element of the query results array (data)
      // TODO (TASK 3): also return the song title in the response
      res.json({
        song_id: data[0].song_id, // data[0] because only one row in query
        title: data[0].title
      });
    }
  });
}


// Route 3: GET /car/:car_id
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


// Route 4: GET /album/:album_id
const reviewer = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const reviewer = req.params.reviewer_name;
  connection.query(`
  SELECT *
  FROM Reviews
  WHERE Reviewer = "${reviewer}"
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

const reviewer_avg = async function(req, res) {
  // TODO (TASK 5): implement a route that given a album_id, returns all information about the album
  const reviewer = req.params.reviewer_name;
  connection.query(`
  SELECT AVG(Rating)
  FROM Reviews
  WHERE Reviewer = ${reviewer}
  GROUP BY Reviewer
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data[0]);
    }
  });
}

// Route 5: GET /albums
const albums = async function(req, res) {
  // TODO (TASK 6): implement a route that returns all albums ordered by release date (descending)
  // Note that in this case you will need to return multiple albums, so you will need to return an array of objects
  connection.query(`
  SELECT *
  FROM Albums
  ORDER BY release_date DESC
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

// Route 6: GET /album_songs/:album_id
const album_songs = async function(req, res) {
  // TODO (TASK 7): implement a route that given an album_id, returns all songs on that album ordered by track number (ascending)
  const album_id = req.params.album_id;
  connection.query(`
  SELECT s.song_id, s.title, s.number, s.duration, s.plays
  FROM Albums a
  JOIN Songs s ON a.album_id = s.album_id AND a.album_id = "${album_id}"
  ORDER BY s.number
  `, (err, data) => {
    if (err || data.length === 0) {
      console.log(err);
      res.json({});
    } else {
      res.json(data);
    }
  });
}

/************************
 * ADVANCED INFO ROUTES *
 ************************/

// Route 7: GET /top_songs
const top_songs = async function(req, res) {
  const page = req.query.page;
  // TODO (TASK 8): use the ternary (or nullish) operator to set the pageSize based on the query or default to 10
  const pageSize = req.query.page_size ?? 10;
  const disp = (page - 1) * pageSize;

  if (!page) {
    // TODO (TASK 9)): query the database and return all songs ordered by number of plays (descending)
    // Hint: you will need to use a JOIN to get the album title as well
    connection.query(`
    SELECT s.song_id, s.title, a.album_id, a.title AS album, s.plays
    FROM Songs s
    JOIN Albums a ON a.album_id = s.album_id
    ORDER BY s.plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    // TODO (TASK 10): reimplement TASK 9 with pagination
    // Hint: use LIMIT and OFFSET (see https://www.w3schools.com/php/php_mysql_select_limit.asp)
    connection.query(`
    SELECT s.song_id, s.title, a.album_id, a.title AS album, s.plays
    FROM Songs s
    JOIN Albums a ON a.album_id = s.album_id
    ORDER BY s.plays DESC
    LIMIT ${pageSize} OFFSET ${disp}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 8: GET /top_albums
const top_albums = async function(req, res) {
  // TODO (TASK 11): return the top albums ordered by aggregate number of plays of all songs on the album (descending), with optional pagination (as in route 7)
  // Hint: you will need to use a JOIN and aggregation to get the total plays of songs in an album
  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const disp = (page - 1) * pageSize;

  if (!page) {
    connection.query(`
    SELECT a.album_id, a.title, SUM(s.plays) AS plays
    FROM Songs s
    JOIN Albums a ON a.album_id = s.album_id
    GROUP BY a.album_id
    ORDER BY plays DESC
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  } else {
    connection.query(`
    SELECT a.album_id, a.title, SUM(s.plays) AS plays
    FROM Songs s
    JOIN Albums a ON a.album_id = s.album_id
    GROUP BY a.album_id
    ORDER BY plays DESC
    LIMIT ${pageSize} OFFSET ${disp}
    `, (err, data) => {
      if (err || data.length === 0) {
        console.log(err);
        res.json({});
      } else {
        res.json(data);
      }
    });
  }
}

// Route 9: GET /search_cars
const search_cars = async function(req, res) {

  const make = req.query.make ?? '';
  const model = req.query.model ?? '';
  const priceLow = req.query.price_low ?? 0;
  const priceHigh = req.query.price_high ?? 10000000;
  const mileageLow = req.query.mileage_low ?? 0;
  const mileageHigh = req.query.mileage_high ?? 1000000;
  const mpgLow = req.query.mpg_low ?? 0;
  const year = req.query.year ?? 0;

  const accident = req.query.accident === 'true' ? 1 : 0;
  const oneOwner = req.query.one_owner === 'true' ? 1 : 0;

  const page = req.query.page;
  const pageSize = req.query.page_size ?? 10;
  const disp = (page - 1) * pageSize;

  qry = `
  SELECT *
  FROM UsedCars
  WHERE Price BETWEEN ${priceLow} AND ${priceHigh}
    AND Mileage BETWEEN ${mileageLow} AND ${mileageHigh}
    AND Accidents <= ${accident}
    AND One_owner <= ${oneOwner}
    AND MPG > ${mpgLow}
    AND Year = ${year}
  `;
  if (make === '' && model === '') {
    qry += `ORDER BY Make, Model`
  } else if (model === '') {
    qry += `  AND Model LIKE '%${model}%'
    ORDER BY Make, Model
    `
  } else if (make === '') {
    qry += `  AND Make LIKE '%${make}%'
    ORDER BY Make, Model
    `
  } else {
    qry += `  AND Make LIKE '%${make}%'
    AND Model LIKE '%${model}%'
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


module.exports = {
  author,
  random,
  car,
  reviewer,
  albums,
  album_songs,
  top_songs,
  top_albums,
  search_cars,
  reviewer_avg
}
