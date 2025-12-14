import { SeatCell, SeatModal } from "@/types";

export interface RenderSeat extends SeatCell {
  id?: string;
  seatNumber?: string;
  price?: number;

  isMerged?: boolean;
  displayLabel?: string;
  secondId?: string;
}

export const mergeSeatData = (
  layout: SeatCell[],
  realSeats: SeatModal[]
): RenderSeat[] => {
  if (!layout) return [];

  return layout.map((cell) => {
    const seatNumToCheck = `${cell.row}${cell.col}`;

    const matchedSeat = realSeats?.find((s) => s.seatNumber === seatNumToCheck);

    if (matchedSeat) {
      return {
        ...cell,
        id: matchedSeat.id,
        seatNumber: matchedSeat.seatNumber,
        price: matchedSeat.extraPrice,
      };
    }

    return { ...cell };
  });
};
