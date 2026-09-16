import sequelize from "../common/database.ts";
import defineUser from '../common/models/User.ts'

const User = defineUser(sequelize);

const getUser = async (req: any, res: any) => {
    const user = await User.findOne(req.user.id);

    if(!user) return res.status(404).json({ error: 'User not found' });
    res.json({ success: true, data: user });
}

const getAllUsers = async (req: any, res: any) => {
    const users = await User.findAll(req.user);
    res.json({ sucess: true, data: users });
}

const profile = (req: any, res: any) => {
  res.json({
    User: true,
    // id: req.user.id,
    // email: req.user.email,
    username: req.user.username,
  })
}

export default { getUser, getAllUsers, profile };