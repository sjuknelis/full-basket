const fs = require("fs");
const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const upload = multer({dest: "img/"});
const PORT = process.argv[2] || 8080;

const TEMPLATE = {
  "title": "",
  "organizer": "",
  "description": "",
  "seeking": [
    {
      "name": "Canned Fruit,
      "amount": 0,
      "goal": 0
    },
    {
      "name": "Canned Vegetables",
      "amount": 0,
      "goal": 0
    },
    {
      "name": "Rice",
      "amount": 0,
      "goal": 0
    },
    {
      "name": "Meat",
      "amount": 0,
      "goal": 0
    },
    {
      "name": "Fish",
      "amount": 0,
      "goal": 0
    },
    {
      "name": "Wheat Products (inc. bread)",
      "amount": 0,
      "goal": 0
    }
  ],
  "recents": [],
  "address": {
    "street": "",
    "city": "",
    "state": "",
    "zip": ""
  },
  "img": "",
  "email": ""
};

let db;

app.use(cors());
app.use("/img",express.static("img"));


app.get("/listings",(request,response) => {
  response.send(JSON.stringify(db));
});

app.get("/listing",(request,response) => {
  response.send(JSON.stringify(db[request.query.id]));
});

app.get("/donation",(request,response) => {
  const {donating,name} = JSON.parse(request.query.data);
  const listing = db[request.query.id];
  let sumDonated = 0;
  for ( const seekingItem of listing.seeking ) {
    for ( const donatingItem of donating ) {
      if ( seekingItem.name == donatingItem.name ) {
        seekingItem.amount -= donatingItem.donating;
        sumDonated += donatingItem.donating;
        break;
      }
    }
  }
  listing.recents.unshift({
    name,
    amount: sumDonated,
    donating
  });
  commitDB();
  response.send("ok");
});

app.get("/edit",(request,response) => {
  const listingData = JSON.parse(request.query.data);
  db[request.query.id] = listingData;
  commitDB();
  response.send("ok");
});

app.post("/image",upload.single("image"),(request,response) => {
  commitDB();
  response.send(request.file.filename);
});

app.get("/create",(request,response) => {
  const created = JSON.parse(JSON.stringify(TEMPLATE));
  created.email = request.query.email;
  response.send((db.push(created) - 1).toString());
  commitDB();
});

function commitDB() {
  fs.writeFile("db.json",JSON.stringify(db,null,2),() => {});
}

fs.readFile("db.json",(err,data) => {
  db = JSON.parse(data.toString());
  app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`);
  });
});
