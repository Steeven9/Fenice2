"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

interface KV {
  name: string;
  value: string;
}

interface Props {
  id?: string;
  name?: string;
  placeholder?: string;
  selectedItem?: string;
  options: KV[];
  redirectPath?: string;
  onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  className?: string;
}

export default function Select({
  id,
  name,
  placeholder,
  selectedItem,
  options,
  redirectPath,
  onChange,
  required = false,
  className,
}: Readonly<Props>) {
  const router = useRouter();
  return (
    <div className={`inline-block ${className}`}>
      {placeholder ? (
        <div className="mb-2">
          {placeholder}
          {required ? "*" : null}
        </div>
      ) : null}

      <select
        name={name}
        id={id}
        className="border rounded-lg p-2 m-2 bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        required={required}
        defaultValue={selectedItem}
        onChange={
          redirectPath
            ? (e) => router.push(`${redirectPath}/${e.target.value}`)
            : onChange
        }
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
