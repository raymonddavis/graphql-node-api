import User from './user';
import Board from './board';
import Suggestion from './suggestion';

const files = [
  User,
  Board,
  Suggestion,
];
const resolvers = {};

files.forEach((file) => {
  Object.keys(file).forEach((type) => {
    if (resolvers[type]) {
      resolvers[type] = Object.assign({}, resolvers[type], file[type]);
    } else {
      resolvers[type] = file[type];
    }
  });
});

export default resolvers;
