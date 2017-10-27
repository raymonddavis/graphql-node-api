export default {
  Suggestion: {
    creator: ({ creatorId }, args, { models }) => models.User.findOne({
      where: {
        id: creatorId,
      },
    }),
  },
  Mutation: {
    createSuggestion: (parent, args, { models }) => models.Suggestion.create(args),
  },
};
