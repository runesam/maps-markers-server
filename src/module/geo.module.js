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

type Result = {
    id: string,
    name: string,
    geometry: {
        location: {
            id: string,
            name: string,
        },
    },
};

type Marker = {
    id: string,
    name: string,
};

export const mapMarkers = (results: Array<Result>):Array<Marker> => {
    try {
        return results.map((result) => {
            const { geometry: { location }, id, name } = result;
            const marker: { id: string, name: string } = location;
            marker.id = id;
            marker.name = name;
            return marker;
        });
    } catch (e) {
        throw e;
    }
};

export const findAddress = (address: string): Promise<any> => {
    const params = getQueries(address);
    return http.get(GEO_URL, { params })
        .then(({ data }) => {
            if (data && data.status === 'ZERO_RESULTS') { return { status: 404, error: data }; }
            if (data && data.status === 'REQUEST_DENIED') { return { status: 400, error: data }; }
            return mapMarkers(data.results);
        })
        .catch((reason) => { throw reason; });
};
