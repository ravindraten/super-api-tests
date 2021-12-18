const supertest = require('supertest');
const request = supertest('https://gorest.co.in/public-api/');
const faker = require('faker');

const TOKEN = "811906fc21d36f0b04e41fde6f28a97c188ad9c1192c35290be067b6130ebfe8";

export const createRandomUserWithFaker = async () => {
  const data = {
    email: faker.internet.email(),
    name: faker.name.firstName(),
    status: 'Active',
    gender: 'Male',
  };

  const res = await request
    .post(`users`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(data);

  return res.body.data;
};

export const createRandomUser = async () => {
  const data = {
    email: 'jmathews' + Math.floor(Math.random() * 99999) + '@mail.ca',
    name: 'John',
    status: 'Active',
    gender: 'Male',
  };
  const res = await request
    .post(`users`)
    .set('Authorization', `Bearer ${TOKEN}`)
    .send(data);
  return res.body.data;
};