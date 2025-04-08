import { Link } from "react-router-dom";

export default function BackButton({ to = "/" }) {
  return (
    <Link
      to={to}
      className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-black dark:text-white py-1 px-3 rounded"
    >
      ← Back
    </Link>
  );
}
