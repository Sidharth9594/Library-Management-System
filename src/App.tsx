import React, { useState } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { CollegeNavbar } from './components/CollegeNavbar';
import { CollegeDashboard } from './components/CollegeDashboard';
import { CollegeBooks } from './components/CollegeBooks';
import { CollegeIssueBook } from './components/CollegeIssueBook';
import { CollegeReturnBook } from './components/CollegeReturnBook';
import { CollegeIssuedRecords } from './components/CollegeIssuedRecords';
import { CollegeStudents } from './components/CollegeStudents';
import { Book } from './types/library';
import { RotateCcw } from 'lucide-react';

const MainApp: React.FC = () => {
  const { resetData } = useLibrary();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<Book | null>(null);

  const handleIssueFromCatalog = (book: Book) => {
    setSelectedBookForIssue(book);
    setActiveTab('issue');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* College Top Navbar */}
      <CollegeNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <CollegeDashboard
            setActiveTab={setActiveTab}
            openAddBookModal={() => setIsAddBookModalOpen(true)}
          />
        )}

        {activeTab === 'books' && (
          <CollegeBooks
            onIssueClick={handleIssueFromCatalog}
            isAddModalOpen={isAddBookModalOpen}
            setIsAddModalOpen={setIsAddBookModalOpen}
          />
        )}

        {activeTab === 'issue' && (
          <CollegeIssueBook preselectedBook={selectedBookForIssue} />
        )}

        {activeTab === 'return' && <CollegeReturnBook />}

        {activeTab === 'records' && <CollegeIssuedRecords />}

        {activeTab === 'students' && <CollegeStudents />}
      </main>

      {/* College Project Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">CampusLib</span>
            <span>·</span>
            <span>College Library Management System</span>
            <span>·</span>
            <span>Academic Year 2025–26</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all books, students, and issue records to sample college data?')) {
                  resetData();
                  alert('Reset successfully to initial college library data!');
                }
              }}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 text-[11px]"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <MainApp />
    </LibraryProvider>
  );
}
