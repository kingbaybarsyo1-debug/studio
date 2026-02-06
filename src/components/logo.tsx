export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <path
        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
        fill="currentColor"
      />
      <path
        d="M12 7a5 5 0 1 1 0 10A5 5 0 0 1 7 12a5 5 0 0 1 5-5z"
        className="text-accent"
        fill="currentColor"
        opacity="0.75"
      />
    </svg>
  );
}
