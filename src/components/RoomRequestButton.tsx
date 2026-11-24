"use client";

/** Links to the request module and preselects the room there. Without
 *  JavaScript it is still a working link to the module. */
export function RoomRequestButton({ roomId, label, primary }: { roomId: string; label: string; primary?: boolean }) {
  return (
    <a
      href={`?room=${encodeURIComponent(roomId)}#request`}
      className={`btn ${primary ? "btn--primary" : "btn--ghost"} btn--block`}
      onClick={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("onyx:select-room", { detail: roomId }));
        const target = document.getElementById("request");
        target?.scrollIntoView();
        document.getElementById("request-title")?.focus({ preventScroll: true });
      }}
    >
      {label}
    </a>
  );
}
