const mongoose = require("mongoose");

module.exports = () => {
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // monogodb connection
  try {
    mongoose
      .connect(process.env.DB, connectionParams)
      .then((res) => console.log("Connected to MongoDB"))
      .catch((err) => console.log(err));
  } catch (error) {}
};
