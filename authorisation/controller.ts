import jwt from "jsonwebtoken";
import crypto from "crypto";
import sequelize from "../common/database.ts";
import defineUser from "../common/models/User.ts";
import Ajs from 'ajv';
import type {JSONSchemaType} from 'ajv';
import addFormats from 'ajv-formats';

const User = defineUser(sequelize);

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if(!JWT_SECRET_KEY) {
  throw new Error("Missing JWT_SECRET_KEY environment variable");
}

const encryptPassword = (password: string) => 
    crypto.createHash('sha256').update(password).digest('hex');


const generateAccessToken = (username: string, userId: number) => 
    jwt.sign({ username, userId }, JWT_SECRET_KEY, { expiresIn: '24h' });

interface SchemaDataTypes {
  username: string;
  email: string;
  password: string | number;
}

// validating inputs before creating users
const ajv = new Ajs.default();
addFormats.default(ajv);

const schema: JSONSchemaType<SchemaDataTypes> = {
  type: 'object',
  required: ['username', 'email', 'password'],
  properties: {
    username: { type: 'string', minLength: 3 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  }
};

const validate = ajv.compile(schema);


// register endpoint
const register = async ({req, res}: any) => {
    if(!validate(req.body))

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
        console.log(user);
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

      // check if user exists || the password encrypted
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