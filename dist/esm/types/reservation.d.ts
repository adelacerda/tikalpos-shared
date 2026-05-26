export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'SEATED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export interface Reservation {
    id: string;
    organizationId: string;
    locationId: string;
    guestName: string;
    guestPhone?: string;
    partySize: number;
    reservedFor: Date;
    tableId?: string;
    tableLabel?: string;
    notes?: string;
    status: ReservationStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateReservationInput {
    guestName: string;
    guestPhone?: string;
    partySize: number;
    reservedFor: string;
    tableId?: string;
    tableLabel?: string;
    notes?: string;
    status?: ReservationStatus;
}
export interface UpdateReservationInput extends Partial<CreateReservationInput> {
}
//# sourceMappingURL=reservation.d.ts.map