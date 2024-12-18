const jwt = require('jsonwebtoken');
const SECRETKEY = process.env.SECRET_KEY;

const auth = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(token){
            let user = jwt.verify(token, SECRETKEY);
            req.userId = user.customerId ;
            
        }
        else{
            return res.status(401).json({message: "Unauthorized user"});
        }
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).json({message: "Unauthorized user"});
    }
}

module.exports = auth;