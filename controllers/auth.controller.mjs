import bcrypt from 'bcrypt';

import db from '../models/index.js';

const {User} = db;


export async function register(req, res) {
    let user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });
    res.send(user)
}

export async function login(req, res) {
    let user = await User.findOne({where: {email: req.body.email}})
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if(!passwordIsValid){
        res.status(401).send({'message': 'Invalid Password'})
        return
    }
    req.session.user = user;
    res.send(user)
}

export async function logout(req, res) {
    if(req.session.user)
        req.session.destroy();
    return res.json({'status': 'successful'})
}
