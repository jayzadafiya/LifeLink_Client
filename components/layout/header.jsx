import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/images/logo.png";
import userImg from "../../public/assets/images/avatar-icon.png";
import { BiMenu } from "react-icons/bi";

const navLink = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/doctors",
    display: "Find a Doctor",
  },
  {
    path: "/services",
    display: "Searvices",
  },
  {
    path: "/contact",
    display: "Contact",
  },
];

export default function Header() {
  const router = useRouter();
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  const handleStickyheader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky_header");
      } else {
        headerRef.current.classList.remove("sticky_header");
      }
    });
  };

  useEffect(() => {
    handleStickyheader();

    //unmount
    return () => window.removeEventListener("scroll", handleStickyheader);
  });

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Image src={logo} alt="Logo" width={134} />
            </Link>
          </div>

          {/* Menu */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLink.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className={
                      router.pathname === link.path
                        ? "text-primaryColor text-[16px]leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[600] hover:text-primaryColor "
                    }
                  >
                    {link.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav Right */}
          <div className="flex items-center gap-4 cursor-pointer">
            <div className="hidden">
              <Link href="/">
                <figure className="w-[35px] h-[35px] rounded-full">
                  <Image src={userImg} alt="" className="w-full rounded-full" />
                </figure>
              </Link>
            </div>

            <Link href="/login">
              <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                Login
              </button>
            </Link>

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer"></BiMenu>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
