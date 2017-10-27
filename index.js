import {} from 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import cors from 'cors';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import DataLoader from 'dataloader';
import _ from 'lodash';
import passport from 'passport';

import { addUser, generateToken, cleanUser } from './token';

import facebookStrategy from './passports/facebook';
import googleStrategy from './passports/google';

import typeDefs from './schemas';
import resolvers from './resolvers';
import models from './models';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const PORT = 3000;

const app = express();

passport.use(facebookStrategy(models));
passport.use(googleStrategy(models));

app.use(passport.initialize());

const socialResponse = (req, res) => res.send({
  token: generateToken(req.user),
  user: cleanUser(req.user),
});

const socialConfig = {
  session: false,
  // successRedirect: '/profile',
  failureRedirect: '/login',
};

// Facebook
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', socialConfig), socialResponse);

// Google
app.get('/auth/google', passport.authenticate('google', { scope: ['email'] }));
app.get('/auth/google/callback', passport.authenticate('google', socialConfig), socialResponse);

app.use(cors('*'));
app.use(addUser);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
  }),
);

const batchSuggestions = async (keys, { Suggestion }) => {
  const suggestions = await Suggestion.findAll({
    raw: true,
    where: {
      boardId: {
        $in: keys,
      },
    },
  });

  const gs = _.groupBy(suggestions, 'boardId');

  return keys.map(k => gs[k] || []);
};

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user,
      token: req.token,
      suggestionLoader: new DataLoader(keys => batchSuggestions(keys, models)),
    },
  })),
);

const server = createServer(app);

const subscriptionServer = new SubscriptionServer({
  execute,
  subscribe,
  schema,
}, {
  server,
  path: '/subscriptions',
});

// {force: true} in sync() will drop tables
models.sequelize.sync().then(() => {
  server.listen(PORT, () => subscriptionServer);
});
