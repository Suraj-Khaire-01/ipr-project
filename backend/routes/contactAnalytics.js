import express from "express";
import Contact from "../models/contactModel.js"; // adjust path to your model

const router = express.Router();

// Get contact analytics overview
router.get("/overview", async (req, res) => {
  try {
    const total = await Contact.countDocuments({});
    const pending = await Contact.countDocuments({ status: "pending" });
    const responded = await Contact.countDocuments({
      status: { $in: ["responded", "closed"] }
    });

    // Avg response time (hours)
    const responseTimes = await Contact.aggregate([
      {
        $match: {
          respondedAt: { $ne: null }
        }
      },
      {
        $project: {
          diffInHours: {
            $divide: [
              { $subtract: ["$respondedAt", "$submittedAt"] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTime: { $avg: "$diffInHours" }
        }
      }
    ]);

    res.json({
      total,
      pending,
      responded,
      avgResponseTime: responseTimes[0]?.avgResponseTime.toFixed(2) + "h" || "--"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Requests over time
router.get("/over-time", async (req, res) => {
  try {
    const result = await Contact.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Requests by status
router.get("/status", async (req, res) => {
  try {
    const result = await Contact.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Requests by service type
router.get("/service-type", async (req, res) => {
  try {
    const result = await Contact.aggregate([
      { $group: { _id: "$serviceType", count: { $sum: 1 } } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
