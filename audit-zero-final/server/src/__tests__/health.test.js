const request = require('supertest');
const createApp = require('../app');

describe('GET /api/health', () => {
  it('should return 200 OK with server status', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('status', 'UP');
  });
});
