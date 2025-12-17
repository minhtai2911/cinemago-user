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

  let isMainSeat = false;

  return layout.map((cell) => {
    const seatNumToCheck = `${cell.row}${cell.col}`;

    const matchedSeat = realSeats?.find((s) => s.seatNumber === seatNumToCheck);

    if (matchedSeat) {
      if (matchedSeat?.seatType === "COUPLE") {
        isMainSeat = !isMainSeat;
      }

      return {
        ...cell,
        id: matchedSeat.id,
        seatNumber: matchedSeat.seatNumber,
        price: matchedSeat.extraPrice,
        secondId:
          isMainSeat && matchedSeat.seatType === "COUPLE"
            ? realSeats?.find(
                (s) => s.seatNumber === `${cell.row}${cell.col + 1}`
              )?.id
            : undefined,
      };
    }

    return { ...cell };
  });
};
