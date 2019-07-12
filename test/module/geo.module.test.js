import http from 'utils/http';
import { findAddress, getQueries } from 'module/geo.module';

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
            const response = { status: 'OK', result: 'test result' };
            http.get.mockResolvedValue(response);

            findAddress('test').then((res) => {
                const params = getQueries('test');

                expect(spy).toHaveBeenCalledTimes(1);
                expect(spy).toHaveBeenCalledWith(GEO_URL, { params });
                expect(res).toEqual(response);
                done();
            });
        });
    });

    describe('getQueries method', () => {
        it('returns a plain object with params to be sent', () => {
            const actual = getQueries('test');

            const expected = JSON.parse(API_QUERIES || '[]').reduce((acc, key) => {
                acc[key] = key === UNIQUE_QUERY ? 'test' : process.env[key];
                return acc;
            }, {});

            expect(actual).toEqual(expected);
        });

        it('returns an empty plain object if API_QUERIES is false', () => {
            delete process.env.API_QUERIES;

            const actual = getQueries('test');
            expect(actual).toEqual({});
        });
    });
});
