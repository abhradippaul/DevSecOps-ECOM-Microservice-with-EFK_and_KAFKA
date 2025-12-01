import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { Bell, Home } from "lucide-react";
import ShoppingCartIcon from "./ShoppingCartIcon";

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="ECOM Logo"
          width={36}
          height={36}
          className="size-6 md:size-9"
        />
        <p className="hidden md:block tracking-wider font-medium">ECOM</p>
      </Link>
      <div className="flex items-center gap-6">
        <SearchBar />
        <Link href="/">
          <Home className="size-4 text-gray-600" />
        </Link>
        <Bell className="size-4 text-gray-600" />
        <ShoppingCartIcon />
      </div>
    </nav>
  );
}

export default Navbar;
