module.exports = (db, DataTypes) => {
  return db.define('effect_types', {
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
      modelName: 'effect_types',
  })
};