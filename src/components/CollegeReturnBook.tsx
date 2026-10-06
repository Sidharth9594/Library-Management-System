import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Search, CheckCircle2, AlertCircle, ArrowDownLeft } from 'lucide-react';

export const CollegeReturnBook: React.FC = () => {
  const { issues, returnBook } = useLibrary();

  const [search, setSearch] = useState('');
  const [returnMsg, setReturnMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const activeIssues = issues.filter((i) => i.status !== 'RETURNED');

  const filtered = activeIssues.filter(
    (i) =>
      i.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      i.studentName.toLowerCase().includes(search.toLowerCase()) ||
      i.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      i.bookNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleReturn = (issueId: string) => {
    const res = returnBook(issueId);
    if (res.success) {
      setReturnMsg({ type: 'success', message: res.message });
      setTimeout(() => setReturnMsg(null), 4000);
    } else {
      setReturnMsg({ type: 'error', message: res.message });
      setTimeout(() => setReturnMsg(null), 4000);
    }
  };

  const calculateDaysOverdue = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const today = new Date('2026-10-06');
    const diff = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Return Issued Book</h1>
        <p className="text-xs text-slate-500">
          Search student roll number or book code to process book return and calculate late fine
        </p>
      </div>

      {returnMsg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
            returnMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {returnMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{returnMsg.message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student roll number, name, or book code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Name & Roll No</th>
                <th className="py-3 px-4">Book Code & Title</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Overdue Days</th>
                <th className="py-3 px-4 text-right">Late Fine (₹10/day)</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-slate-400">
                    No active issued books found.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => {
                  const overdueDays = calculateDaysOverdue(rec.dueDate);
                  const isLate = overdueDays > 0;
                  const estimatedFine = overdueDays * 10;

                  return (
                    <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{rec.studentName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{rec.rollNo}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{rec.bookTitle}</div>
                        <div className="text-[11px] font-mono text-indigo-700">{rec.bookNo}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{rec.issueDate}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{rec.dueDate}</td>
                      <td className="py-3 px-4">
                        {isLate ? (
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            {overdueDays} days late
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            On Time
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold">
                        {isLate ? (
                          <span className="text-rose-600">₹{estimatedFine}</span>
                        ) : (
                          <span className="text-emerald-600">₹0</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleReturn(rec.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors shadow-xs"
                        >
                          Confirm Return
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
