export const authMiddleware = (req, res, next) => {
    if(req.session.user) {
        return next()
    }
    res.status(401).send({"message": "Unauthorised access"});
}
