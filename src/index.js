const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(cors());

const { port, dbconfig } = require("./config");

const products = require("./routes/products");

app.get("/fill", async (req, res) => {
  try {
    const users = await fetch("https://jsonplaceholder.typicode.com/users");
    const response = await users.json();
    console.log(response);
    const con = await mysql.createConnection(dbconfig);

    response.forEach(async (user) => {
      const address = `${user.address.street} ${user.address.city}`;
      await con.execute(
        `INSERT INTO users (name, email, addres) values
    (${mysql.escape(user.name)}, ${mysql.escape(user.email)}, ${mysql.escape(
          address
        )})`
      );
    });
    await con.end();
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: "Error" });
  }
});
