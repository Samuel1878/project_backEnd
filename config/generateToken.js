import jwt from "jsonwebtoken";

const generateToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '7d',
    })
}
export const gCode = () => {
   return Math.random().toString(36).substring(2, 12);
 };

export const decodeToken = token => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

export default generateToken;