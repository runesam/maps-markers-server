// @flow
import express from 'express';

import { findAddress } from '../module/geo.module';

export const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});

app.get('/geo/:address', (req, res) => {
    const { address } = req.params;
    findAddress(address)
        .then(({ data }) => {
            if (data && data.status !== 'OK') {
                res.status(404);
                return res.send(data);
            }
            res.status(200);
            return res.send(data);
        })
        .catch((reason) => {
            res.status(500);
            res.send(reason);
        });
});


export default app.listen(port, () => console.log(`express init, listening to port ${port}`));
