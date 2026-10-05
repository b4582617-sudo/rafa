export type ResourceCategory = 'room' | 'equipment';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  capacity?: number; // for rooms
  quantity?: number; // for equipment
  location: string;
  description: string;
  facilities: string[];
  color: string; // for schedule chips
  image?: string;
  rules?: string[];
}

export type BookingStatus = 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  borrowerName: string;
  institution: string; // Fakultas / Prodi / Instansi / Divisi
  email: string;
  phone: string;
  roomId: string | null;
  equipmentIds: string[];
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string;
  attendeesCount: number;
  status: BookingStatus;
  createdAt: string;
  conflictReason?: string;
  conflictingBookingIds?: string[];
  adminEmailSent: boolean;
  notes?: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingBookings: Booking[];
  conflictingResourceNames: string[];
  explanation: string;
  suggestedAlternativeTimes?: { startTime: string; endTime: string }[];
  suggestedAlternativeResources?: { id: string; name: string; category: ResourceCategory }[];
}

export interface EmailNotification {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  type: 'AUTO_APPROVAL' | 'REJECTION_ALERT' | 'CANCELLATION';
  bookingId: string;
  borrowerName: string;
  borrowerEmail: string;
  summary: string;
  contentHtml: string;
  isRead: boolean;
}
