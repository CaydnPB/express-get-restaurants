const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/restaurants", async (req, res) => {
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

app.get("/restaurants/:id", async (req, res) => {
  const rest = await Restaurant.findByPk(req.params.id);
  res.json(rest);
});

app.post("/restaurants", async (req, res) => {
  const rest = await Restaurant.create(req.body);
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
});

app.put("/restaurants/:id", async (req, res) => {
  const updatedRest = await Restaurant.update(req.body, {where: {id: req.params.id}});
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
})

app.delete("/restaurants/:id", async (req, res) => {
  const deletedRest = await Restaurant.destroy({where: {id: req.params.id}});
  const restaurants = await Restaurant.findAll();
  res.json(restaurants);
})

module.exports = app;