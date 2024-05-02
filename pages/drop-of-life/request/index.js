import Head from "next/head";
import LeftSidebar from "@/components/DOL/Request/LeftSidebar";
import RightSidePanal from "@/components/DOL/Request/RightSidePanal";
import { fetchDonorData } from "@/store/slices/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import style from "../../../styles/DOL/request.module.scss";

export default function Request() {
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      dispatch(
        fetchDonorData({
          latlng: `${latitude},${longitude}`,
        })
      );
    });
  }, []);

  return (
    <div className={style.request_container}>
      <Head>
        <title>Donor Request Page</title>
        <meta name="description" content="User can find donor " />
      </Head>
      <LeftSidebar />
      <RightSidePanal />
    </div>
  );
}
