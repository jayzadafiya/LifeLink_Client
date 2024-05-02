import DonorCard from "./DonorCard";
import { useSelector } from "react-redux";

import style from "../../../styles/DOL/request.module.scss";

export default function RightSidePanal({}) {
  const { donorData } = useSelector((state) => state.user);
  return (
    <div className={style.right_container}>
      {donorData && donorData.length === 0 && (
        <p className="title">No Donor found for given address and bloodType</p>
      )}

      {donorData &&
        donorData?.map((donor, index) => (
          <DonorCard donor={donor} key={index} />
        ))}
    </div>
  );
}
