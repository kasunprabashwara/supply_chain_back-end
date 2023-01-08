const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM login_data WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      }
      if (result.length == 0) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          db.query(
            "INSERT INTO login_data (username, password) VALUE (?,?)",
            [username, hash],
            (error, response) => {
              if (err) {
                res.send(err);
              }

              res.send({ msg: "User successfully added" });
            }
          );
        });
      } else {
        res.send({ msg: "Username already exists" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM login_data WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.send({ msg: "login error" });
      } else if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (error) {
            res.send(error);
            console.log(error);
          } else {
            if (response) {
              res.send({ msg: "User logged in" });
            } else {
              res.send({ msg: "Incorrect password" });
            }
          }
        });
      } else {
        res.send({ msg: "User not registered" });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
