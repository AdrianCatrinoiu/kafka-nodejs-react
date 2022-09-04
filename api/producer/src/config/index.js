exports.server = {
  port: process.env.SERVER_PORT,
};

exports.cors = {
  origin: process.env.WEB_CLIENT_DOMAIN,
  credentials: true,
};

exports.crypt = {
  saltRounds: 10,
};

exports.jwt = {
  accessToken: {
    secret: process.env.ACCESS_TOKEN_SECRET,
    options: {
      algorithm: "HS256",
      expiresIn: 30,
      issuer: "api.js-test.com",
    },
  },
  refreshToken: {
    secret: process.env.REFRESH_TOKEN_SECRET,
    options: {
      algorithm: "HS256",
      expiresIn: 300,
      issuer: "api.js-test.com",
    },
  },
};
