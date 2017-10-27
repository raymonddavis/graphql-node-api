const createResolver = (resolver) => {
  const basResolver = resolver;
  basResolver.createResolver = (childResolver) => {
    const newResolver = async (parent, args, context) => {
      await resolver(parent, args, context);
      return childResolver(parent, args, context);
    };
    return createResolver(newResolver);
  };
  return basResolver;
};

export const requiresToken = createResolver((parent, args, { token }) => {
  if (!token) {
    throw new Error('Token Expired!');
  }
});

export const requiresAuth = requiresToken.createResolver((parent, args, { user }) => {
  if (!user) {
    throw new Error('Not Authenticated!');
  }
});
