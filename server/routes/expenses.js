import express from 'express';
import Expense from '../models/Expense.js';

const router = express.Router();

// adding new expenses into database
router.post('/', async (req, res) => {
  const { name, amount, category, date } = req.body;

  const newExpense = new Expense({
    name,
    amount,
    category,
    date
  });

  try {
    await newExpense.save();
    res.status(201).json({ message: 'Expense added successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding expense', error });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, amount, category, date } = req.body;

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(id, { name, amount, category, date }, { new: true });

    if (!updatedExpense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense updated successfully!', expense: updatedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating expense', error });
  }
});

// stored procedure and prepared statement
// finds all items that match the category searched and returns statistics about it
router.post('/statistics', async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const stats = await Expense.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } }
          ]
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          averageAmount: { $avg: "$amount" },
          expenseCount: { $sum: 1 }
        }
      }
    ]);


    if (stats.length > 0) {
      res.json({
        totalAmount: stats[0].totalAmount,
        averageAmount: stats[0].averageAmount,
        expenseCount: stats[0].expenseCount
      });
    } else {
      res.json({ 
        totalAmount: 0,
        averageAmount: 0,
        expenseCount: 0,
        message: 'No expenses found matching the search criteria.' 
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving statistics' });
  }
});

export default router;