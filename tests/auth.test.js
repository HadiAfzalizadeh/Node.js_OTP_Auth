const { describe, expect, test } = global;
const app = require('@root/index');
const request = require('supertest');

describe('GET /auth/SignUp', () => {
  test('phone number must be in correct format', async () => {
    const res = await request(app)
      .get('/auth/SignUp')
      .query({ phoneNumber: '19135350531' });
    expect(res.statusCode).toBe(400);
  });
  test('phone number should be present in request', async () => {
    const res = await request(app).get('/auth/SignUp');
    expect(res.statusCode).toBe(400);
  });
  test('varification codes must be at least one minute apart', async () => {
    await request(app)
      .get('/auth/SignUp')
      .query({ phoneNumber: '09135350532' });
    const res = await request(app)
      .get('/auth/SignUp')
      .query({ phoneNumber: '09135350532' });
    expect(res.statusCode).toBe(403);
  });
  test('should send verification code if there is nothing wrong', async () => {
    const res = await request(app)
      .get('/auth/SignUp')
      .query({ phoneNumber: '09135350531' });
    expect(res.statusCode).toBe(201);
  });
});

describe('POST /auth/SignIn', () => {
  test('verification code should be present in request body', async () => {
    const res = await request(app)
      .post('/auth/SignIn')
      .set('PhoneNumber', '09135350531');
    expect(res.statusCode).toBe(400);
  });
  test('verification code should be present in correct format', async () => {
    const body = {
      VerificationCode: '125851',
    };
    const res = await request(app)
      .post('/auth/SignIn')
      .send(body)
      .set('PhoneNumber', '09135350531');
    expect(res.statusCode).toBe(400);
  });
});
