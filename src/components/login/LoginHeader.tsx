import { Link } from "react-router-dom";

export function LoginHeader() {
  return (
    <header className="flex h-20 w-full items-center justify-between px-8 py-7">
      <Link to="/" className="font-nexon text-logo text-grey-600">
        Dotfolio
      </Link>
    </header>
  );
}
