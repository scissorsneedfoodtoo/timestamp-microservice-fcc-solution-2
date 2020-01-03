require('dotenv').config();
const express = require('express');
const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.route('/')
  .get((req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
  });
    
app.route('/api/timestamp/:date?')
  .get((req, res) => {
    
    let date = null;
    // Parse the date string
    if (req.params.date !== undefined) {

      // Check if it is a Unix timestamp
      const unixTimestamp = parseInt(req.params.date*1);
      if (isNaN(unixTimestamp)) {
        
        // It's not a Unix timestamp string
        date = new Date(req.params.date);
      } else {
        
        // It is a timestamp
        date = new Date(unixTimestamp);
      }
      
    } else {
      
      // The date string parameter is empty. 
      // Create a new date based on current time 
      date = new Date(Date.now());
    }
    
    // Initialize the response object. If Date is invalid
    // this one will be returned

    const response = date == "Invalid Date" ? 
      { error: "Invalid Date" } :
      { "unix": date.getTime(),
        "utc": date.toUTCString()
      };
    
    res.json(response);
  });
    
// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
});

module.exports = app; // For testing
