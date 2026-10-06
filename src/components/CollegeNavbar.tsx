import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import { BookOpen, GraduationCap, UserCheck, Shield } from 'lucide-react';

interface CollegeNavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CollegeNavbar: React.FC<CollegeNavbarProps> = ({ activeTab, setActiveTab }) => {
  const { currentRole, setCurrentRole, students, activeRollNo, setActiveRollNo } = useLibrary();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'books', label: 'Books Catalog' },
    { id: 'issue', label: 'Issue Book' },
    { id: 'return', label: 'Return Book' },
    { id: 'records', label: 'Issued Records' },
    { id: 'students', label: 'Students List' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
                CampusLib
              </span>
              <span className="text-xs text-slate-500 font-medium">
                College Library Management System
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Role Switcher */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setCurrentRole('LIBRARIAN')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentRole === 'LIBRARIAN'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin (Librarian)</span>
              </button>

              <button
                onClick={() => {
                  setCurrentRole('STUDENT');
                  setActiveTab('dashboard');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition-all ${
                  currentRole === 'STUDENT'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student View</span>
              </button>
            </div>

            {currentRole === 'STUDENT' && (
              <select
                value={activeRollNo}
                onChange={(e) => setActiveRollNo(e.target.value)}
                className="hidden sm:block text-xs bg-white border border-slate-300 rounded-md px-2 py-1 text-slate-700 font-medium"
              >
                {students.map((s) => (
                  <option key={s.rollNo} value={s.rollNo}>
                    {s.name} (Roll No: {s.rollNo})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Mobile horizontal scroll nav */}
        <div className="lg:hidden flex items-center gap-1 py-2 overflow-x-auto border-t border-slate-100 no-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium ${
                activeTab === item.id
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
