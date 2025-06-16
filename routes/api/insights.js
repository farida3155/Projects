const express = require('express');
const router = express.Router();
const Adoption = require('../../models/AdoptionForm');     
const Pet = require('../../models/petSchema');                    

// GET insights data
router.get('/', async (req, res) => {
  try {
    const pendingRequestsCount = await Adoption.countDocuments();
    const petsOnBoardCount = await Pet.countDocuments({ upForAdoption: true });

    const requestsPerMonth = await Adoption.aggregate([
      {
        $group: {
          _id: { $substr: ["$submittedAt", 0, 7] }, // Group by year-month (YYYY-MM)
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

   
    res.json({
  newBoardings: 8,
  activeUsers: 37,
  totalRevenue: 1100,
  pendingRequests: pendingRequestsCount,
      petsOnBoard: petsOnBoardCount,
  adoptionTrends: [
    { date: '2025-06-01', count: 3 },
    { date: '2025-06-02', count: 7 },
    { date: '2025-06-03', count: 4 },
    { date: '2025-06-04', count: 6 }
  ]
});

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch insights" });
  }
});

module.exports = router;
