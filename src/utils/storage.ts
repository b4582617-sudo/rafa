import { Booking, EmailNotification } from '../types';
import { getInitialBookings, getInitialEmailLogs } from '../data/initialBookings';

const BOOKINGS_STORAGE_KEY = 'simruang_bookings_v1';
const EMAILS_STORAGE_KEY = 'simruang_emails_v1';

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialBookings();
      saveBookings(initial);
      return initial;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading bookings from localStorage:', err);
    return getInitialBookings();
  }
}

export function saveBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (err) {
    console.error('Error saving bookings to localStorage:', err);
  }
}

export function loadEmailLogs(): EmailNotification[] {
  try {
    const raw = localStorage.getItem(EMAILS_STORAGE_KEY);
    if (!raw) {
      const initialBookings = loadBookings();
      const initialEmails = getInitialEmailLogs(initialBookings);
      saveEmailLogs(initialEmails);
      return initialEmails;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading email logs:', err);
    return [];
  }
}

export function saveEmailLogs(emails: EmailNotification[]): void {
  try {
    localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
  } catch (err) {
    console.error('Error saving emails to localStorage:', err);
  }
}

export function resetAllData(): { bookings: Booking[]; emails: EmailNotification[] } {
  localStorage.removeItem(BOOKINGS_STORAGE_KEY);
  localStorage.removeItem(EMAILS_STORAGE_KEY);
  const bookings = getInitialBookings();
  const emails = getInitialEmailLogs(bookings);
  saveBookings(bookings);
  saveEmailLogs(emails);
  return { bookings, emails };
}
