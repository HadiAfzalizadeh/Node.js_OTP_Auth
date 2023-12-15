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
  test('phone number should be in request cookies', async () => {
    const res = await request(app).post('/auth/SignIn');
    expect(res.statusCode).toBe(400);
  });
  test('phone number must be in correct format', async () => {
    const res = await request(app)
      .post('/auth/SignIn')
      .set('Cookie', ['phoneNumber=19135350531']);
    expect(res.statusCode).toBe(400);
  });
  test('verification code should be present in request body', async () => {
    const res = await request(app)
      .post('/auth/SignIn')
      .set('Cookie', ['phoneNumber=09135350531']);
    expect(res.statusCode).toBe(400);
  });
  test('verification code should be in correct format', async () => {
    const res = await request(app)
      .post('/auth/SignIn')
      .set('Cookie', ['phoneNumber=09135350531'])
      .send({
        verificationCode: '432434l;',
      });
    expect(res.statusCode).toBe(400);
  });
  test('The verification code must have been previously requested', async () => {
    const res = await request(app)
      .post('/auth/SignIn')
      .set('Cookie', ['phoneNumber=09135350533'])
      .send({
        verificationCode: '432434',
      });
    expect(res.statusCode).toBe(404);
  });
  test('The verification code must have correct value', async () => {
    const res = await request(app)
      .post('/auth/SignIn')
      .set('Cookie', ['phoneNumber=09135350531'])
      .send({
        verificationCode: '432434',
      });
    expect(res.statusCode).toBe(401);
  });
});
