import { useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";

import style from "../../../styles/DFL/request.module.scss";

import { RootState, useAppDispatch } from "../../../store/store";
import { DonorSearchForm } from "../../../interfaces/Forms";
import { fetchData, setPrevData } from "../../../store/slices/pagination";

export default function LeftSidebar(): React.JSX.Element {
  const initalForm: DonorSearchForm = {
    city: "",
    address: "",
    bloodType: "",
  };

  const [formData, setFormData] = useState<DonorSearchForm>(initalForm);

  const { loading } = useSelector((state: RootState) => state.pagination);
  const dispatch = useAppDispatch();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setPrevData());
    dispatch(fetchData({ formData: formData, page: 1, type: "donor" }));
    setFormData(initalForm);
  };

  return (
    <div className={style.left_container}>
      <form>
        <div className={style.form_items}>
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
          <button
            className={style.search_button}
            type="submit"
            onClick={handleSearch}
          >
            {loading ? (
              <HashLoader size={15} color="#ffffff" />
            ) : (
              "Search Donor"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
