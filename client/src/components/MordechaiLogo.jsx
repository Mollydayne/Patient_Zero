import React from "react";
import mordechaiBlack from "../assets/mordechai_black.png";

export default function MordechaiLogo() {
  return (
    <div className="absolute top-[85px] left-6 z-10">
      <img
        src={mordechaiBlack}
        alt="Mordechai logo"
        className="w-24 h-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
      />
    </div>
  );
}
