import Image from "next/image";
import Link from "next/link";

const PageList = [
  [
    {
      name: "Homepage",
      link: "/",
    },
    {
      name: "Contact",
      link: "/",
    },
    {
      name: "Terms of Service",
      link: "/",
    },
    {
      name: "Privacy Policy",
      link: "/",
    },
  ],
  [
    {
      name: "All Products",
      link: "/",
    },
    {
      name: "New Arrivals",
      link: "/",
    },
    {
      name: "Best Sellers",
      link: "/",
    },
    {
      name: "Sales",
      link: "/",
    },
  ],
  [
    {
      name: "About",
      link: "/",
    },
    {
      name: "Contact",
      link: "/",
    },
    {
      name: "Blog",
      link: "/",
    },
    {
      name: "Affiliate Program",
      link: "/",
    },
  ],
];

function Footer() {
  return (
    <div className="mt-16 flex flex-col items-center gap-8 md:gap-0 md:flex-row md:items-start bg-gray-800 p-8 rounded-lg md:justify-between">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <Link href="/">
          <Image src="/logo.png" alt="ECOM Logo" width={36} height={36} />
          <p className="hidden md:block tracking-wider font-medium text-white">
            ECOM
          </p>
        </Link>
        <p className="text-sm text-gray-400">C 2025 ECOM.</p>
        <p className="text-sm text-gray-400">All rights reserved.</p>
      </div>
      {PageList.map((section, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 text-sm text-gray-400 items-center md:items-start"
        >
          <p className="text-sm text-amber-50">Links</p>
          {section.map((item) => (
            <Link key={item.name} href={item.link}>
              {item.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export default Footer;
