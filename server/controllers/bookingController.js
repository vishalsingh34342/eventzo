const Booking = require('../models/booking.model')
const OTP = require('../models/OTP')
const Event = require('../models/event.model')
const {sendOtpEmail, sendBookingEmail} = require('../utils/email.utils')


const generateOTP = ()=>{
    return Math.floor(100000 + Math.random()* 900000).toString()
}

exports.verifyBookingOTP = async(req,res)=>{
const otp = generateOTP();
await OTP.findOneAndDelete({email: req.user.email, action : "event_booking"})
await OTP.create({email: req.user.email, otp: otp, action: 'event_booking'})
await sendOtpEmail(req.user.email,otp, 'event_booking')
res.json({message: 'OTP sent to email'})

}
exports.bookEvent = async (req, res) => {
    try {
        // Admin cannot book events
        if (req.user.role === "admin") {
            return res.status(403).json({
                error: "Admin cannot book events"
            });
        }

        const { eventId, otp } = req.body;

        const otpRecord = await OTP.findOne({
            email: req.user.email,
            otp,
            action: "event_booking"
        });

        if (!otpRecord) {
            return res.status(400).json({
                error: "Invalid or expired OTP"
            });
        }

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                error: "No seats available"
            });
        }

        const existingBooking = await Booking.findOne({
            user: req.user._id,
            eventId
        });

        if (existingBooking) {
            return res.status(400).json({
                error: "You have already booked this event"
            });
        }

        const booking = await Booking.create({
            user: req.user._id,
            eventId,
            status: "pending",
            paymentStatus: "non_paid",
            amount: event.ticketPrice
        });

        await OTP.deleteMany({
            email: req.user.email,
            action: "event_booking"
        });

        

        res.status(201).json({
            message:
                "Booking request submitted. Waiting for admin confirmation.",
            bookingId: booking._id
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
};
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("eventId", "title date location");

        res.status(200).json(bookings);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


exports.confirmBooking = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        if (!["paid", "non_paid"].includes(paymentStatus)) {
            return res.status(400).json({
                error: "Invalid payment status"
            });
        }

        const booking = await Booking.findById(req.params.id)
            .populate("eventId")
            .populate("user", "name email");

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        if (booking.status === "confirmed") {
            return res.status(400).json({
                error: "Booking is already confirmed"
            });
        }

        const event = booking.eventId;

        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                error: "No seats are available"
            });
        }

        booking.status = "confirmed";
        booking.paymentStatus = paymentStatus;

        await booking.save();

        event.availableSeats -= 1;
        await event.save();

        await sendBookingEmail(
            booking.user.email,
            booking.user.name,
            event.title
        );

        res.status(200).json({
            message: "Booking is confirmed",
            booking
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getMyBookings = async(req,res)=> {
    const booking = await Booking.find({user: req.user._id}).populate('eventId')
    res.json(booking)
}

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: "Unauthorized"
            });
        }

        if (booking.status === "confirmed") {
            const event = await Event.findById(booking.eventId._id);

            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.json({
            message: "Booking cancelled"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

exports.adminCancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("eventId");

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                error: "Booking is already cancelled"
            });
        }

        // Sirf confirmed booking ki seat wapas karo
        if (booking.status === "confirmed") {
            const event = booking.eventId;

            if (event) {
                event.availableSeats += 1;
                await event.save();
            }
        }

        booking.status = "cancelled";

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled by admin",
            booking
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};