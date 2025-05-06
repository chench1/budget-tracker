import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  // try {
  //   const expenses = await Expense.find({});
  //   res.json({expenses});
  // } catch (err) {
  //   res.status(500).json({ message: 'Error fetching expenses' });
  // }
});

export default router;