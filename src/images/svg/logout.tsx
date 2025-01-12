
export default function LogoutSVG({
  width,
  height,
  fill,
}: {
  width?: string;
  height?: string;
  fill?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Layer_2"
      fill={fill ?? "#000"}
      data-name="Layer 2"
      viewBox="0 0 1000 1000"
      className="scale-150"
    >
      <g id="SVGRepo_iconCarrier">
        <path
          fill="none"
          stroke={fill ?? "#020202"}
          strokeLinecap="round"
          strokeMiterlimit="10"
          strokeWidth="22px"
          d="M591.61 280.48C693.9 317.86 766.91 416 766.91 531.26c0 147.41-119.5 266.91-266.91 266.91s-266.91-119.5-266.91-266.91c0-115.22 73-213.4 175.3-250.78"
        ></path>
        <rect
          width={"71.84"}
          height={ "160.61"}
          x="464.08"
          y="201.83"
          fill={fill ?? "#020202"}
          rx="35.92"
        ></rect>
      </g>
    </svg>
  );
}
