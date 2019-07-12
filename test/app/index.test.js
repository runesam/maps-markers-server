import request from 'supertest';

import server, { app } from 'app';
import * as geoModule from 'module/geo.module';

describe('app', () => {
    afterAll((done) => {
        server.close(done);
    });

    describe('/geo/:address endpoint', () => {
        let spy;
        beforeEach(() => {
            spy = jest.spyOn(geoModule, 'findAddress');
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns 200 when status is OK', (done) => {
            const response = { data: { status: 'OK' } };
            geoModule.findAddress.mockResolvedValue(response);

            request(app)
                .get('/geo/grunewaldStr.')
                .expect(200)
                .expect(res => expect(res.body).toEqual(response))
                .end(() => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith('grunewaldStr.');
                    done();
                });
        });

        it('returns 404 when status is not OK', (done) => {
            const response = { data: { status: 'Not Found' } };
            geoModule.findAddress.mockResolvedValue(response);

            request(app)
                .get('/geo/grunewaldStr.')
                .expect(404)
                .expect(res => expect(res.body).toEqual(response))
                .end(() => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith('grunewaldStr.');
                    done();
                });
        });

        it('returns 500 when findAddress is rejected', (done) => {
            const reason = { error: 'Not Found' };
            geoModule.findAddress.mockRejectedValue(reason);

            request(app)
                .get('/geo/grunewaldStr.')
                .expect(404)
                .expect(res => expect(res.body).toEqual(reason))
                .end(() => {
                    expect(spy).toHaveBeenCalledTimes(1);
                    expect(spy).toHaveBeenCalledWith('grunewaldStr.');
                    done();
                });
        });
    });
});
