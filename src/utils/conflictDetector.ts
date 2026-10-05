import { Booking, ConflictCheckResult, Resource } from '../types';
import { AVAILABLE_RESOURCES } from '../data/mockResources';

// Convert "HH:mm" to minutes since midnight for robust comparison
export function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function isTimeOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  // Strict interval overlap: (startA < endB) && (endA > startB)
  return aStart < bEnd && aEnd > bStart;
}

export function checkScheduleConflict(
  proposed: {
    date: string;
    startTime: string;
    endTime: string;
    roomId: string | null;
    equipmentIds: string[];
    excludeBookingId?: string;
  },
  existingBookings: Booking[]
): ConflictCheckResult {
  const { date, startTime, endTime, roomId, equipmentIds, excludeBookingId } = proposed;

  // Active bookings on the same date (status APPROVED)
  const activeBookings = existingBookings.filter(
    (b) =>
      b.status === 'APPROVED' &&
      b.date === date &&
      (!excludeBookingId || b.id !== excludeBookingId)
  );

  const conflictingBookings: Booking[] = [];
  const conflictingResourceNames: string[] = [];
  const explanationParts: string[] = [];

  for (const booking of activeBookings) {
    if (!isTimeOverlapping(startTime, endTime, booking.startTime, booking.endTime)) {
      continue;
    }

    // Check room collision
    let hasResourceConflict = false;
    if (roomId && booking.roomId === roomId) {
      hasResourceConflict = true;
      const roomObj = AVAILABLE_RESOURCES.find((r) => r.id === roomId);
      const roomName = roomObj?.name || 'Ruangan';
      if (!conflictingResourceNames.includes(roomName)) {
        conflictingResourceNames.push(roomName);
      }
      explanationParts.push(
        `Ruang "${roomName}" sedang digunakan oleh "${booking.borrowerName}" (${booking.institution}) untuk keperluan "${booking.purpose}" pukul ${booking.startTime} - ${booking.endTime} WIB.`
      );
    }

    // Check equipment collision
    for (const eqId of equipmentIds) {
      if (booking.equipmentIds && booking.equipmentIds.includes(eqId)) {
        hasResourceConflict = true;
        const eqObj = AVAILABLE_RESOURCES.find((r) => r.id === eqId);
        const eqName = eqObj?.name || 'Alat';
        if (!conflictingResourceNames.includes(eqName)) {
          conflictingResourceNames.push(eqName);
        }
        explanationParts.push(
          `Alat "${eqName}" sedang dipinjam oleh "${booking.borrowerName}" untuk keperluan "${booking.purpose}" pukul ${booking.startTime} - ${booking.endTime} WIB.`
        );
      }
    }

    if (hasResourceConflict && !conflictingBookings.some((b) => b.id === booking.id)) {
      conflictingBookings.push(booking);
    }
  }

  const hasConflict = conflictingBookings.length > 0;

  // Generate intelligent suggestions
  let suggestedAlternativeTimes: { startTime: string; endTime: string }[] | undefined;
  let suggestedAlternativeResources: { id: string; name: string; category: Resource['category'] }[] | undefined;

  if (hasConflict) {
    const duration = timeToMinutes(endTime) - timeToMinutes(startTime);

    // 1. Suggest alternative time blocks on the same day (operating hours 07:30 to 18:00)
    const workDayStart = 7 * 60 + 30; // 07:30
    const workDayEnd = 18 * 60; // 18:00
    const alternativeSlots: { startTime: string; endTime: string }[] = [];

    for (let testStart = workDayStart; testStart + duration <= workDayEnd; testStart += 30) {
      const testStartStr = minutesToTime(testStart);
      const testEndStr = minutesToTime(testStart + duration);

      // Check if this slot conflicts with active bookings for the requested resources
      const clashes = activeBookings.some((b) => {
        if (!isTimeOverlapping(testStartStr, testEndStr, b.startTime, b.endTime)) {
          return false;
        }
        const roomClash = roomId && b.roomId === roomId;
        const eqClash = equipmentIds.some((eqId) => b.equipmentIds?.includes(eqId));
        return roomClash || eqClash;
      });

      if (!clashes) {
        alternativeSlots.push({ startTime: testStartStr, endTime: testEndStr });
        if (alternativeSlots.length >= 3) break; // Suggest up to 3 slots
      }
    }

    if (alternativeSlots.length > 0) {
      suggestedAlternativeTimes = alternativeSlots;
    }

    // 2. Suggest alternative available resources at the proposed time
    const alternativeResources: { id: string; name: string; category: Resource['category'] }[] = [];

    // If room is clashing, find another free room in the same category
    if (roomId && conflictingResourceNames.some((n) => n.includes('Lab') || n.includes('Aula') || n.includes('Ruang'))) {
      const targetRoom = AVAILABLE_RESOURCES.find((r) => r.id === roomId);
      const otherRooms = AVAILABLE_RESOURCES.filter(
        (r) => r.category === 'room' && r.id !== roomId
      );

      for (const altRoom of otherRooms) {
        const isOccupied = activeBookings.some(
          (b) =>
            b.roomId === altRoom.id &&
            isTimeOverlapping(startTime, endTime, b.startTime, b.endTime)
        );
        if (!isOccupied) {
          alternativeResources.push({
            id: altRoom.id,
            name: altRoom.name,
            category: 'room',
          });
        }
      }
    }

    // If equipment is clashing, find alternative free equipment
    for (const eqId of equipmentIds) {
      const targetEq = AVAILABLE_RESOURCES.find((r) => r.id === eqId);
      if (targetEq && conflictingResourceNames.includes(targetEq.name)) {
        // e.g. If projector is clashing, find another projector
        const isProjector = targetEq.id.includes('proyektor');
        const otherEqs = AVAILABLE_RESOURCES.filter(
          (r) =>
            r.category === 'equipment' &&
            r.id !== eqId &&
            (!equipmentIds.includes(r.id)) &&
            (isProjector ? r.id.includes('proyektor') : true)
        );

        for (const altEq of otherEqs) {
          const isOccupied = activeBookings.some(
            (b) =>
              b.equipmentIds?.includes(altEq.id) &&
              isTimeOverlapping(startTime, endTime, b.startTime, b.endTime)
          );
          if (!isOccupied && !alternativeResources.some((ar) => ar.id === altEq.id)) {
            alternativeResources.push({
              id: altEq.id,
              name: altEq.name,
              category: 'equipment',
            });
          }
        }
      }
    }

    if (alternativeResources.length > 0) {
      suggestedAlternativeResources = alternativeResources;
    }
  }

  const explanation = hasConflict
    ? explanationParts.join(' ')
    : 'Jadwal peminjaman tersedia tanpa bentrokan dengan peminjaman lain.';

  return {
    hasConflict,
    conflictingBookings,
    conflictingResourceNames,
    explanation,
    suggestedAlternativeTimes,
    suggestedAlternativeResources,
  };
}
