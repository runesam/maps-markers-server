// @flow
import express from 'express';
import bodyParser from 'body-parser';

import { findAddress } from '../module/geo.module';
import markersModule from '../module/markers.module';

export const app = express();

declare var process: { env: { port: number, key: string } };
const { port, key } = process.env;

markersModule.initialMarkersJSON();

app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use(bodyParser.json());

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

app.get('/user', (req, res) => {
    const markers = markersModule.getMarkers();
    console.log(markers);
    res.status(200);
    res.send({ key, markers });
});

app.post('/markers', (req, res) => {
    const result = markersModule.addMarker(req.body);
    if (result.error) {
        res.status(400);
        return res.send(result);
    }
    res.status(201);
    return res.send(result);
});

app.put('/markers', (req, res) => {
    const result = markersModule.updateMarker(req.body);
    if (result.error) {
        res.status(400);
        return res.send(result);
    }
    res.status(200);
    return res.send(result);
});

app.delete('/markers/:markerId', (req, res) => {
    const { markerId } = req.params;
    const result = markersModule.deleteMarker({ id: markerId });
    res.status(202);
    return res.send(result);
});

export default app.listen(port, () => console.log(`express init, listening to port ${port}`));
