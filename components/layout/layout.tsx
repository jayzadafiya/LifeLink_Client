import React, { ReactNode } from "react";
import Header from "./header";
import Footer from "./footer";
import { useEffect } from "react";
import { fetchUser } from "../../store/slices/userSlice";
import Cookies from "js-cookie";
import { Toaster } from "react-hot-toast";
import { useAppDispatch } from "../../store/store";

export default function Layout({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const dispatch = useAppDispatch();
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
      marginTop: "100px",
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
