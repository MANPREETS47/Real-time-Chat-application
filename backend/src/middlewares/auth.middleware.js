import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: 'Not authorized, no token'});
        }
        const token = authHeader.split(' ')[1];

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