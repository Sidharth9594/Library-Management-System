import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Search } from 'lucide-react';

export const CollegeIssuedRecords: React.FC = () => {
  const { issues } = useLibrary();

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ISSUED' | 'OVERDUE' | 'RETURNED'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = issues.filter((i) => {
    const matchSearch =
      i.studentName.toLowerCase().includes(search.toLowerCase()) ||
      i.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      i.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
      i.bookNo.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ISSUED') return i.status === 'ISSUED';
    if (filterStatus === 'OVERDUE') return i.status === 'OVERDUE';
    if (filterStatus === 'RETURNED') return i.status === 'RETURNED';

    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Issued Books Records</h1>
        <p className="text-xs text-slate-500">
          Full audit report of all book borrowings, returns, and fine collections
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, roll no, or book..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'ISSUED', label: 'Issued' },
            { id: 'OVERDUE', label: 'Overdue' },
            { id: 'RETURNED', label: 'Returned' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Return Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Fine Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-slate-400">
                    No records found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{rec.studentName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{rec.rollNo}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{rec.bookTitle}</div>
                      <div className="text-[11px] font-mono text-indigo-700">{rec.bookNo}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{rec.issueDate}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{rec.dueDate}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {rec.returnDate ? rec.returnDate : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {rec.status === 'RETURNED' ? (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Returned
                        </span>
                      ) : rec.status === 'OVERDUE' ? (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Overdue
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Issued
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {rec.fine > 0 ? (
                        <span className="text-rose-600">₹{rec.fine}</span>
                      ) : (
                        <span className="text-slate-400">₹0</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
