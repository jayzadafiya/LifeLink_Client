import axios from "axios";
import toast from "react-hot-toast";
import MedicalInfoForm from "@/components/DFL/Donate/MedicalInfoForm";
import PersonalInfoForm from "@/components/DFL/Donate/PersonalInfoForm";
import { useState } from "react";
import { useSelector } from "react-redux";
import { donorFormValidation } from "@/utils/formValidation";
import { BASE_URL } from "@/utils/config";

import style from "../../../styles/DFL/donate.module.scss";

export default function Donate() {
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { user, accessToken } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    dob: "",
    city: "",
    phone: "",
    weight: "",
    disease: "",
    styling: "",
    surgery: "",
    addharCard: "",
    lastDonationDate: "",
    _id: user?._id || "",
    name: user?.name || "",
    email: user?.email || "",
    gender: user?.gender || "",
    address: user?.address || "",
    bloodType: user?.bloodType || "",
  });

  const handleChange = (name, value) => {
    const newValue = name === "phone" ? parseInt(value) : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const formErrors = donorFormValidation({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name] || "",
    }));
  };

  const handleSubmitPersonalInfo = (e) => {
    e.preventDefault();
    setShowMedicalForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formError = donorFormValidation(formData);
    setErrors(formError);

    if (Object.keys(formError).length === 0) {
      try {
        setLoading(true);
        const { data } = await axios.put(`${BASE_URL}/donor`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(data);

        toast.success("Thank you so much for become donor");

        setLoading(false);
      } catch (error) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);
        setLoading(false);
        return null;
      }
    }
  };
  return (
    <>
      <PersonalInfoForm
        formData={formData}
        onNextClick={handleSubmitPersonalInfo}
        onChange={handleChange}
        onBlur={handleBlur}
        errors={errors}
      />

      <div className={`${showMedicalForm ? "" : style.hidden}`}>
        <MedicalInfoForm
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onBlur={handleBlur}
          loading={loading}
          errors={errors}
        />
      </div>
    </>
  );
}
