export type UserRole = 'LIBRARIAN' | 'STUDENT';

export interface Book {
  id: string;
  bookNo: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
  shelfNo: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  branch: string;
  semester: string;
  contact: string;
  issuedCount: number;
  maxLimit: number;
}

export interface IssueRecord {
  id: string;
  bookNo: string;
  bookTitle: string;
  rollNo: string;
  studentName: string;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
  fine: number;
}
