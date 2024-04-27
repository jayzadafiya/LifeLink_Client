import Image from "next/image";
import Link from "next/link";
import Logo from "../../public/assets/images/logo.png";
import dolLogo from "../../public/assets/images/dol/logo.png";

import { RiLinkedinFill } from "react-icons/ri";
import { AiFillYoutube, AiFillGithub, AiFillInstagram } from "react-icons/ai";
import { useRouter } from "next/router";

const socialLink = [
  {
    path: "",
    icon: <AiFillYoutube className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "",
    icon: <AiFillGithub className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "",
    icon: <AiFillInstagram className="group-hover:text-white w-4 h-5" />,
  },
  {
    path: "",
    icon: <RiLinkedinFill className="group-hover:text-white w-4 h-5" />,
  },
];

const quickLinks01 = [
  {
    path: "/",
    display: "Home",
  },
  {
    path: "/about",
    display: "About Us",
  },
  {
    path: "/services",
    display: "Services",
  },
  {
    path: "/blog",
    display: "Blog",
  },
];

const quickLinks02 = [
  {
    path: "/doctor",
    display: "find a Doctor",
  },
  {
    path: "/about",
    display: "Request an Appointment",
  },
  {
    path: "/",
    display: "Find a Location",
  },
  {
    path: "/",
    display: "Get a Opinion",
  },
];

const quickLinks03 = [
  {
    path: "/",
    display: "Donate",
  },
  {
    path: "/contact",
    display: "Contact Us",
  },
];

export default function Footer() {
  const router = useRouter();
  const year = new Date().getFullYear();
  const isDOL = router.pathname.startsWith("/drop-of-life");

  return (
    <footer className="pb-16 pt-10">
      <div className="container">
        <div className="flex justify-between flex-col md:flex-row flex-wrap gap-[30px]">
          <div>
            <Image src={isDOL ? dolLogo : Logo} alt="Logo" width={134} />

            <p className="text-[16px] leading-7 font-[400] text-textColor mt-4">
              Coptright @ {year} developed by Jay Zadafiya all right reserved.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {socialLink.map((link, index) => (
                <Link
                  href={link.path}
                  key={index}
                  className="w-9 h-9 border border-solid border-[#181A1E] rounded-full flex items-center justify-center group hover:bg-primaryColor hover:border-none"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-[20px] leading--[30px] font-[700] mb-6 text-headingColor">
              Quick Links
            </h2>

            <ul>
              {quickLinks01.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    href={item.path}
                    className="text-[16px] leading-7 text-textColor font-[400]"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] leading--[30px] font-[700] mb-6 text-headingColor">
              I went to:
            </h2>

            <ul>
              {quickLinks02.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    href={item.path}
                    className="text-[16px] leading-7 text-textColor font-[400]"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-[20px] leading--[30px] font-[700] mb-6 text-headingColor">
              Support
            </h2>

            <ul>
              {quickLinks03.map((item, index) => (
                <li key={index} className="mb-4">
                  <Link
                    href={item.path}
                    className="text-[16px] leading-7 text-textColor font-[400]"
                  >
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
