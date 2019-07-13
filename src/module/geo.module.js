// @flow
import http from '../utils/http';

declare var process: {
    env: {
        GEO_URL: string,
        API_QUERIES: '[]',
        UNIQUE_QUERY: string,
    }
};

const {
    GEO_URL,
    API_QUERIES,
    UNIQUE_QUERY,
} = process.env;

export const getQueries = (address: string) => {
    const queries = {};
    JSON.parse(API_QUERIES).forEach((key) => {
        if (key === UNIQUE_QUERY) {
            queries[key] = address;
        } else {
            queries[key] = process.env[key];
        }
    });
    return queries;
};

export const findAddress = (address: string): Promise<any> => {
    const params = getQueries(address);
    return http.get(GEO_URL, { params });
};
