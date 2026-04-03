import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  id: String,
  question: String,
  options: [String],
  correctAnswer: String,
  marks: { type: Number, default: 1 }
});

const ExamSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: Number,
  questions: [QuestionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Exam || mongoose.model('Exam', ExamSchema);
