const bcrypt = require ('bcrypt');

const config = require('../config');

exports.hashPassword = (password) => {
    return bcrypt.hash(password, config.crypt.saltRounds)
}

exports.comparePassword = (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}