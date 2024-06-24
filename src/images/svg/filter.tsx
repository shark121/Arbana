"use client";

export default function FileterSVG({
  height,
  width,
  fill,
  backgroundColor,
}: {
  height?: string;
  width?: string;
  fill?: string;
  backgroundColor?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "100%"}
      height={height ?? "100%"}
      fill={backgroundColor ?? "none"}
      viewBox="0 0 24 24"
    >
      <path
        fill={fill ?? "#000000"}
        fillRule="evenodd"
        d="M3 7a1 1 0 011-1h16a1 1 0 110 2H4a1 1 0 01-1-1zm3 5a1 1 0 011-1h10a1 1 0 110 2H7a1 1 0 01-1-1zm3 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
}
