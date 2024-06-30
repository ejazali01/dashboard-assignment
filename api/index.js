import express from "express"
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDb from "./config/Db.js";

dotenv.config();
const app = express();

// mongodb connection 
connectDb();

//middlewares
app.use(morgan("dev"))
app.use(express.urlencoded({extended:false, limit :"20kb"}));
app.use(express.json())
app.use(cookieParser())

app.get('/', (_,res) => {
    res.json("Welcome to my Server")
})

// routes import 
import userRoute from './routes/user.route.js'

// routes
app.use("/api/auth", userRoute )

// routes
app.listen(process.env.PORT, () => {
    console.log(`server is listning on post : ${process.env.PORT || "8080"}`)
})

