"use client";
import React from "react";

export default function QuickBooking({
  cinemas,
  nowShowing,
  showtimes,
  selectedMovie,
  selectedCinema,
  selectedShowtime,
  selectedDate,
  availableDates,
  setSelectedMovie,
  setSelectedCinema,
  setSelectedShowtime,
  setSelectedDate,
  handleQuickBooking,
}: any) {
  return (
    <section className="max-w-6xl mx-auto mb-10 border border-gray-300 rounded-lg px-4 py-4 flex items-center gap-4 shadow-sm bg-transparent">
      <h2 className="text-2xl font-extrabold tracking-wider text-white mr-2 whitespace-nowrap">
        ĐẶT VÉ NHANH
      </h2>
      <form
        className="flex flex-1 flex-row flex-nowrap gap-4 items-center justify-center self-stretch"
        onSubmit={handleQuickBooking}
      >
        <select
          className="w-1/4 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-base font-bold text-black text-center truncate"
          value={selectedCinema}
          onChange={(e) => setSelectedCinema(e.target.value)}
          required
        >
          <option value="">Chọn rạp</option>
          {cinemas.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* CHỌN PHIM */}
        <select
          className="w-1/4 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-base font-bold text-black text-center truncate"
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          required
        >
          <option value="">Chọn phim</option>
          {nowShowing.map((m: any) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        {/* CHỌN NGÀY */}
        <select
          className="w-1/4 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-base font-bold text-black text-center truncate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          required
        >
          <option value="">Chọn ngày</option>
          {availableDates.map((d: any) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* CHỌN SUẤT */}
        <select
          className="w-1/4 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-base font-bold text-black text-center truncate"
          value={selectedShowtime}
          onChange={(e) => setSelectedShowtime(e.target.value)}
          required
        >
          <option value="">Chọn suất</option>
          {showtimes.map((s: any) => (
            <option key={s._id} value={s._id}>
              {s.startTime} - {s.roomName}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="relative w-44 text-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-black via-black to-black border-2 border-red-500 text-red-500 font-medium transition-all duration-300 
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-500/20 before:via-transparent before:to-red-500/20 before:rounded-xl before:opacity-0
              hover:before:opacity-100 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:border-red-400 hover:text-red-400 whitespace-nowrap"
        >
          <span className="relative">ĐẶT NGAY</span>
        </button>
      </form>
    </section>
  );
}
