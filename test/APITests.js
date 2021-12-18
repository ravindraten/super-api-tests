require('dotenv').config();
const faker = require('faker');

import request from '../config/supertest';
import { expect } from 'chai';

const {
  createRandomUser,
  createRandomUserWithFaker,
} = require('../helper/user');

const TOKEN = "811906fc21d36f0b04e41fde6f28a97c188ad9c1192c35290be067b6130ebfe8";

describe.only('Posts', () => {
  let user, postId;

  before(async () => {
    // user = await createRandomUser();
    user = await createRandomUserWithFaker();
  });

  after(() => {
    // clean up
    // delete a user
  });

  describe('POST', () => {
    it('GET /users', () => {
      // request.get(`users?access-token=${TOKEN}`).end((err, res) => {
      //   expect(res.body.data).to.not.be.empty;
      //   done();
      // });
  
      return request.get(`users?access-token=${TOKEN}`).then((res) => {
        expect(res.body.data).to.not.be.empty;
      });
    });
  
    it('GET /users/:id', () => {
      return request.get(`users/6?access-token=${TOKEN}`).then((res) => {
        expect(res.body.data.id).to.be.eq(6);
      });
    });
  
    it('GET /users with query params', () => {
      const url = `users?access-token=${TOKEN}&page=2&name=Ravi%20Varman`;
  
      return request.get(url).then((res) => {
        res.body.data.forEach((data) => {
          expect(data.name).to.eq('Ravi Varman');
        });
      });
    });
  
    it('POST /users', () => {
      const data = {
        email: `test-${Math.floor(Math.random() * 9999)}@mail.ca`,
        name: 'Test name',
        gender: 'male',
        status: 'inactive',
      };
  
      return request
        .post('users')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data)
        .then((res) => {
          expect(res.body.data).to.deep.include(data);
        });
    });
  
    it('PUT /users/:id', () => {
      const data = {
        status: 'active',
        name: `Luffy - ${Math.floor(Math.random() * 9999)}`,
      };
  
      return request
        .put('users/132')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data)
        .then((res) => {
          console.log(res.body);
          expect(res.body.data).to.deep.include(data);
        });
    });
  
    it('DELETE /users/:id', () => {
      return request
        .delete('users/21')
        .set('Authorization', `Bearer ${TOKEN}`)
        .then((res) => {
          console.log(res.body);
          expect(res.body.code).to.be.eq(404);
        });
    });
    
    it('/posts', async () => {
      const data = {
        user_id: user.id,
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
      };

      const res = await request
        .post('posts')
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data);

      expect(res.body.data).to.deep.include(data);
      postId = res.body.data.id;
    });

    // dependent on previous test
    it('posts/:id', async () => {
      if (postId) {
        await request
          .get(`posts/${postId}`)
          .set('Authorization', `Bearer ${TOKEN}`)
          .expect(200);
      } else {
        throw new Error(`postId is invalid - ${postId}`);
      }
    });
  });

  describe('Negative Tests', () => {
    it('422 Data validation failed', async () => {
      const data = {
        user_id: user.id,
        title: '',
        body: faker.lorem.paragraphs(),
      };

      const res = await request
        .post(`posts`)
        .set('Authorization', `Bearer ${TOKEN}`)
        .send(data);

      expect(res.body.code).to.eq(422);
      expect(res.body.data[0].message).to.eq("can't be blank");
    });

    it('401 Authentication failed', async () => {
      const data = {
        user_id: user.id,
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(),
      };

      const res = await request.post(`posts`).send(data);

      expect(res.body.code).to.eq(401);
      expect(res.body.data.message).to.eq('Authentication failed');
    });
  });
});