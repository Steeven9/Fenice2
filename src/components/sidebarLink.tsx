"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

type Props = {
  name: string;
  href: string;
  icon: ReactElement;
  newTab?: boolean;
};

function closeMenu() {
  document.querySelector("#menuPanel")!.classList.add("hidden");
}

export default function SidebarLink({
  name,
  href,
  icon,
  newTab = false,
}: Readonly<Props>) {
  const pathname = usePathname();
  const currentPage =
    !href.startsWith("https://") &&
    (href === "/"
      ? pathname === href
      : pathname?.startsWith(`/${href.split("/")[1]}`));
  return (
    <Link
      href={href}
      onClick={closeMenu}
      className={`flex p-4 hover:bg-blue-300 dark:hover:bg-blue-950 ${currentPage ? "text-fenice-red" : ""}`}
      target={newTab ? "_blank" : undefined}
    >
      {icon}
      <p className="ml-3">{name}</p>
    </Link>
  );
}

export function TopbarLink({
  name,
  href,
  icon,
  newTab = false,
}: Readonly<Props>) {
  const pathname = usePathname();
  const currentPage =
    !href.startsWith("https://") &&
    (href === "/"
      ? pathname === href
      : pathname?.startsWith(`/${href.split("/")[1]}`));
  return (
    <Link
      href={href}
      onClick={closeMenu}
      className={`inline-block p-4 hover:bg-blue-300 dark:hover:bg-blue-950 ${currentPage ? "text-fenice-red dark:text-white" : ""}`}
      target={newTab ? "_blank" : undefined}
      title={name}
    >
      {icon}
      {/* {name ? <p className="ml-3">{name}</p> : null} */}
    </Link>
  );
}
