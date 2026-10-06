import React, { useState, useMemo } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Book } from '../types/library';
import { Search, Plus, Trash2, ArrowUpRight, BookOpen, X } from 'lucide-react';

interface CollegeBooksProps {
  onIssueClick: (book: Book) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
}

export const CollegeBooks: React.FC<CollegeBooksProps> = ({
  onIssueClick,
  isAddModalOpen,
  setIsAddModalOpen,
}) => {
  const { books, addBook, deleteBook, currentRole } = useLibrary();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Add Book Form state
  const [bookNo, setBookNo] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [publisher, setPublisher] = useState('');
  const [totalCopies, setTotalCopies] = useState(5);
  const [shelfNo, setShelfNo] = useState('Rack 1, Shelf A');

  const categories = useMemo(() => {
    return ['ALL', ...Array.from(new Set(books.map((b) => b.category)))];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchSearch =
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.bookNo.toLowerCase().includes(search.toLowerCase());

      const matchCat = selectedCategory === 'ALL' || b.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [books, search, selectedCategory]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookNo.trim() || !title.trim() || !author.trim()) return;

    const res = addBook({
      bookNo: bookNo.trim().toUpperCase(),
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      publisher: publisher.trim() || 'Academic Publisher',
      totalCopies: Number(totalCopies),
      shelfNo: shelfNo.trim(),
    });

    if (res.success) {
      alert(res.message);
      setIsAddModalOpen(false);
      setBookNo('');
      setTitle('');
      setAuthor('');
      setPublisher('');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this book from the library catalog?')) {
      const res = deleteBook(id);
      alert(res.message);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Books Catalog</h1>
          <p className="text-xs text-slate-500">
            Total {books.length} book titles in college library database
          </p>
        </div>

        {currentRole === 'LIBRARIAN' && (
          <button
            onClick={() => {
              setBookNo(`CSE-${Math.floor(110 + books.length)}`);
              setIsAddModalOpen(true);
            }}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search book title, author, or code (e.g. 'Java', 'Herbert', 'CSE-101')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden focus:bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === 'ALL' ? 'All Subjects & Branches' : c}
            </option>
          ))}
        </select>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Book Code</th>
                <th className="py-3 px-4">Title & Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Shelf Location</th>
                <th className="py-3 px-4 text-center">Available / Total</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-slate-400">
                    No books found matching your search.
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => {
                  const isAvailable = book.availableCopies > 0;
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        {book.bookNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{book.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {book.author} · {book.publisher}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {book.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        {book.shelfNo}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium">
                        <span className={isAvailable ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                          {book.availableCopies}
                        </span>
                        <span className="text-slate-400"> / {book.totalCopies}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isAvailable ? (
                            <button
                              onClick={() => onIssueClick(book)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-xs"
                            >
                              Issue
                            </button>
                          ) : (
                            <span className="text-[11px] font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Out of stock
                            </span>
                          )}

                          {currentRole === 'LIBRARIAN' && (
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Delete book"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add New Book to Library</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Book Code / Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE-109"
                  value={bookNo}
                  onChange={(e) => setBookNo(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python Crash Course"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eric Matthes"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category / Branch
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Tech">Information Tech</option>
                    <option value="Web Technology">Web Technology</option>
                    <option value="Database Management">Database Management</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical Engg">Mechanical Engg</option>
                    <option value="Civil Engg">Civil Engg</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. No Starch Press"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Total Quantity (Copies)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Shelf / Rack Location
                </label>
                <input
                  type="text"
                  value={shelfNo}
                  onChange={(e) => setShelfNo(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
