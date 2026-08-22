import jwt from "jsonwebtoken";
import crypto from "crypto";
import sequelize from "../common/database.ts";
import defineUser from "../common/models/User.ts";

const User = defineUser(sequelize);


const encrypPassword = (password: string) => 
    crypto.createHash('sha256').update(password).digest('hex');

const generateAccessToken = (username: string, userId: number) => 
    jwt.sign({ username, userId }, 'secret-key', { expiresIn: '24h' });

const register = async ({req, res}: any) => {
    try {
        const { username, email, password, firstname, lastname } = req.body;

        const encryptedPassword = encrypPassword(password);

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

export default register;