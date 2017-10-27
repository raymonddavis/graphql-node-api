export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
    fbKey: {
      type: DataTypes.STRING,
      unique: true,
    },
    googleKey: {
      type: DataTypes.STRING,
      unique: true,
    },
    birthDate: DataTypes.DATE,
    location: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    photos: DataTypes.ARRAY(DataTypes.STRING),
    isAdmin: DataTypes.BOOLEAN,
    lastTrip: DataTypes.DATE,
    lastActive: DataTypes.DATE,
  }, {
    timestamps: true,
    paranoid: true,
  });

  User.associate = (models) => {
    // 1 to maney with board
    User.hasMany(models.Board, {
      foreignKey: 'owner',
    });
    // 1 to maney with suggestion
    User.hasMany(models.Suggestion, {
      foreignKey: 'creatorId',
    });
  };

  return User;
};
