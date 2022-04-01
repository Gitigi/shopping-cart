import express from 'express';

import db from './models/index.js';

const app = express();

app.use(express.json());

db.sequelize.sync()

app.get('/', (req, res) => {
    res.send('Hello World\n');
})

const PORT = 8080;
app.listen(PORT);
console.log(`Running on port ${PORT}`);
