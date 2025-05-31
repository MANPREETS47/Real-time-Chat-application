import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: 'Not authorized, no token'});
        }
        
        const deocded = jwt.verify(token, process.env.JWT_SECRET);
        if(!deocded){
            return res.status(401).json({message: 'Not authorized, token failed'});
        }
        const user = await User.findById(deocded.userId).select('-password');
        if(!user){
            return res.status(401).json({message: 'Not authorized, user not found'});
        }
        req.user = user;
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({message: 'Not authorized, token failed'});
    }
}