const request = require("supertest");
const app = require('./src/app');
const Restaurant = require("./models");
const syncSeed = require("./seed.js")
let restQuantity;

beforeAll(async () => {
    await syncSeed();
    const restaurants = await Restaurant.findAll;
    restQuantity = restaurants.length;
})

describe('./restaurants endpoint', () => {
  test("GET /restaurants returns status code of 200", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.statusCode).toEqual(200);
  });
  test("GET /restaurants returns array of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    expect(Array.isArray(response.body)).toBe(true);
  });
  test("GET /restaurants returns correct number of restaurants", async () => {
    const response = await request(app).get("/restaurants");
    const restaurants = response.body;
    expect(restaurants.length).toBe(3);
  });
  test("GET /restaurants returns correct restaurant data", async () => {
    const response = await request(app).get("/restaurants");
    expect(response.body).toContainEqual(expect.objectContaining({
        "cuisine": "FastFood",
        "id": 1,
        "location": "Texas",
        "name": "AppleBees",
    }))
  });
  test("GET /restaurants/:id returns correct restaurant data", async () => {
    const response = await request(app).get("/restaurants/1");
    expect(response.body).toEqual({
        "cuisine": "FastFood",
        "id": 1,
        "location": "Texas",
        "name": "AppleBees",
    })
  });
  test("POST /restaurants increases size of array", async () => {
    const response = await request(app)
        .post("/restaurants")
        .send({name: "New Restaurant", location: "London", cuisine: "British"});
    const restaurants = response.body;
    expect(restaurants.length).toBe(4);
  });
  test("PUT /restaurants/:id returns updated restaurant data", async () => {
    const response = await request(app)
        .put("/restaurants/1")
        .send({name: "Restaurant1", location: "Location1", cuisine: "Cuisine1"});
    const restaurant = await Restaurant.findByPk(1)
    expect(restaurant.name).toEqual("Restaurant1");
  });
  test("DELETE /restaurants/:id deletes correct restaurant data", async () => {
    const response = await request(app).delete("/restaurants/1");
    const restaurants = await Restaurant.findAll()
    expect(restaurants.length).toBe(3);
    expect(restaurants[0].id).not.toEqual(1);
  });
});