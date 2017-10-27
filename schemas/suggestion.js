export const types = `
  type Suggestion {
    id: Int!
    text: String!
    creator: User!
  }
`;

export const mutations = `
  createSuggestion(creatorId: Int!, text: String!, boardId: Int!): Suggestion!
`;
