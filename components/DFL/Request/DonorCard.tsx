import Model from "../../Timeslots/Model";
import axios from "axios";
import toast from "react-hot-toast";
import { capitalize } from "../../../utils/heplerFunction";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { BASE_URL } from "../../../utils/config";
import { DonorForm, RequestMessageForm } from "../../../interfaces/Forms";

import style from "../../../styles/DFL/request.module.scss";
import { requestFormValidation } from "../../../utils/formValidation";

export default function DonorCard({
  donor,
}: {
  donor: DonorForm;
}): React.JSX.Element {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const initalForm: RequestMessageForm = {
    name: "",
    phone: "",
    address: "",
    message: "",
  };

  const [formData, setFormData] = useState<RequestMessageForm>(initalForm);
  const [errors, setErrors] = useState<Partial<RequestMessageForm>>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function for set Phone number of selected donor
  const handleContactDonor = (phone: string) => {
    setDialogOpen(true);
    setPhone(phone);
  };

  // Function for close model and set form data empty
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData(initalForm);
  };

  // Function for set Error message when fouce get change
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formErrors = requestFormValidation({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof RequestMessageForm] || "",
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Donor number is not select!!");
      return null;
    }

    const data = {
      ...formData,
      donorPhone: phone,
    };

    const formError = requestFormValidation(formData);
    setErrors(formError);

    if (Object.keys(formError).length === 0) {
      try {
        await axios.post(`${BASE_URL}/donor/sendSMS`, data);
        setDialogOpen(false);
        setFormData(initalForm);
        toast.success("Message send Succefully!");
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);
        return null;
      }
    }
  };

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
        <button
          className="button"
          onClick={() => handleContactDonor(donor.phone)}
        >
          Contact Donor
        </button>
      </div>
      <Model open={dialogOpen}>
        <div className={style.contect__model}>
          <form>
            <div>
              <label htmlFor="bloodType">Name :</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                placeholder="Enter your name"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            {errors.name && <p>{errors.name}</p>}

            <div>
              <label htmlFor="bloodType">Phone :</label>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                placeholder="Enter your phone no"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            {errors.phone && <p>{errors.phone}</p>}

            <div>
              <label htmlFor="adress">Address :</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                placeholder="Enter  address"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            {errors.address && <p>{errors.address}</p>}

            <div>
              <label htmlFor="city">Message :</label>
              <textarea
                name="message"
                rows={2}
                value={formData.message}
                placeholder="Enter message for doner "
                onChange={handleChange}
              />
            </div>
            <button
              className={style.search_button}
              type="submit"
              onClick={handleSubmit}
            >
              Send Message
            </button>
          </form>
        </div>
        <div
          className="absolute top-2 right-1 p-3 cursor-pointer text-red-600"
          onClick={handleCloseDialog}
        >
          <FaTimes />
        </div>
      </Model>
    </div>
  );
}
