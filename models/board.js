export default (sequelize, DataTypes) => {
  const Board = sequelize.define('board', {
    name: DataTypes.STRING,
  });

  Board.associate = (models) => {
    // 1 to maney to suggestion
    Board.hasMany(models.Suggestion, {
      foreignKey: 'boardId',
    });
  };

  return Board;
};
