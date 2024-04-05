import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, (req, res) => {
  console.log(`Server running on PORT http://localhost:${PORT}`);
});
