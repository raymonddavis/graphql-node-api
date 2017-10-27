export const inputs = `
  type Board {
    id: Int!
    name: String!
    suggestions: [Suggestion!]!
    owner: User!
  }
`;

export const mutations = `
  createBoard(owner: Int!, name: String!): Board!
`;
