export default {
  Board: {
    suggestions: ({ id }, args, { suggestionLoader }) => suggestionLoader.load(id),
    owner: ({ owner }, args, { models }) => models.User.findOne({ where: { id: owner } }),
  },
  Mutation: {
    createBoard: (parent, args, { models }) => models.Board.create(args),
  },
};
