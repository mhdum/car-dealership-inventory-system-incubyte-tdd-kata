import app from "./app.js";
import connectDB from "./common/config/db.js";
import "dotenv/config.js";

const startServer = async () => {
  const port = process.env.PORT || 5000;
  connectDB();
  app.listen(port, () => {
    console.log(`Server is listening on ${port}`);
  });
};

try {
  startServer();
} catch (error) {
  console.error(error);
}
