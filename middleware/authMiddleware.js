const User  = require("../models/User");
const { errorResponse } = require("../utils/apiUtils");
const {verifyToken} = require("../utils/tokenUtils");

// Middleware to protect routes
const protect = async (req, res , next) => {
    try{
        let token;
// JWT is sent in the Authorization header as: "Bearer <token>"
         
    const authHeader = req.headers.authorization;
    if(authHeader && authHeader.startsWith("Bearer ")){
        token = authHeader.split(" ")[1];
    }
    if(!token){
return errorResponse(res,401,"Access denied. No token provided.");
 }
const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
const user = await User.findById(decoded.id);
if(!user){
    return errorResponse(res,401,"User belonging to this token no longer exist.");

}

req.user = user;
next();
    }
    catch(error){
        console.error("Error in auth middleware:", error);
        return errorResponse(res, 401, "Invalid or expired token");
    }
}

// Role Authorization Middleware 

const authorize = (...allowedRoles)=> {
    return(req , res , next) => {
        if(!allowedRoles.includes(req.user.role)){
            return errorResponse(res , 403 , `Acess denied. Requires ${allowedRoles.join(" or ")} role.`);
        }
        next();
    }
};

module.exports = { protect , authorize};