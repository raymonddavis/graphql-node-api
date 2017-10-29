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
    lastTrip: String
    lastActive: String
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
    lastTrip: String
    lastActive: String
    createdAt: String
    updatedAt: String
    boards: [Board!]!
    suggestions: [Suggestion!]!
  }

  type Login {
    token: String!
    user: User!
  }
`;

export const queries = `
  me: User
  user(id: Int!): User
  users(limit: Int, offset: Int): [User!]
  userBoards(owner: Int!): [Board!]!
  userSuggestions(creatorId: Int!): [Suggestion!]!
`;

export const mutations = `
  register(firstName: String!, lastName: String!, email: String!, password: String!): User
  login(email: String!, password: String!): Login!
  refreshToken: String!
  updateUser(id: Int!, input: UserInput): Int!
  deleteUser(id: Int!): Int!
`;

export const subscriptions = `
  userCreated: User!
  userUpdated: User!
  userDeleted: User!
`;
