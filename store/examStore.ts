import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Answer {
  questionId: string;
  answer: string;
  isMarkedForReview: boolean;
  timeSpent: number;
}

interface ExamState {
  // State
  examId: string | null;
  currentQuestionIndex: number;
  answers: Answer[];
  remainingTime: number;
  isSubmitted: boolean;
  startTime: number | null;
  
  // Actions
  setExamId: (id: string) => void;
  setCurrentQuestion: (index: number) => void;
  setAnswer: (questionId: string, answer: string) => void;
  toggleMarkForReview: (questionId: string) => void;
  updateTimeSpent: (questionId: string, seconds: number) => void;
  setRemainingTime: (time: number) => void;
  setStartTime: () => void;
  submitExam: () => void;
  resetExam: () => void;
  getAnsweredCount: () => number;
  getMarkedCount: () => number;
  getNotAnsweredCount: (totalQuestions: number) => number;
}

export const useExamStore = create<ExamState>()(
  persist(
    (set, get) => ({
      // Initial state
      examId: null,
      currentQuestionIndex: 0,
      answers: [],
      remainingTime: 0,
      isSubmitted: false,
      startTime: null,

      // Actions
      setExamId: (id) => set({ examId: id }),
      
      setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
      
      setAnswer: (questionId, answer) => {
        const { answers } = get();
        const existingIndex = answers.findIndex(a => a.questionId === questionId);
        
        if (existingIndex >= 0) {
          const updatedAnswers = [...answers];
          updatedAnswers[existingIndex] = { ...updatedAnswers[existingIndex], answer };
          set({ answers: updatedAnswers });
        } else {
          set({
            answers: [
              ...answers,
              { questionId, answer, isMarkedForReview: false, timeSpent: 0 }
            ]
          });
        }
      },
      
      toggleMarkForReview: (questionId) => {
        const { answers } = get();
        const existingIndex = answers.findIndex(a => a.questionId === questionId);
        
        if (existingIndex >= 0) {
          const updatedAnswers = [...answers];
          updatedAnswers[existingIndex] = {
            ...updatedAnswers[existingIndex],
            isMarkedForReview: !updatedAnswers[existingIndex].isMarkedForReview
          };
          set({ answers: updatedAnswers });
        } else {
          set({
            answers: [
              ...answers,
              { questionId, answer: '', isMarkedForReview: true, timeSpent: 0 }
            ]
          });
        }
      },
      
      updateTimeSpent: (questionId, seconds) => {
        const { answers } = get();
        const existingIndex = answers.findIndex(a => a.questionId === questionId);
        
        if (existingIndex >= 0) {
          const updatedAnswers = [...answers];
          updatedAnswers[existingIndex] = {
            ...updatedAnswers[existingIndex],
            timeSpent: updatedAnswers[existingIndex].timeSpent + seconds
          };
          set({ answers: updatedAnswers });
        }
      },
      
      setRemainingTime: (time) => set({ remainingTime: time }),
      
      setStartTime: () => set({ startTime: Date.now() }),
      
      submitExam: () => set({ isSubmitted: true }),
      
      resetExam: () => set({
        examId: null,
        currentQuestionIndex: 0,
        answers: [],
        remainingTime: 0,
        isSubmitted: false,
        startTime: null
      }),
      
      getAnsweredCount: () => {
        const { answers } = get();
        return answers.filter(a => a.answer && a.answer !== '').length;
      },
      
      getMarkedCount: () => {
        const { answers } = get();
        return answers.filter(a => a.isMarkedForReview).length;
      },
      
      getNotAnsweredCount: (totalQuestions) => {
        const { answers } = get();
        const answeredCount = answers.filter(a => a.answer && a.answer !== '').length;
        return totalQuestions - answeredCount;
      }
    }),
    {
      name: 'exam-storage',
      partialize: (state) => ({
        examId: state.examId,
        currentQuestionIndex: state.currentQuestionIndex,
        answers: state.answers,
        remainingTime: state.remainingTime,
        isSubmitted: state.isSubmitted
      })
    }
  )
);