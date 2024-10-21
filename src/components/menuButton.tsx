"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "react-feather";

export default function MenuButton() {
  const [isMenuClosed, setIsMenuClosed] = useState(true);
  // stupid way of re-rendering component on navigation
  const pathname = usePathname();

  function toggleMenu() {
    document.querySelector("#menuPanel")?.classList.toggle("hidden");
    setIsMenuClosed(!isMenuClosed);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setIsMenuClosed(
      document.querySelector("#menuPanel")?.classList.contains("hidden") ?? true
    );
  });

  return (
    <div className="lg:hidden">
      {isMenuClosed ? (
        <Menu onClick={toggleMenu} />
      ) : (
        <X onClick={toggleMenu} />
      )}
    </div>
  );
}
