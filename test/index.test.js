import request from 'supertest';

import server, { app } from '../src/index';

describe('app', () => {
    afterAll((done) => {
        server.close(done)
    });

    describe('/test endpoint', () => {
        it('gets the right test value', (done) => {
            request(app)
            .get('/test')
            .expect(200)
            .expect(res => expect(res.body.test).toBe('result goes here'))
            .end(done);
        });
    });
});