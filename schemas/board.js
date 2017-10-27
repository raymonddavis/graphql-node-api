export const inputs = `
  type Board {
    id: Int!
    name: String!
    suggestions: [Suggestion!]!
    owner: Int!
  }
`;

export const mutations = `
  createBoard(owner: Int!, name: String!): Board!
`;
