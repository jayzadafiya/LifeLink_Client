import axios from "axios";
import toast from "react-hot-toast";
import MedicalInfoForm from "../../../components/DFL/Donate/MedicalInfoForm";
import PersonalInfoForm from "../../../components/DFL/Donate/PersonalInfoForm";
import { useState } from "react";
import style from "../../../styles/DFL/donate.module.scss";
import { useSelector } from "react-redux";
import { donorFormValidation } from "../../../utils/formValidation";
import { BASE_URL } from "../../../utils/config";

import { RootState } from "../../../store/store";
import { DonorForm } from "../../../interfaces/Forms";

export default function Donate(): React.JSX.Element {
  const [showMedicalForm, setShowMedicalForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<DonorForm>>({});

  const { user, accessToken } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<DonorForm>({
    dob: "",
    city: "",
    phone: "",
    address: "",
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
    bloodType: user?.bloodType || "",
  });

  const handleChange = (name: string, value: string) => {
    const newValue = name === "phone" ? parseInt(value) : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    const formErrors = donorFormValidation({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof DonorForm] || "",
    }));
  };

  const handleSubmitPersonalInfo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowMedicalForm(true);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
      } catch (error: any) {
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
