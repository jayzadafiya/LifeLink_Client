import React from "react";
import Header from "./header";
import Footer from "./footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/store/slices/userSlice";
import Cookies from "js-cookie";

export default function Layout({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
