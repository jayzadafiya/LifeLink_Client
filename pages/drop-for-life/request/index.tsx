import Head from "next/head";
import LeftSidebar from "../../../components/DFL/Request/LeftSidebar";
import DonorCard from "../../../components/DFL/Request/DonorCard";
import PaginationComponent from "../../../components/Pagination/Pagination";

import style from "../../../styles/DFL/request.module.scss";

import { useEffect } from "react";
import { useAppDispatch } from "../../../store/store";
import { DonorForm } from "../../../interfaces/Forms";
import { fetchData } from "../../../store/slices/pagination";
import { Doctor } from "../../../interfaces/Doctor";

export default function Request(): React.JSX.Element {
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      dispatch(
        fetchData({
          latlng: `${latitude},${longitude}`,
          page: 1,
          type: "donor",
        })
      );
    });
  }, []);

  const renderItem = (donor: Partial<Doctor | DonorForm>) => (
    <DonorCard donor={donor as DonorForm} key={donor._id} />
  );

  return (
    <div className={style.request_container}>
      <Head>
        <title>Donor Request Page</title>
        <meta name="description" content="User can find donor " />
      </Head>
      <LeftSidebar />

      <div className={style.card_container}>
        <PaginationComponent type="donor" renderItem={renderItem} />
      </div>
    </div>
  );
}
