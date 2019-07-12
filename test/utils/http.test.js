import axios from 'axios';

import http from 'utils/http';

describe('http', () => {
    it('is a basic created instance of axios', () => {
        expect(Object.keys(http)).toEqual(Object.keys(axios.create()));
    });
});
