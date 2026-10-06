import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { UserPlus, Search, X } from 'lucide-react';

export const CollegeStudents: React.FC = () => {
  const { students, addStudent } = useLibrary();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [rollNo, setRollNo] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [branch, setBranch] = useState('Computer Science and Engineering');
  const [semester, setSemester] = useState('6th Sem');
  const [contact, setContact] = useState('');
  const [maxLimit, setMaxLimit] = useState(3);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNo.trim() || !name.trim()) return;

    const res = addStudent({
      rollNo: rollNo.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim() || `${rollNo.toLowerCase()}@college.edu`,
      branch,
      semester,
      contact: contact.trim() || '+91 90000 00000',
      maxLimit: Number(maxLimit),
    });

    if (res.success) {
      alert(res.message);
      setIsModalOpen(false);
      setRollNo('');
      setName('');
      setEmail('');
      setContact('');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Enrolled Students Directory</h1>
          <p className="text-xs text-slate-500">
            Total {students.length} students registered for library circulation card
          </p>
        </div>

        <button
          onClick={() => {
            setRollNo(`2023-CSE-${Math.floor(100 + students.length * 5)}`);
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Branch & Semester</th>
                <th className="py-3 px-4">Contact & Email</th>
                <th className="py-3 px-4 text-center">Books Borrowed</th>
                <th className="py-3 px-4 text-right">Card Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                    {s.rollNo}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {s.name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-800">{s.branch}</div>
                    <div className="text-[11px] text-slate-500">{s.semester}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div className="text-slate-800">{s.contact}</div>
                    <div className="text-slate-400">{s.email}</div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="font-bold text-indigo-600">{s.issuedCount}</span>
                    <span className="text-slate-400"> / {s.maxLimit} max</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Register Student</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  University Roll Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2023-CSE-095"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Divya Prakash"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch / Dept
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Comm Engg">Electronics & Comm Engg</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="1st Sem">1st Sem</option>
                    <option value="2nd Sem">2nd Sem</option>
                    <option value="3rd Sem">3rd Sem</option>
                    <option value="4th Sem">4th Sem</option>
                    <option value="5th Sem">5th Sem</option>
                    <option value="6th Sem">6th Sem</option>
                    <option value="7th Sem">7th Sem</option>
                    <option value="8th Sem">8th Sem</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max Books Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={maxLimit}
                    onChange={(e) => setMaxLimit(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College Email
                </label>
                <input
                  type="email"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Register Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
