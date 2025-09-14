import jwt from 'jsonwebtoken';

function authorizeRoles(roles) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, 'SECRET_KEY', (err, user) => {
      if (err) return res.sendStatus(403);
      if (!roles.includes(user.role)) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
}

export default authorizeRoles;
