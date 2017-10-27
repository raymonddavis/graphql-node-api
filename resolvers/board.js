export default {
  Board: {
    suggestions: ({ id }, args, { suggestionLoader }) => suggestionLoader.load(id),
  },
  Mutation: {
    createBoard: (parent, args, { models }) => models.Board.create(args),
  },
};
