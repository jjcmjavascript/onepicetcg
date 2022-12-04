module.exports = (db, DataTypes) => {
  return db.define('categories', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      name: {
          type: DataTypes.STRING,
          allowNull: false
      }
  },{
      modelName: 'categories',
  })
};