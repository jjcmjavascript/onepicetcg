module.exports = (db, DataTypes) => {
  return db.define('pivot_cards_categories', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
      },
      card_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Id de la carta',
          references: {
              model: 'cards',
              key: 'id'
          }
      },
      category_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Id de la categoria de la carta',
          references: {
              model: 'categories',
              key: 'id'
          }
      }
  },{
      timestamps: false,
  });
};