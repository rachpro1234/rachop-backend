import sequelize from "../database.ts";
import defineUser from '../models/User.ts';

const User = defineUser(sequelize);

const hasRole = (requiredRole: string) => async (req: any, res: any, next: any) => {
  const user = User.findBypk(req.user.user.id);

  if(!user || user.role !== requiredRole) {
    return res.status(403).json({ error: `requires ${requiredRole} role` })
  };
  next();
};


export default hasRole;