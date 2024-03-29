import { ReactElement } from "react";

interface Link {
  text: string;
  url: string;
}

interface CardProps {
  title: string;
  text?: string;
  icon?: ReactElement;
  links?: Link[];
}

export default function Card({
  title,
  text,
  icon,
  links,
}: Readonly<CardProps>) {
  return (
    <div className="max-w-sm p-6 mb-2 border rounded-lg shadow bg-gray-800 border-gray-700 inline-block">
      {icon}

      <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white">
        {title}
      </h5>

      <p className="mb-3 font-normal text-gray-500">{text}</p>

      {links?.map((el) => (
        <a
          href={el.url}
          key={el.url}
          className="mr-4 inline-flex items-center text-blue-600 hover:underline"
        >
          {el.text}
          <svg
            className="w-3 h-3 ms-2 rtl:rotate-[270deg]"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11v4.833A1.166 1.166 0 0 1 13.833 17H2.167A1.167 1.167 0 0 1 1 15.833V4.167A1.166 1.166 0 0 1 2.167 3h4.618m4.447-2H17v5.768M9.111 8.889l7.778-7.778"
            />
          </svg>
        </a>
      ))}
    </div>
  );
}
