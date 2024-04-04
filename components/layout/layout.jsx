import React from "react";
import Header from "./header";
import Footer from "./footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/store/slices/userSlice";
import Cookies from "js-cookie";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
