import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { testAi } from "./src/services/ai.service.js";
testAi();

connectDB();


app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
