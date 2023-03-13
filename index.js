const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const redis = require("redis");
const cors = require("cors");
let RedisStore = require("connect-redis")(session);

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, MONGO_DATABASE_NAME, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./configs/config')

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.enable("trust proxy");
app.use(cors({}));

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT,
});


app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: SESSION_SECRET,
        cookie: {
            secure: false,
            resave: false,
            saveUninitialized: false,
            httpOnly: true,
            maxAge: 30000,
        },
    })
);

const postRouter = require('./routes/post.route');
const userRouter = require('./routes/user.route')

//const MONGO_URL_TEMP = 'mongodb+srv://hoan:hoan18102000@cluster0.mfjrrb8.mongodb.net/girl-galleries?retryWrites=true&w=majority'//`mongodb://root:123456@mongo:27017/askany`;
console.log({ MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, MONGO_DATABASE_NAME, REDIS_URL, REDIS_PORT, SESSION_SECRET });
const MONGO_URL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/admin`;

const connectWithRetry = () => {
    mongoose.connect(MONGO_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        autoIndex: true, //make this also true
    })
        .then(() => console.log("connect db successed"))
        .catch((e) => { console.log(`connect db error: ${e}`), setTimeout(connectWithRetry, 10000); })

};

connectWithRetry();

app.get("/", (req, res) => {
    return res.status(200).json({
        env: 'production'
    })
})

app.get("/api/v1", (req, res) => {
    console.log("yeah it ran");
    res.send("<h2>Hi there1</h2>")
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`))