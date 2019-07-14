import request from 'supertest';

import server, { app } from 'app';
import * as geoModule from 'module/geo.module';
import markersModule from 'module/markers.module';

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
                .get('/geo/grunewaldStr./')
                .expect(200)
                .expect(res => expect(res.body).toEqual(response))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith('grunewaldStr.');
                        done();
                    }
                });
        });

        it('returns right status code if there was error', (done) => {
            const response = { status: 400, error: 'error message' };
            geoModule.findAddress.mockResolvedValue(response);

            request(app)
                .get('/geo/grunewaldStr.')
                .expect(response.status)
                .expect(res => expect(res.body).toEqual(response))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith('grunewaldStr.');
                        done();
                    }
                });
        });

        it('returns 500 when findAddress is rejected', (done) => {
            const reason = { error: 'Not Found' };
            geoModule.findAddress.mockRejectedValue(reason);

            request(app)
                .get('/geo/grunewaldStr.')
                .expect(500)
                .expect(res => expect(res.body).toEqual(reason))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith('grunewaldStr.');
                        done();
                    }
                });
        });
    });

    describe('/user endpoint', () => {
        let spy;
        beforeEach(() => {
            spy = jest.spyOn(markersModule, 'getMarkers');
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns 200 with markers', (done) => {
            const { key } = process.env;
            const markers = [{ id: 3 }];
            markersModule.getMarkers.mockReturnValue(markers);

            request(app)
                .get('/user/')
                .expect(200)
                .expect(res => expect(res.body).toEqual({ markers, key }))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        done();
                    }
                });
        });
    });

    describe('/markers post endpoint', () => {
        let spy;
        beforeEach(() => {
            spy = jest.spyOn(markersModule, 'addMarker');
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns 201 with added marker', (done) => {
            const marker = { id: 5 };
            markersModule.addMarker.mockReturnValue(marker);

            request(app)
                .post('/markers')
                .send(marker)
                .expect(201)
                .expect(res => expect(res.body).toEqual(marker))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith(marker);
                        done();
                    }
                });
        });

        it('returns 400 with error message', (done) => {
            const marker = { id: 5 };
            const reason = { error: 'couldn\'t add ' };
            markersModule.addMarker.mockReturnValue(reason);

            request(app)
                .post('/markers')
                .send(marker)
                .expect(400)
                .expect(res => expect(res.body).toEqual(reason))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith(marker);
                        done();
                    }
                });
        });
    });

    describe('/markers put endpoint', () => {
        let spy;
        beforeEach(() => {
            spy = jest.spyOn(markersModule, 'updateMarker');
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns 200 with updated marker', (done) => {
            const marker = { id: 5, idToReplace: 3 };
            markersModule.updateMarker.mockReturnValue(marker);

            request(app)
                .put('/markers')
                .send(marker)
                .expect(200)
                .expect(res => expect(res.body).toEqual(marker))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith(marker);
                        done();
                    }
                });
        });

        it('returns 400 with error message', (done) => {
            const marker = { id: 5 };
            const reason = { error: 'couldn\'t update ' };
            markersModule.updateMarker.mockReturnValue(reason);

            request(app)
                .put('/markers')
                .send(marker)
                .expect(400)
                .expect(res => expect(res.body).toEqual(reason))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith(marker);
                        done();
                    }
                });
        });
    });

    describe('/markers/:markerToDelete endpoint', () => {
        let spy;
        beforeEach(() => {
            spy = jest.spyOn(markersModule, 'deleteMarker');
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('returns 202 with deleted marker', (done) => {
            const marker = { id: 5, idToReplace: 3 };
            markersModule.deleteMarker.mockReturnValue(marker);

            request(app)
                .delete(`/markers/${marker.id}`)
                .expect(202)
                .expect(res => expect(res.body).toEqual(marker))
                .end((err) => {
                    if (err) {
                        done.fail(err);
                    } else {
                        expect(spy).toHaveBeenCalledTimes(1);
                        expect(spy).toHaveBeenCalledWith({ id: '5' });
                        done();
                    }
                });
        });
    });
});
