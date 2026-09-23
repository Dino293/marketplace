import React from "react";

export default function Spinner({ size = 40 }) {
  return (
    <div
      className="flex items-center justify-center"
      aria-busy="true"
      role="status"
    >
      <div
        className="border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
}
