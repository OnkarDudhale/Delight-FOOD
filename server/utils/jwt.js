import jwt from 'jsonwebtoken';

export const createRefreshToken = (id, role, expiresIn = '7d') => {
  if (!process.env.REFRESH_SECRET) throw new Error('REFRESH_SECRET not set');
  return jwt.sign({ id, role }, process.env.REFRESH_SECRET, { expiresIn });
};

export const createAccessToken = (id, role, expiresIn = '15m') => {
  if (!process.env.ACCESS_SECRET) throw new Error('ACCESS_SECRET not set');
    return jwt.sign({ id, role }, process.env.ACCESS_SECRET, { expiresIn });
}