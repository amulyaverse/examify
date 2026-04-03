import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  obtainedScore: Number,
  totalScore: Number,
  correctAnswers: Number,
  wrongAnswers: Number,
  percentage: Number,
  answers: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
