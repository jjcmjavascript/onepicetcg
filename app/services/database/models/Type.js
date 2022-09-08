module.exports = (db, DataTypes) => {

    return db.define('types', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            comment: 'Nombre del tipo de carta'
        },
    }, {

    });
};