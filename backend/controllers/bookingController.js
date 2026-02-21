import Booking from '../models/Booking.js';
import User from '../models/User.js';

/**
 * @desc Create Hire Request
 */
export const createBooking = async (req, res) => {
  try {
    const { proId } = req.body;
    const clientId = req.user.id;

    const targetPro = await User.findById(proId);
    if (!targetPro) return res.status(404).json({ message: "Professional not found" });

    const proSkills = targetPro.skills || [];

    // Prevent duplicate pending request for same skill
    const existingSkillRequest = await Booking.findOne({
      client: clientId,
      status: 'pending'
    }).populate('professional');

    if (
      existingSkillRequest &&
      existingSkillRequest.professional?.skills &&
      existingSkillRequest.professional.skills.some(skill => proSkills.includes(skill))
    ) {
      await Booking.findByIdAndDelete(existingSkillRequest._id);
    }

    // Daily limit (max 3 requests per day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const dailyCount = await Booking.countDocuments({
      professional: proId,
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    if (dailyCount >= 3) {
      return res.status(400).json({
        message: "This professional reached daily limit. Please choose another."
      });
    }

    const newBooking = new Booking({
      client: clientId,
      professional: proId
    });

    await newBooking.save();
    res.json({ success: true, message: "Hire request sent!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * @desc Get bookings (client or pro)
 */
export const getMyBookings = async (req, res) => {
  try {
    const query =
      req.user.role === 'pro'
        ? { professional: req.user.id }
        : { client: req.user.id };

    const bookings = await Booking.find(query)
      .populate('client', 'name email phone location')
      .populate('professional', 'name email phone location skills rating reviewCount')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('GetMyBookings Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc Update booking status (pro approves or rejects)
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    await Booking.findByIdAndUpdate(bookingId, { status });
    res.json({ success: true, message: `Job ${status}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

/**
 * @desc Submit rating (customer rates job)
 */
export const submitRating = async (req, res) => {
  try {
    const { bookingId, ratingValue } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { rating: ratingValue },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Recalculate professional average rating
    const allRated = await Booking.find({
      professional: booking.professional,
      rating: { $ne: null }
    });

    const total = allRated.reduce((sum, item) => sum + item.rating, 0);
    const average = allRated.length ? (total / allRated.length).toFixed(1) : 0;

    await User.findByIdAndUpdate(booking.professional, {
      rating: parseFloat(average),
      reviewCount: allRated.length
    });

    res.json({
      success: true,
      message: "Rating submitted",
      newAverage: average
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};