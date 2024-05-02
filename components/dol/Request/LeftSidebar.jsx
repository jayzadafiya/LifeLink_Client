import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDonorData } from "@/store/slices/userSlice";
import { HashLoader } from "react-spinners";

import style from "../../../styles/DOL/request.module.scss";

export default function LeftSidebar() {
  const initalForm = {
    city: "",
    address: "",
    bloodType: "",
  };

  const [formData, setFormData] = useState(initalForm);

  const { loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchDonorData({ formData: formData }));

    setFormData(initalForm);
  };
  return (
    <div className={style.left_container}>
      <form>
        <div className="form-items">
          <label htmlFor="bloodType">BloodType :</label>
          <select
            name="bloodType"
            required
            value={formData.bloodType}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <label htmlFor="adress">Address :</label>
          <input
            type="text"
            name="address"
            required
            value={formData.address}
            placeholder="Enter  address"
            onChange={handleChange}
          />

          <label htmlFor="city">City :</label>
          <input
            type="text"
            id="city"
            name="city"
            required
            value={formData.city}
            placeholder="Enter city name"
            onChange={handleChange}
          />
        </div>
        <button
          className={style.search_button}
          type="submit"
          onClick={handleSearch}
        >
          {loading ? <HashLoader size={25} color="#ffffff" /> : "Search Donor"}
        </button>
      </form>
    </div>
  );
}
