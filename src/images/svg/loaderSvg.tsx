import Image from "next/image";

export default function LoaderSvg({
  height,
  width,
  fill,
}: {
  height?: string;
  width?: string;
  fill?: string;
}) {
  return (
    <div className="animate-spin">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width ?? "40px"}
        height={height ?? "40px"}
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke={fill ??  "red"}
          strokeDasharray="4 4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
        ></path>
      </svg>
    </div>
  );
}
