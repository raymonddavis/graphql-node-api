const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

export default function googleStrategy(models) {
  return new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      profileFields: ['id', 'name', 'emails', 'birthday'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      const {
        id,
        emails,
        birthday: birthDate,
        name: {
          familyName: lastName,
          givenName: firstName,
        },
      } = profile;
      const email = emails ? emails[0].value : '';
      const googleUser = await models.User.findOne({ where: { googleKey: id } });

      if (!googleUser) {
        const user = await models.User.findOne({ where: { email } });

        if (user) {
          await models.User.update({ googleKey: id }, {
            where: {
              email,
            },
          });
        } else {
          await models.User.create({
            googleKey: id,
            firstName,
            lastName,
            birthDate: birthDate || null,
            email,
          });
        }
      }

      const user = await models.User.findOne({ where: { googleKey: id } });

      return cb(null, user);
    },
  );
}
