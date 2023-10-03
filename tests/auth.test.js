const { describe, expect, test } = global;
const app = require('@root/index');
const request = require('supertest');

describe('GET /auth/SignUp', () => {
  test('Should return Wrong params', async () => {
    const res = await request(app)
      .get('/auth/SignUp')
      .query({ phoneNumber: '19135350531' });
    expect(res.statusCode).toBe(400);
  });
  test('Should return empty params', async () => {
    const res = await request(app)
      .get('/auth/SignUp')
      .query({ phoneNumber: '' });
    expect(res.statusCode).toBe(400);
  });
  test('Should return No params', async () => {
    const res = await request(app).get('/auth/SignUp');
    expect(res.statusCode).toBe(400);
  });
  test('Should return Success', async () => {
    const res = await request(app)
      .get('/auth/SignUp')
      .query({ phoneNumber: '09135350531' });
    expect(res.statusCode).toBe(201);
  });
});
