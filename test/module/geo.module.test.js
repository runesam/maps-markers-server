import http from 'utils/http';
import * as geoModule from 'module/geo.module';

const {
    GEO_URL,
    API_QUERIES,
    UNIQUE_QUERY,
} = process.env;

describe('geo.module', () => {
    describe('findAddress method', () => {
        let spy;
        beforeEach(() => {
            spy = jest.spyOn(http, 'get');
        });

        it('calls fetch from node-fetch with the right arguments', (done) => {
            const response = {
                data: {
                    status: 'OK',
                    results: [{ id: 'id', name: 'name', geometry: { location: { lat: 1, lng: 2 } } }],
                },
            };
            const expected = {
                id: 'id', lat: 1, lng: 2, name: 'name',
            };
            http.get.mockResolvedValue(response);

            geoModule.findAddress('test').then((res) => {
                const params = geoModule.getQueries('test');

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(GEO_URL, { params });
                expect(res).toEqual([expected]);
                done();
            });
        });
    });

    describe('getQueries method', () => {
        it('returns a plain object with params to be sent', () => {
            const actual = geoModule.getQueries('test');

            const expected = JSON.parse(API_QUERIES || '[]').reduce((acc, key) => {
                acc[key] = key === UNIQUE_QUERY ? 'test' : process.env[key];
                return acc;
            }, {});

            expect(actual).toEqual(expected);
        });
    });
});
