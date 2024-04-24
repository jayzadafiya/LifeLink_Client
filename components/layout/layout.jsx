import React from "react";
import Header from "./header";
import Footer from "./footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUser } from "@/store/slices/userSlice";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  const toastOptions = {
    style: {
      borderRadius: "10px",
      fontSize: "18px",
      textAline: "left",
      textAlign: "left",
      position: "relative",
      top: "90px",
      zIndex: "999999",
      marginTop: "10px",
    },
    duration: 5000, // 5 seconds
  };

  return (
    <>
      <Header />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={toastOptions}
      />

      <main>{children}</main>
      <Footer />
    </>
  );
}
