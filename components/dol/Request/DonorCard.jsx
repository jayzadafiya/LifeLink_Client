import { capitalize } from "@/utils/heplerFunction";
import style from "../../../styles/DOL/request.module.scss";

export default function DonorCard({ donor }) {
  return (
    <div className={style.card}>
      <div className={style.inner}>
        <span>{capitalize(donor.bloodType)}</span>
        <h2>{donor.name}</h2>
        <p>
          <strong>Address: </strong> {donor.address}.
        </p>
        <ul className={style.features}>
          <li>
            <strong>city:</strong> {donor.city}
          </li>
          <li>
            <strong>DOB:</strong>
            {donor.dob}
          </li>
          <li>
            <strong>Phone:</strong>
            {donor.phone}
          </li>
        </ul>
        <button className="button"> Emergency</button>
      </div>
    </div>
  );
}
