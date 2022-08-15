module.exports = (db, DataTypes)=>{
    return db.define('colors',{
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            comment: 'Nombre del color',
            allowNull: false
        }
    }); 
}; 