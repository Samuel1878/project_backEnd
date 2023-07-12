import jwt from "jsonwebtoken";

const generateToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1d',
    })
}
export const gCode = () => {
   return Math.random().toString(36).substring(2, 12);
 };
export default generateToken;