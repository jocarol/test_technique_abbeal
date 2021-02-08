const moment = require('moment');

const formatUserOuptut = (rawUser) => {
    return user = {
        id: rawUser.id,
        name: rawUser.login + " " + rawUser.name,
        email: rawUser.email,
        registeredAt: moment(rawUser.registeredAt).format("MMMM Do Y, h:mm:ss a"),
        gender: rawUser.gender,
    };
}

module.exports = formatUserOuptut;