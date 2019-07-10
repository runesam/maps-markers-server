// @flow
import express from 'express';

export const app = express();
const port = process.env.PORT || 3000;

app.get('/test', (req, res) => {
    res.status(200);
    res.send({ test: 'result goes here' });
});

export default app.listen(port, () => console.log(`express init, listening to port ${port}`));