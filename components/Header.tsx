import React from "react";
import { ModeToggle } from "./toggle-theme";

function Header() {
  return (
    <div className="w-full ">
      <div>
        <ModeToggle />
      </div>
    </div>
  );
}

export default Header;
