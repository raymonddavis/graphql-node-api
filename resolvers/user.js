import bcrypt from 'bcrypt';
import { PubSub } from 'graphql-subscriptions';
import { requiresAuth } from '../permissions';
import { generateToken, cleanUser } from '../token';

export const pubsub = new PubSub();

const USER_ADDED = 'USER_ADDED';

export default {
  Subscription: {
    userAdded: {
      subscribe: () => pubsub.asyncIterator(USER_ADDED),
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
    allUsers: requiresAuth.createResolver((parent, args, { models }) => models.User.findAll()),
    me: (parent, args, { models, user }) => {
      if (user) {
        return models.User.findOne({ where: { id: user.id } });
      }

      return null;
    },
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    userBoards: (parent, { owner }, { models }) => models.Board.findAll({ where: { owner } }),
    userSuggestions: (parent, { creatorId }, { models }) => models.Suggestion.findAll({ where: { creatorId } }),
  },
  Mutation: {
    register: async (parent, args, { models }) => {
      const user = args;
      user.password = await bcrypt.hash(user.password, 12);
      return models.User.create(user);
    },
    login: async (parent, { email, password }, { models }) => {
      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        throw new Error('No user with that email was found.');
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Incorrect Password');
      }

      return {
        token: generateToken(user),
        user: cleanUser(user),
      };
    },
    refreshToken: async (parent, args, { models, user }) => {
      const validUser = await models.User.findOne({ where: { id: user.id } });
      return generateToken(validUser);
    },
    updateUser: async (parent, args, { models }) => {
      const { id, data } = args;
      return models.User.update(data, { where: { id } });
    },
    deleteUser: (parent, args, { models }) => models.User.destroy({ where: args }),
    // Start Subscription Example Endpoint
    createUser: async (parent, args, { models }) => {
      const user = args;
      user.password = 'pubsubdemo';
      const userAdded = await models.User.create(user);
      pubsub.publish(USER_ADDED, {
        userAdded,
      });

      return userAdded;
    },
    // End Subscription Example Endpoint
  },
};
