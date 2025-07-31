const request = require('supertest');
const app = require('../server');
const { Pool } = require('pg');

// Mock database pool
jest.mock('pg', () => ({
    Pool: jest.fn().mockImplementation(() => ({
        query: jest.fn(),
        end: jest.fn()
    }))
}));

describe('API Endpoints', () => {
    let mockPool;
    let mockQuery;

    beforeEach(() => {
        mockPool = new Pool();
        mockQuery = jest.fn();
        mockPool.query.mockImplementation(mockQuery);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/buildings', () => {
        test('returns all buildings', async () => {
            const mockBuildings = [
                { id: 1, name: '图书馆', description: '主图书馆' },
                { id: 2, name: '教学楼', description: '主教学楼' }
            ];

            mockQuery.mockResolvedValue({ rows: mockBuildings });

            const response = await request(app).get('/api/buildings');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBuildings);
        });

        test('handles database error', async () => {
            mockQuery.mockRejectedValue(new Error('Database error'));

            const response = await request(app).get('/api/buildings');
            
            expect(response.status).toBe(500);
            expect(response.body).toHaveProperty('error');
        });
    });

    describe('GET /api/buildings/:id', () => {
        test('returns specific building', async () => {
            const mockBuilding = { id: 1, name: '图书馆', description: '主图书馆' };
            mockQuery.mockResolvedValue({ rows: [mockBuilding] });

            const response = await request(app).get('/api/buildings/1');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockBuilding);
        });

        test('returns 404 for non-existent building', async () => {
            mockQuery.mockResolvedValue({ rows: [] });

            const response = await request(app).get('/api/buildings/999');
            
            expect(response.status).toBe(404);
            expect(response.body).toHaveProperty('error', 'Building not found');
        });
    });

    describe('GET /api/buildings/nearby', () => {
        test('returns nearby buildings', async () => {
            const mockNearby = [
                { id: 1, name: '图书馆', distance: 100 },
                { id: 2, name: '教学楼', distance: 150 }
            ];
            mockQuery.mockResolvedValue({ rows: mockNearby });

            const response = await request(app)
                .get('/api/buildings/nearby')
                .query({ lat: 30.5234, lng: 114.3187, radius: 500 });
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockNearby);
        });

        test('validates required parameters', async () => {
            const response = await request(app)
                .get('/api/buildings/nearby')
                .query({ lat: 30.5234 });
            
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', 'Latitude and longitude are required');
        });
    });

    describe('GET /api/facilities', () => {
        test('returns all facilities', async () => {
            const mockFacilities = [
                { id: 1, name: '食堂', type: 'canteen' },
                { id: 2, name: '医务室', type: 'medical' }
            ];
            mockQuery.mockResolvedValue({ rows: mockFacilities });

            const response = await request(app).get('/api/facilities');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockFacilities);
        });
    });

    describe('GET /api/navigation', () => {
        test('returns navigation path', async () => {
            const mockPath = [
                { lat: 30.5234, lng: 114.3187 },
                { lat: 30.5235, lng: 114.3188 }
            ];
            mockQuery.mockResolvedValue({ rows: mockPath });

            const response = await request(app)
                .post('/api/navigation')
                .send({
                    start: { lat: 30.5234, lng: 114.3187 },
                    end: { lat: 30.5235, lng: 114.3188 }
                });
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockPath);
        });
    });
});
