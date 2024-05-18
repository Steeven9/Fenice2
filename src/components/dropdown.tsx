"use client";

import { useState } from "react";

interface Props {
  links: Link[];
}

interface Link {
  title: string;
  href?: string;
  onClick?: () => void;
}

// https://flowbite.com/docs/components/dropdowns/#menu-icon
export default function Dropdown({ links }: Readonly<Props>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (func?: () => void) => {
    setIsOpen(false);
    if (func) {
      func();
    }
  };

  return (
    <>
      <button
        className="inline-flex items-center p-1 text-center text-gray-900 rounded-lg"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 4 15"
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
        </svg>
      </button>

      <div
        className={`z-10 ${isOpen ? "" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute right-0 mt-16 mr-3`}
      >
        <ul className="py-2">
          {links.map((link) => (
            <li key={link.title}>
              <a
                href={link.href}
                onClick={() => handleClick(link.onClick)}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
