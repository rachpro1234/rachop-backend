import jwt from "jsonwebtoken";
import crypto from "crypto";
import sequelize from "../common/database.ts";
import defineUser from "../common/models/User.ts";

const User = defineUser(sequelize);


const encryptPassword = (password: string) => 
    crypto.createHash('sha256').update(password).digest('hex');

const generateAccessToken = (username: string, userId: number) => 
    jwt.sign({ username, userId }, 'secret-key', { expiresIn: '24h' });

// register endpoint
const register = async ({req, res}: any) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;

        const encryptedPassword = encryptPassword(password);

        const user = await User.create({
            username,
            email,
            password: encryptedPassword,
            firstname,
            lastname,
        });

        const accessToken = generateAccessToken(username, user.id);
        res.status(201).json({
            success: true,
            user: { id: user.id, username: user.username, email: user.email },
            token: accessToken
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
}

// login endpoint
const login = async ({req, res}: any) => {
    try {
     // retrieve the username, password
     const { username, password } = req.body;

      // encrypt the given password
      const encrypted = encryptPassword(password);

      // find the given username
      const user = await User.find({ where : {username} });

      // check if user exists and the password encrypted
      if(!user || user.password !== encrypted) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // access the token username and id
      const token = generateAccessToken(username, user.id);
      res.json({ success: true, user, token });

      console.log('user successfully logged in');

    } catch (error) {
      console.log('user not found', error);
      res.status(404).json({ error: 'user not found' });
    }
}

export default {register, login};