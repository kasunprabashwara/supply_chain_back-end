const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "supply_chain",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/get", (req, res) => {
  const sqlSelect = "call quarterlySales(4,'2022')";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});
app.post("/api/insert", (req, res) => {
  const cusName = req.body.cusName;
  const review = req.body.review;
  const sqlInsert = "insert into review (name, review) values (?,?)";
  db.query(sqlInsert, [cusName, review], (err, result) => {
    console.log(err);
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
