"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

type Props = {
  name: string;
  path: string;
  icon: ReactElement;
  disabled?: boolean;
};

export default function SidebarLink({
  name,
  path,
  icon,
  disabled = false,
}: Props) {
  const pathname = usePathname();
  const currentPage =
    path === "/" ? pathname === path : pathname?.startsWith(path);

  return (
    <>
      <Link
        href={disabled ? "" : path}
        className={`flex p-4 hover:bg-blue-300 ${
          disabled ? "cursor-default text-slate-500" : ""
        } ${currentPage ? "text-red-700" : ""}`}
      >
        {icon}
        <p className="ml-3">{name}</p>
      </Link>
    </>
  );
}