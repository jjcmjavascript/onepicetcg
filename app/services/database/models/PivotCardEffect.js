module.exports = (db, DataTypes) => {
  return db.define('pivot_cards_effects', {
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
      effect_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: 'Id del effecto de la carta',
          references: {
              model: 'effects',
              key: 'id'
          }
      }
  },{
      timestamps: false,
  });
};