const path = require("path"),
    express = require("express"),
    mongoose = require("mongoose"),
    multer = require("multer"),
    feedRoutes = require("./routes/feedRoutes"),
    authRoutes = require("./routes/authRoutes");

const app = express();

const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "images");
        },
        filename: (req, file, cb) => {
            cb(null, new Date().toISOString() + "-" + file.originalname);
        },
    }),
    fileFilter = (req, file, cb) => {
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };

app.use(express.json());
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );
    next();
});

app.use("/api/feed", feedRoutes);
app.use("/api/auth" , authRoutes);

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

mongoose
    .set("strictQuery", false)
    .connect("mongodb://127.0.0.1:27017/feeds")
    .then((result) => {
        const server = app.listen(3000);
        const io = require('./socket.js').init(server);
        io.on('connection' , socket =>{
            console.log('New client connected');
            socket.on('disconnect' , () =>{
                console.log('Client disconnected');
            });
        });
        console.log("Connected to DB - Listening on port : 3000");
    })
    .catch((err) => console.log(err));