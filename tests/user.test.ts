import request from 'supertest';
import app from '../src/app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should not register user with existing email', async () => {
    const res = await request(app).post('/api/users/register').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  // Additional tests...
});
