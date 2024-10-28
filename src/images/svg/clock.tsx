export default function Clock({
  fill,
  height,
  width,
  stroke
}: {
  fill?: string;
  height?: string;
  width?: string;
  stroke?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={fill ?? "none"}
      viewBox="0 0 24 24"
      width={width ?? "100%"}
      height={height ?? "100%"}
    >
      <path
        stroke={stroke ?? "#000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0.36"
        d="M12 7v5h3m6 0a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );
}
