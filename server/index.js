const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require('./routes/auth')
const eventRoute = require('./routes/events.routes')
const bookingRoute = require('./routes/booking.routes')

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//routes
app.use('/api/auth', authRoute)
app.use('/api/events',eventRoute)
app.use('/api/bookings',bookingRoute)








async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("db is connected");
    } catch (err) {
        console.log("db connection error", err);
    }
}

connectDb();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("server is running on port", PORT);
});