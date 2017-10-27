export const inputs = `
  input UserInput {
    firstName: String
    lastName: String
    email: String
    birthDate: Int
    location: String
    phoneNumber: String
    photos: String
    isAdmin: Boolean
    lastTrip: Int
    lastActive: Int
  }
`;

export const types = `
  type User {
    id: Int!
    firstName: String
    lastName: String
    email: String
    birthDate: Int
    location: String
    phoneNumber: String
    photos: String
    isAdmin: Boolean
    lastTrip: Int
    lastActive: Int
    createdAt: Int
    updatedAt: Int
    boards: [Board!]!
    suggestions: [Suggestion!]!
  }
`;

export const queries = `
  me: User
  allUsers: [User!]
  getUser(id: Int!): User
  userBoards(owner: Int!): [Board!]!
  userSuggestions(creatorId: Int!): [Suggestion!]!
`;

export const mutations = `
  register(firstName: String!, lastName: String!, email: String!, password: String!): User
  login(email: String!, password: String!): String
  refreshToken: String!
  createUser(username: String!): User!
  updateUser(id: Int!, data: UserInput): Int!
  deleteUser(id: Int!): Int!
`;

export const subscriptions = `
  userAdded: User!
`;
