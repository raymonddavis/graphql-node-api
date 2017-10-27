import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const generateToken = user => jwt.sign({
  user: {
    id: user.id,
    email: user.email,
  },
}, process.env.SECRET, {
  expiresIn: '30d',
});

export const cleanUser = (user) => {
  const template = {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    birthDate: null,
    location: null,
    phoneNumber: null,
    photos: null,
    isAdmin: null,
    lastTrip: null,
    lastActive: null,
    createdAt: null,
    updatedAt: null,
  };

  return _.pick(user, _.keys(template));
};

export const addUser = async (req) => {
  const { token } = req.headers;
  const facebookCallback = req.headers.referer ?
    req.headers.referer.includes(process.env.FACEBOOK_CALLBACK_URL) :
    false;
  const googleCallback = req.headers.referer ?
    req.headers.referer.includes(process.env.GOOGLE_CALLBACK_URL) :
    false;

  if (!facebookCallback && !googleCallback) {
    try {
      const { user } = await jwt.verify(token, process.env.SECRET);
      req.user = user;
      req.token = token;
    } catch (e) {
      if (e.name !== 'TokenExpiredError') {
        throw new Error('Invalid Token.');
      } else {
        const { user } = await jwt.decode(token);
        req.user = user;
      }
    }
  }

  req.next();
};
