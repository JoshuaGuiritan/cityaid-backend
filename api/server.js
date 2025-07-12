import express from "express";
import post from "./routes/post.js";
import error from "./middleware/error.js";
import logger from "./middleware/logger.js";
import notFound from "./middleware/notFound.js";
import cors from "cors";
import { createServer } from "@vercel/node";

const app = express();
const port = process.env.PORT || 9000;

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(logger);

app.use("/api", post);

app.use(error);
app.use(notFound);

export default createServer(app);


