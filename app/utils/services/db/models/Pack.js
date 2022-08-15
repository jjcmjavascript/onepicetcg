module.exports = (db, DataTypes) => {
    return db.define('packs', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            comment: 'Nombre del pack'
        },
        fecha_lanzamiento: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Año del pack'
        },
    }, {

    });
}; 