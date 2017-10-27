import FacebookStrategy from 'passport-facebook';

export default function facebookStrategy(models) {
  return new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
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
      const facebookUser = await models.User.findOne({ where: { fbKey: id } });

      if (!facebookUser) {
        const user = await models.User.findOne({ where: { email } });

        if (user) {
          await models.User.update({ fbKey: id }, {
            where: {
              email,
            },
          });
        } else {
          await models.User.create({
            fbKey: id,
            firstName,
            lastName,
            birthDate: birthDate || null,
            email,
          });
        }
      }

      const user = await models.User.findOne({ where: { fbKey: id } });

      cb(null, user);
    },
  );
}
