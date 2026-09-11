const express = require('express')
const router = express.Router()

const {protect,admin} = require('../middlewares/authMiddleware')
const {bookEvent,verifyBookingOTP,getMyBookings,getAllBookings,confirmBooking,cancelBooking,adminCancelBooking} = require('../controllers/bookingController')



router.post('/',protect,bookEvent)
router.post('/send-otp',protect, verifyBookingOTP)
router.get('/my',protect,getMyBookings)
router.get('/all', protect, admin, getAllBookings);
router.put('/:id/confirm',protect,admin,confirmBooking)
router.delete('/:id',protect,cancelBooking)
router.put(
    "/:id/admin-cancel",
    protect,
    admin,
    adminCancelBooking
);

module.exports = router