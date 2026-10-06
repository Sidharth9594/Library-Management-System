import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Student, IssueRecord, UserRole } from '../types/library';
import { INITIAL_BOOKS, INITIAL_STUDENTS, INITIAL_ISSUES } from '../data/initialData';

interface LibraryContextType {
  books: Book[];
  students: Student[];
  issues: IssueRecord[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeRollNo: string;
  setActiveRollNo: (rollNo: string) => void;

  // Actions
  addBook: (book: Omit<Book, 'id' | 'availableCopies'>) => { success: boolean; message: string };
  deleteBook: (id: string) => { success: boolean; message: string };
  issueBook: (bookNo: string, rollNo: string, loanDays?: number) => { success: boolean; message: string };
  returnBook: (issueId: string) => { success: boolean; fine: number; message: string };
  addStudent: (student: Omit<Student, 'id' | 'issuedCount'>) => { success: boolean; message: string };
  resetData: () => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('college_lib_books_v3');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('college_lib_students_v3');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [issues, setIssues] = useState<IssueRecord[]>(() => {
    const saved = localStorage.getItem('college_lib_issues_v3');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('LIBRARIAN');
  const [activeRollNo, setActiveRollNo] = useState<string>('24');

  useEffect(() => {
    localStorage.setItem('college_lib_books_v3', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('college_lib_students_v3', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('college_lib_issues_v3', JSON.stringify(issues));
  }, [issues]);

  const resetData = () => {
    setBooks(INITIAL_BOOKS);
    setStudents(INITIAL_STUDENTS);
    setIssues(INITIAL_ISSUES);
    localStorage.removeItem('college_lib_books_v3');
    localStorage.removeItem('college_lib_students_v3');
    localStorage.removeItem('college_lib_issues_v3');
  };

  // 1. Add Book
  const addBook = (newBookData: Omit<Book, 'id' | 'availableCopies'>) => {
    const newId = `B-${Math.floor(109 + books.length)}`;
    const newBook: Book = {
      ...newBookData,
      id: newId,
      availableCopies: newBookData.totalCopies,
    };
    setBooks(prev => [newBook, ...prev]);
    return { success: true, message: `Book "${newBook.title}" added to library catalog successfully!` };
  };

  // 2. Delete Book
  const deleteBook = (id: string) => {
    const book = books.find(b => b.id === id);
    if (!book) return { success: false, message: 'Book not found' };
    if (book.availableCopies < book.totalCopies) {
      return { success: false, message: 'Cannot delete: some copies of this book are currently issued to students.' };
    }
    setBooks(prev => prev.filter(b => b.id !== id));
    return { success: true, message: `Book "${book.title}" removed from catalog.` };
  };

  // 3. Issue Book
  const issueBook = (bookNo: string, rollNo: string, loanDays: number = 14) => {
    const book = books.find(b => b.bookNo.toLowerCase() === bookNo.toLowerCase() || b.id === bookNo);
    const student = students.find(s => s.rollNo.toLowerCase() === rollNo.toLowerCase());

    if (!book) {
      return { success: false, message: `Book not found with Code: ${bookNo}` };
    }
    if (!student) {
      return { success: false, message: `Student not registered with Roll No: ${rollNo}` };
    }
    if (book.availableCopies <= 0) {
      return { success: false, message: `Sorry, "${book.title}" is currently out of stock.` };
    }
    if (student.issuedCount >= student.maxLimit) {
      return { success: false, message: `Limit reached: ${student.name} already has ${student.issuedCount} books issued (Max: ${student.maxLimit}).` };
    }

    const todayStr = '2026-10-06';
    const due = new Date(todayStr);
    due.setDate(due.getDate() + loanDays);
    const dueDateStr = due.toISOString().split('T')[0];

    const newIssueId = `ISS-00${issues.length + 1}`;
    const newIssue: IssueRecord = {
      id: newIssueId,
      bookNo: book.bookNo,
      bookTitle: book.title,
      rollNo: student.rollNo,
      studentName: student.name,
      issueDate: todayStr,
      dueDate: dueDateStr,
      returnDate: null,
      status: 'ISSUED',
      fine: 0,
    };

    // Decrement available copies
    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1 } : b));
    // Increment student issued count
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, issuedCount: s.issuedCount + 1 } : s));
    // Append issue
    setIssues(prev => [newIssue, ...prev]);

    return {
      success: true,
      message: `Book "${book.title}" issued to ${student.name} (Due: ${dueDateStr})`,
    };
  };

  // 4. Return Book
  const returnBook = (issueId: string) => {
    const issue = issues.find(i => i.id === issueId);
    if (!issue) return { success: false, fine: 0, message: 'Issue record not found' };
    if (issue.status === 'RETURNED') return { success: false, fine: 0, message: 'Book already marked returned' };

    const todayStr = '2026-10-06';
    const due = new Date(issue.dueDate);
    const today = new Date(todayStr);
    const overdueDays = Math.max(0, Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));
    const fineAmount = overdueDays * 10; // ₹10 per day late fee

    // Update issue record
    setIssues(prev => prev.map(i => {
      if (i.id === issueId) {
        return {
          ...i,
          returnDate: todayStr,
          status: 'RETURNED',
          fine: fineAmount,
        };
      }
      return i;
    }));

    // Restore book quantity
    setBooks(prev => prev.map(b => {
      if (b.bookNo === issue.bookNo) {
        return { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) };
      }
      return b;
    }));

    // Decrement student issued count
    setStudents(prev => prev.map(s => {
      if (s.rollNo === issue.rollNo) {
        return { ...s, issuedCount: Math.max(0, s.issuedCount - 1) };
      }
      return s;
    }));

    return {
      success: true,
      fine: fineAmount,
      message: `Book returned successfully.${fineAmount > 0 ? ` Overdue fine: ₹${fineAmount} (${overdueDays} days late)` : ' No late fine.'}`,
    };
  };

  // 5. Add Student
  const addStudent = (newStudentData: Omit<Student, 'id' | 'issuedCount'>) => {
    const newId = `S-${students.length + 1}`;
    const newStudent: Student = {
      ...newStudentData,
      id: newId,
      issuedCount: 0,
    };
    setStudents(prev => [...prev, newStudent]);
    return { success: true, message: `Student "${newStudent.name}" (${newStudent.rollNo}) registered successfully!` };
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        students,
        issues,
        currentRole,
        setCurrentRole,
        activeRollNo,
        setActiveRollNo,
        addBook,
        deleteBook,
        issueBook,
        returnBook,
        addStudent,
        resetData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
};
