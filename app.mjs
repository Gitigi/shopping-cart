import express from 'express';

import db from './models/index.js';
import ApiRoutes from './routes/index.mjs'

const {sequelize, Sequelize, Category, Product} = db;

const app = express();

app.use(express.json());

// db.sequelize.sync()

app.use('/api/', ApiRoutes)

app.use((err, req, res, next) => {
    return res.status(500).json(err)
  })


export default app;

const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log(`Running on port ${PORT}`);
