const avro = require("avsc");

const avroSchema = {
  name: "UserType",
  type: "record",
  fields: [
    {
      name: "name",
      type: "string",
    },
    {
      name: "email",
      type: "string",
    },
    {
      name: "hashedPassword",
      type: "string",
    },
  ],
};

const type = avro.parse(avroSchema);

module.exports = type;
