import * as User from './user';
import * as Board from './board';
import * as Suggestion from './suggestion';

const inputs = [];
const types = [];
const queries = [];
const mutations = [];
const subscriptions = [];

const schemas = [
  User,
  Board,
  Suggestion,
];

schemas.forEach((s) => {
  inputs.push(s.inputs);
  types.push(s.types);
  queries.push(s.queries);
  mutations.push(s.mutations);
  subscriptions.push(s.subscriptions);
});

inputs.join('\n');
types.join('\n');
queries.join('\n');
mutations.join('\n');

export default `
  ${inputs}
  ${types}

  type Subscription {
    ${subscriptions}
  }

  type Query {
    ${queries}
  }

  type Mutation {
    ${mutations}
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`;
