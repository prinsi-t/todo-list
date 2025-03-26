import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);
export default Todo;
