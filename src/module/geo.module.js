// @flow
import http from '../utils/http';

export const getQueries = (address: string) => {
    const { API_QUERIES, UNIQUE_QUERY } = process.env;

    const queries = {};
    JSON.parse(API_QUERIES || '[]').forEach((key) => {
        if (key === UNIQUE_QUERY) {
            queries[key] = address;
        } else {
            queries[key] = process.env[key];
        }
    });
    return queries;
};

export const findAddress = (address: string): Promise<any> => {
    const { GEO_URL } = process.env;
    const params = getQueries(address);
    return http.get(GEO_URL, { params });
};
