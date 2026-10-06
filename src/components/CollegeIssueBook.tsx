import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types/library';
import { ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface CollegeIssueBookProps {
  preselectedBook?: Book | null;
}

export const CollegeIssueBook: React.FC<CollegeIssueBookProps> = ({ preselectedBook }) => {
  const { books, students, issueBook } = useLibrary();

  const [selectedBookNo, setSelectedBookNo] = useState(preselectedBook?.bookNo || (books.find(b => b.availableCopies > 0)?.bookNo || ''));
  const [selectedRollNo, setSelectedRollNo] = useState(students[0]?.rollNo || '');
  const [loanDays, setLoanDays] = useState(14);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const availableBooks = books.filter((b) => b.availableCopies > 0);
  const chosenBook = books.find((b) => b.bookNo === selectedBookNo);
  const chosenStudent = students.find((s) => s.rollNo === selectedRollNo);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookNo || !selectedRollNo) return;

    const res = issueBook(selectedBookNo, selectedRollNo, loanDays);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => setFeedback(null), 4000);
    } else {
      setFeedback({ type: 'error', message: res.message });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const todayStr = '2026-10-06';
  const calculatedDueDate = new Date(todayStr);
  calculatedDueDate.setDate(calculatedDueDate.getDate() + loanDays);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Issue Book to Student</h1>
        <p className="text-xs text-slate-500">
          Select the book and registered student roll number to create a new borrowing record
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <form onSubmit={handleIssueSubmit} className="space-y-4">
          {/* 1. Book Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Book to Issue *
            </label>
            <select
              value={selectedBookNo}
              onChange={(e) => setSelectedBookNo(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:bg-white"
              required
            >
              {availableBooks.length === 0 ? (
                <option value="">No books currently available</option>
              ) : (
                availableBooks.map((b) => (
                  <option key={b.id} value={b.bookNo}>
                    [{b.bookNo}] {b.title} ({b.availableCopies} available)
                  </option>
                ))
              )}
            </select>
            {chosenBook && (
              <div className="text-[11px] text-slate-500 mt-1">
                Author: <strong className="text-slate-700">{chosenBook.author}</strong> · Shelf:{' '}
                <strong className="text-slate-700">{chosenBook.shelfNo}</strong>
              </div>
            )}
          </div>

          {/* 2. Student Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Student (Borrower) *
            </label>
            <select
              value={selectedRollNo}
              onChange={(e) => setSelectedRollNo(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:bg-white"
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.rollNo}>
                  {s.rollNo} · {s.name} ({s.branch}) · Borrowed: {s.issuedCount}/{s.maxLimit}
                </option>
              ))}
            </select>
            {chosenStudent && (
              <div className="text-[11px] text-slate-500 mt-1">
                Contact: <strong className="text-slate-700">{chosenStudent.contact}</strong> · Sem:{' '}
                <strong className="text-slate-700">{chosenStudent.semester}</strong>
              </div>
            )}
          </div>

          {/* 3. Loan Period */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Borrowing Duration (Days)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[7, 14, 21].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setLoanDays(days)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                    loanDays === days
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {days} Days {days === 14 && '(Standard)'}
                </button>
              ))}
            </div>
          </div>

          {/* Dates preview */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Issue Date (Today):</span>
              <span className="font-semibold text-slate-900">{todayStr}</span>
            </div>
            <div className="flex justify-between">
              <span>Return Due Date:</span>
              <span className="font-semibold text-indigo-700">
                {calculatedDueDate.toISOString().split('T')[0]}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Confirm & Issue Book</span>
          </button>
        </form>
      </div>
    </div>
  );
};
