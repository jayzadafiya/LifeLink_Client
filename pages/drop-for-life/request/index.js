import Head from "next/head";
import LeftSidebar from "@/components/DFL/Request/LeftSidebar";
import RightSidePanal from "@/components/DFL/Request/RightSidePanal";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import style from "../../../styles/DFL/request.module.scss";
import { fetchDonorData } from "@/store/slices/DFLSlice";

export default function Request() {
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      dispatch(
        fetchDonorData({
          latlng: `${latitude},${longitude}`,
          page: 1,
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
