module.exports = (sequelize, Sequelize) => {
    const Row = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
        },
        login: {
            type: Sequelize.STRING(32),
        },
        email: {
            type: Sequelize.STRING(32),
        },
        registeredAt: {
            type: Sequelize.DATE,
        },
        name: {
            type: Sequelize.STRING(32),
        },
        gender: {
            set(value) {
                if (value.toLowerCase() === 'male' || value.toLowerCase() === 'female')
                    this.setDataValue('gender', value.toLowerCase());
                else
                    this.setDataValue('gender', 'other');
            },
            type: Sequelize.ENUM(['female', 'male', 'other']),
        },
    },
        {
            timestamps: false,
        });


    return Row;
};