
   
const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
var cors = require('cors')
const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "client")));
app.use(cors())
app.use(bodyParser.json());

const publicVapidKey = "BNBCKS5eEzcag1Gh1QT_vvTHmDhwOBLzqmC4jCLHjnMorN4NurRPZnhLs5Vm96-IGhPcO8cnD8VxAMZWqEZlSXM"
const privateVapidKey = "Lz3_gMFYLAUpvxvpzbXuiMp6OitwDmrjl9c9LhDh9q0";

webpush.setVapidDetails(
  "mailto:chaunguyennam5@gmail.com",
  publicVapidKey,
  privateVapidKey
);

// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;

  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
  const payload = JSON.stringify({ title: "Push Test nha", url:"https://maps.google.com"});

  // Pass object into sendNotification
  webpush
    .sendNotification(subscription, payload).then((res) => console.log(res))
    .catch(err => console.error(err));
});

const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));