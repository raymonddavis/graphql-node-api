# graphql-node-api

Permissions are setup so that you can not access the api without a valid JWT, but i only put this on one call atm and that is the me resolvers. The rest do not require you to be logged in.

## Graphiql
Once the server is running you can navigate to localhost:3000/graphiql.

## Setup
1. ``` yarn install ```
2. Create a `.env` file.
3. Template for `.env`
```
SECRET=
DB_HOST=
DB_NAME=
DB_USER=
DB_PASS=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
FACEBOOK_CALLBACK_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```
4. SECRET is for crypting your JWTs, the rest should explain themselves.

## Run
```
npm start
```
