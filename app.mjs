import express from 'express';
import session from 'express-session';
import connectSesionSequelize from 'connect-session-sequelize';
import { ValidationError } from 'express-validation';

import db from './models/index.js';
import ApiRoutes from './routes/index.mjs'

const SequelizeStore = connectSesionSequelize(session.Store);

const {sequelize, Sequelize, Category, Product} = db;

const app = express();

app.use(express.json());

app.use(
    session({
        secret: process.env.SECRET,
        store: new SequelizeStore({
            db: sequelize,
        }),
        resave: false,
        proxy: true,
    })
);

db.sequelize.sync()

app.use('/api/', ApiRoutes)

app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json(err)
    }
    return res.status(500).json(err)
})


export default app;

const PORT = process.env.PORT || 8080;
app.listen(PORT);
console.log(`Running on port ${PORT}`);
