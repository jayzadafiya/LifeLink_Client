import MedicalInfoForm from "@/components/DfL/Donate/MedicalInfoForm";
import PersonalInfoForm from "@/components/DfL/Donate/PersonalInfoForm";
import { BASE_URL } from "@/utils/config";
import { donorFormValidation } from "@/utils/formValidation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function Donate() {
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { user, accessToken } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    dob: "",
    name: "",
    city: "",
    email: "",
    phone: "",
    weight: "",
    gender: "",
    address: "",
    surgery: "",
    disease: "",
    styling: "",
    bloodType: "",
    addharCard: "",
    lastDonationDate: "",
  });

  useEffect(() => {
    console.log("object");
    setFormData((prev) => ({ ...prev, ...user }));
  }, [user]);

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
    <div>
      <PersonalInfoForm
        formData={formData}
        onNextClick={handleSubmitPersonalInfo}
        onChange={handleChange}
        onBlur={handleBlur}
        errors={errors}
      />

      <div className={`${showMedicalForm ? "" : "hidden"}`}>
        <MedicalInfoForm
          formData={formData}
          onSubmit={handleSubmit}
          onChange={handleChange}
          onBlur={handleBlur}
          loading={loading}
          errors={errors}
        />
      </div>
    </div>
  );
}
