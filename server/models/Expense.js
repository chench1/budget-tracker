import { mongoose } from 'mongoose';

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, required: true }
});

expenseSchema.index({name: 1});
expenseSchema.index({category: 1});
expenseSchema.index({date: -1});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;