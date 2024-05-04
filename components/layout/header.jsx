import Image from "next/image";
import Link from "next/link";
import logo from "../../public/assets/images/logo.png";
import dolLogo from "../../public/assets/images/dfl/logo.png";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { BiMenu } from "react-icons/bi";
import { useSelector } from "react-redux";
import { capitalize } from "@/utils/heplerFunction";

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
    path: "/drop-for-life",
    display: "Blood Donation",
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

  const isDFL = router.pathname.startsWith("/drop-for-life");

  const { user, accessToken } = useSelector((state) => state.user);

  const handleStickyheader = () => {
    window.addEventListener("scroll", () => {
      const scrollPosition =
        document.body.scrollTop || document.documentElement.scrollTop;
      if (scrollPosition > 80) {
        headerRef?.current?.classList?.add(
          `${isDFL ? "sticky-header-dol" : "sticky_header"}`
        );
      } else {
        headerRef?.current?.classList?.remove(
          `${isDFL ? "sticky-header-dol" : "sticky_header"}`
        );
      }
    });
  };

  useEffect(() => {
    handleStickyheader();

    //unmount
    return () => window.removeEventListener("scroll", handleStickyheader);
  }, [headerRef]);

  const toggleMenu = () => menuRef.current?.classList?.toggle("show__menu");

  return (
    <header
      className={` ${isDFL ? "dol-header" : "header"} flex items-center `}
      ref={headerRef}
    >
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/">
              <Image src={isDFL ? dolLogo : logo} alt="Logo" width={134} />
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
                        ? `${
                            isDFL ? "text-red-950" : "text-primaryColor"
                          } text-[16px] leading-7 font-[600]`
                        : `${
                            isDFL
                              ? "text-red-700  hover:text-white"
                              : "text-textColor hover:text-primaryColor "
                          } text-[16px] leading-7 font-[600] `
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
                <h2 className={`${isDFL && "text-red-950"} font-semibold`}>
                  {capitalize(user.name)}
                </h2>
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
