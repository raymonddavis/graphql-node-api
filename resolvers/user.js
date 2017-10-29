import bcrypt from 'bcrypt';
import { PubSub } from 'graphql-subscriptions';
import { requiresAuth } from '../permissions';
import { generateToken } from '../token';

export const pubsub = new PubSub();

const USER_CREATED = 'USER_CREATED';
const USER_UPDATED = 'USER_UPDATED';
const USER_DELETED = 'USER_DELETED';

export default {
  Subscription: {
    userCreated: {
      subscribe: requiresAuth.createResolver(() => pubsub.asyncIterator(USER_CREATED)),
    },
    userUpdated: {
      subscribe: requiresAuth.createResolver(() => pubsub.asyncIterator(USER_UPDATED)),
    },
    userDeleted: {
      subscribe: requiresAuth.createResolver(() => pubsub.asyncIterator(USER_DELETED)),
    },
  },
  User: {
    boards: ({ id }, args, { models }) => models.Board.findAll({
      where: {
        owner: id,
      },
    }),
    suggestions: ({ id }, args, { models }) => models.Suggestion.findAll({
      where: {
        creatorId: id,
      },
    }),
  },
  Query: {
    // allUsers: requiresAuth.createResolver((parent, args, { models }) => models.User.findAll()),
    me: (parent, args, { models, user }) => {
      if (user) {
        return models.User.findOne({ where: { id: user.id } });
      }

      return null;
    },
    user: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    users: (parent, args, { models }) => models.User.findAll(args),
    userBoards: (parent, { owner }, { models }) => models.Board.findAll({ where: { owner } }),
    userSuggestions: (parent, { creatorId }, { models }) => models.Suggestion.findAll({
      where: { creatorId },
    }),
  },
  Mutation: {
    register: async (parent, args, { models }) => {
      let user = args;

      const userCheck = await models.User.findOne({ where: { email: user.email } });

      if (userCheck) {
        if (userCheck.fbKey || userCheck.googleKey) {
          throw new Error('This email has been used with a Social SignIn.');
        } else {
          throw new Error('This email is already being used.');
        }
      }

      user.password = await bcrypt.hash(user.password, 12);
      user = await models.User.create(user);

      pubsub.publish(USER_CREATED, { user });

      return user;
    },
    login: async (parent, { email, password }, { models }) => {
      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('No user with that email was found.');
      }

      if (!user.password) {
        throw new Error('No password set. Use Social Signin.');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect Password');
      }

      return {
        token: generateToken(user),
        user,
      };
    },
    refreshToken: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      const validUser = await models.User.findOne({ where: { id: user.id } });
      return generateToken(validUser);
    }),
    updateUser: requiresAuth.createResolver(async (parent, args, { models }) => {
      const { id, input } = args;
      const user = await models.User.update(input, { where: { id } });

      pubsub.publish(USER_UPDATED, { user });

      return user;
    }),
    deleteUser: requiresAuth.createResolver(async (parent, args, { models }) => {
      const user = await models.User.destroy({ where: args });

      pubsub.publish(USER_DELETED, { user });

      return user;
    }),
  },
};
