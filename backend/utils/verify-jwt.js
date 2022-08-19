/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const { NotAuthorized } = require('../exceptions');

const verifyUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    return res.status(401).json({ error: 'token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ error: 'token malformated' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid token' });

    if (req.body.userEmail && req.body.userEmail !== decoded.email)
      return res.status(401).json({ error: 'Auth emails do not match' });

    if (req.params.email && req.params.userEmail !== decoded.email)
      return res.status(401).json({ error: 'Auth emails do not match' });

    req.userId = decoded.id;
    req.userEmail = decoded.email;

    return next();
  });
};

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'No token provided' });

  const parts = authHeader.split(' ');

  if (!parts.length === 2)
    return res.status(401).json({ error: 'token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ error: 'token malformated' });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Invalid token' });

    if (decoded.email !== process.env.ADMIN_EMAIL)
      throw new NotAuthorized('Acesso somente para administradores');

    req.userEmail = decoded.email;

    return next();
  });
};

module.exports = { verifyUserJwt, verifyAdmin };
