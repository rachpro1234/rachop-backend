import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

if(!JWT_SECRET_KEY) {
    throw Error('Missing JWS SECRET KEY');
}

const check = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];

  if(!authHeader) {
    return res.status(401).json({ error: 'No Authorization header provided' });
  }

  const [type, token] = authHeader.split(' ');
  if(type !== 'Bearer') return res.status(401).json({ error: 'Invalid authorization format' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }

};

export default check;