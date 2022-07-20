import express,{json} from "express";
import cors from "cors";
import dotenv from "dotenv"

import router from "./routes/indexRouter.js";

const app = express();
dotenv.config();
app.use([cors(), json(), router]);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log("servidor em pé na porta ", process.env.PORT)
})