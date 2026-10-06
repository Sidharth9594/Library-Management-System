import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import {
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Users,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';

interface CollegeDashboardProps {
  setActiveTab: (tab: string) => void;
  openAddBookModal: () => void;
}

export const CollegeDashboard: React.FC<CollegeDashboardProps> = ({ setActiveTab, openAddBookModal }) => {
  const { books, students, issues, currentRole, activeRollNo, returnBook } = useLibrary();

  const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
  const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
  const activeIssued = issues.filter((i) => i.status !== 'RETURNED');
  const overdueCount = issues.filter((i) => i.status === 'OVERDUE').length;

  const currentStudent = students.find((s) => s.rollNo === activeRollNo) || students[0];
  const myIssued = issues.filter((i) => i.rollNo === currentStudent?.rollNo && i.status !== 'RETURNED');

  return (
    <div className="space-y-6">
      {/* College Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 rounded-xl p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold block">
            Department of Library & Information Services
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
            {currentRole === 'LIBRARIAN' ? 'Librarian Administration Portal' : `Welcome, ${currentStudent?.name}`}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-xl">
            {currentRole === 'LIBRARIAN'
              ? 'Easily issue, return, track books, and manage student borrowing limits for your college lab project.'
              : `Branch: ${currentStudent?.branch} · Roll No: ${currentStudent?.rollNo} · Books Borrowed: ${myIssued.length}/${currentStudent?.maxLimit}`}
          </p>
        </div>

        {/* Quick Action button */}
        <div className="flex flex-wrap gap-2">
          {currentRole === 'LIBRARIAN' ? (
            <>
              <button
                onClick={() => setActiveTab('issue')}
                className="px-3.5 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Issue Book</span>
              </button>
              <button
                onClick={openAddBookModal}
                className="px-3.5 py-2 bg-indigo-800 text-white hover:bg-indigo-900 font-semibold text-xs rounded-lg transition-colors border border-indigo-500/50 flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Book</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setActiveTab('books')}
              className="px-3.5 py-2 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Library Catalog</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Simple Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Books</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-mono tabular-nums">
            {totalBooks}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across {books.length} unique book titles
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Available on Shelves</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-mono tabular-nums">
            {availableBooks}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Ready to be issued immediately
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Books Issued</span>
            <ArrowUpRight className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-mono tabular-nums">
            {activeIssued.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Currently with students
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overdue Books</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2 font-mono tabular-nums">
            {overdueCount}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Late fee applied (₹10/day)
          </div>
        </div>
      </div>

      {/* Main Section */}
      {currentRole === 'STUDENT' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              My Currently Issued Books ({myIssued.length})
            </h2>
            <button
              onClick={() => setActiveTab('books')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              Browse other books &rarr;
            </button>
          </div>

          {myIssued.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              You do not have any books issued at the moment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Book Code</th>
                    <th className="py-2.5 px-3">Book Title</th>
                    <th className="py-2.5 px-3">Issue Date</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Fine</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {myIssued.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 font-mono font-medium">{rec.bookNo}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{rec.bookTitle}</td>
                      <td className="py-2.5 px-3 text-slate-500">{rec.issueDate}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{rec.dueDate}</td>
                      <td className="py-2.5 px-3">
                        {rec.status === 'OVERDUE' ? (
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Overdue
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Issued
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-rose-600 font-mono">
                        {rec.fine > 0 ? `₹${rec.fine}` : '₹0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Recent Issued Books Circulation ({activeIssued.length} active)
            </h2>
            <button
              onClick={() => setActiveTab('records')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              View all issued records &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Book Title</th>
                  <th className="py-2.5 px-3">Issue Date</th>
                  <th className="py-2.5 px-3">Due Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {activeIssued.slice(0, 6).map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{rec.studentName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{rec.rollNo}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{rec.bookTitle}</td>
                    <td className="py-2.5 px-3 text-slate-500">{rec.issueDate}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{rec.dueDate}</td>
                    <td className="py-2.5 px-3">
                      {rec.status === 'OVERDUE' ? (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Overdue (Fine: ₹{rec.fine})
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Issued
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          const res = returnBook(rec.id);
                          alert(res.message);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
