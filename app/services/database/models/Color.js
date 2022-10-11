module.exports = (db, DataTypes)=>{
    let color = db.define('colors',{
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
    
    return color;
}; 