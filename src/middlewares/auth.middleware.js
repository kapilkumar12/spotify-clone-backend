const jwt = require('jsonwebtoken');

async function authArtistMiddleware(req,res,next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        if (decoded.role !== 'artist') {
            return res.status(403).json({
                message: "You are not allowed to perform this action"
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            error: error.message
        });
    }
}

async function authUserMiddleware(req,res,next) {

const token = req.cookies.token;
if (!token) {
    return res.status(401).json({
        message: "Unauthorized"
    })
}

try {
    
const decoded = jwt.verify(token,process.env.JWT_SECRET);
if (decoded.role !== 'user' && decoded.role !== 'artist') {
    return res.status(403).json({
        message: "You are not allowed to perform this action"
    })
}

req.user = decoded;
next();

} catch (error) { 
    return res.status(401).json({
        message: "Unauthorized",
        error: error.message
    })

}


}


module.exports = {authArtistMiddleware, authUserMiddleware}