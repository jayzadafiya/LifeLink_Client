import React, { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/images/logo.png";
import { BiMenu } from "react-icons/bi";
import { useSelector } from "react-redux";
import avtarImg from "../../public/assets/images/avatar-icon.png";
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

  const { user, accessToken } = useSelector((state) => state.user);
  const handleStickyheader = () => {
    window.addEventListener("scroll", () => {
      const scrollPosition =
        document.body.scrollTop || document.documentElement.scrollTop;

      if (scrollPosition > 80) {
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
  }, []);

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
          <div className="flex items-center justify-between gap-5">
            {accessToken && user ? (
              <Link
                href={`${
                  user.role === "doctor" ? "/doctors/profile" : "/users/profile"
                }`}
                className="flex items-center gap-4 cursor-pointer"
              >
                <h2>{user.name}</h2>

                {user.photo && (
                  <figure className="w-[35px] h-[35px] rounded-full hidden  md:block lg:block">
                    <Image
                      src={user?.photo}
                      alt=""
                      className="w-full rounded-full h-[35px]"
                      width={35}
                      height={35}
                    />
                  </figure>
                )}
              </Link>
            ) : (
              <Link href="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}
            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer"></BiMenu>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
