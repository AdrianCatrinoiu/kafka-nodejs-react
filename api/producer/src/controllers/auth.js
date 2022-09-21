const cryptService = require("../services/cryptService");
const jwt = require("jsonwebtoken");
const kafka = require("kafka-node");
const redisClient = require("../db/db");
const { v4: uuidv4 } = require("uuid");

const kafkaClientOptions = { sessionTimeout: 100, spinDelay: 100, retries: 2 };
const kafkaClient = new kafka.KafkaClient(
  process.env.KAFKA_ZOOKEEPER_CONNECT,
  "producer-client",
  kafkaClientOptions
);
const kafkaProducer = new kafka.Producer(kafkaClient);

kafkaClient.on("error", (error) => console.error("Kafka client error:", error));
kafkaProducer.on("error", (error) =>
  console.error("Kafka producer error:", error)
);

exports.register = async (req, res) => {
  try {
    const userData = req.body;

    const hashedPassword = await cryptService.hashPassword(userData.password);
    const userDataHashedPassword = {
      id: uuidv4(),
      name: userData.name,
      email: userData.email,
      hashedPassword: hashedPassword,
    };

    kafkaProducer.send(
      [
        {
          topic: "users",
          messages: { type: "register", data: userDataHashedPassword },
        },
      ],
      function (error, result) {
        console.info("Sent payload to Kafka:", userData);

        if (error) {
          console.error("Sending payload failed:", error);
          res.status(500).json(error);
        } else {
          console.log("Sending payload result:", result);
          res.status(202).json(result);
        }
      }
    );

    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: newUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE_SECONDS) }
    );
    const newRefreshToken = jwt.sign(
      { email: newUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_SECONDS) }
    );
    // Saving refreshToken with current user
    newUser.refreshToken = [newRefreshToken];
    const result = await newUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 48 * 60 * 60 * 1000,
    });

    res.json({ accessToken, name: newUser.name, id: newUser.id });
  } catch (e) {
    console.error(e);

    res.sendStatus(500);
  }
};

exports.login = async (req, res) => {
  const cookies = req.cookies;

  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Email and password are required." });

  const usersList = JSON.parse(await redisClient.get("users"));
  const foundUserIndex = usersList.findIndex((x) => x.email === email);
  const foundUser = usersList[foundUserIndex];

  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await cryptService.comparePassword(
    password,
    foundUser.hashedPassword
  );
  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE_SECONDS) }
    );
    const newRefreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_SECONDS) }
    );

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /*
          Scenario added here:
              1) User logs in but never uses RT and does not logout
              2) RT is stolen
              3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
          */
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    // Saving refreshToken with current user
    usersList[foundUserIndex] = {
      ...foundUser,
      refreshToken: [...newRefreshTokenArray, newRefreshToken],
    };

    redisClient.set("users", JSON.stringify(usersList));

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 48 * 60 * 60 * 1000,
    });
    // Send access token to user
    res.json({ accessToken, name: foundUser.name, id: foundUser.id });
  } else {
    res.sendStatus(401);
  }
};

exports.logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const usersList = JSON.parse(await redisClient.get("users"));
  const foundUserIndex = usersList.findIndex(
    (x) => x.refreshToken === refreshToken
  );
  const foundUser = usersList[foundUserIndex];

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  usersList[foundUserIndex] = {
    ...foundUser,
    refreshToken: [],
  };

  redisClient.set("users", JSON.stringify(usersList));

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

exports.refreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const usersList = JSON.parse(await redisClient.get("users"));
  const foundUserIndex = usersList.findIndex(
    (x) => x.refreshToken === refreshToken
  );
  const foundUser = usersList[foundUserIndex];

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403); //Forbidden
        // Delete refresh tokens of hacked user
        const usersList = JSON.parse(await redisClient.get("users"));
        const foundUserIndex = usersList.findIndex(
          (x) => x.email === decoded.email
        );
        const foundUser = usersList[foundUserIndex];
        usersList[foundUserIndex] = {
          ...foundUser,
          refreshToken: [],
        };
        redisClient.set("users", JSON.stringify(usersList));
      }
    );
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        // expired refresh token
        usersList[foundUserIndex] = {
          ...foundUser,
          refreshToken: [...newRefreshTokenArray],
        };
        redisClient.set("users", JSON.stringify(usersList));
      }

      if (err || foundUser.email !== decoded.email) return res.sendStatus(403);

      // Refresh token was still valid
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRE_SECONDS) }
      );

      const newRefreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRE_SECONDS) }
      );
      // Saving refreshToken with current user
      usersList[foundUserIndex] = {
        ...foundUser,
        refreshToken: [...newRefreshTokenArray, newRefreshToken],
      };
      redisClient.set("users", JSON.stringify(usersList));

      // Creates Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 48 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    }
  );
};
