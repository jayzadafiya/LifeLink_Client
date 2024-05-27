import axios from "axios";
import toast from "react-hot-toast";
import MedicalInfoForm from "../../../components/DFL/Donate/MedicalInfoForm";
import PersonalInfoForm from "../../../components/DFL/Donate/PersonalInfoForm";
import { useEffect, useState } from "react";
import style from "../../../styles/DFL/donate.module.scss";
import { useSelector } from "react-redux";
import { donorFormValidation } from "../../../utils/formValidation";
import { BASE_URL } from "../../../utils/config";

import { RootState } from "../../../store/store";
import { DonorForm } from "../../../interfaces/Forms";
import { GetServerSidePropsContext } from "next";
import Error from "../../../components/Error/Error";

interface DonateProp {
  donor: DonorForm;
  error: any;
}

export default function Donate({
  donor,
  error,
}: Partial<DonateProp>): React.JSX.Element {
  const [showMedicalForm, setShowMedicalForm] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<DonorForm>>({});

  const { user, accessToken } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState<DonorForm>({
    dob: donor?.dob || "",
    city: donor?.city || "",
    address: donor?.address || "",
    weight: donor?.weight || 0,
    disease: donor?.disease || "",
    styling: donor?.styling || "",
    surgery: donor?.surgery || "",
    addharCard: donor?.addharCard || "",
    lastDonationDate: donor?.addharCard || "",
    phone: donor?.phone || user?.phone || "",
    _id: donor?._id || user?._id || "",
    name: donor?.name || user?.name || "",
    email: donor?.email || user?.email || "",
    gender: donor?.gender || user?.gender || "",
    bloodType: donor?.bloodType || user?.bloodType || "",
  });

  if (error) {
    return <Error errMessage={error} />;
  }

  const handleChange = (name: string, value: string) => {
    const newValue = name === "weight" ? parseInt(value || "0") : value;
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
        await axios.put(`${BASE_URL}/donor`, formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

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

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: Partial<DonateProp> }> {
  try {
    const cookieToken = context.req.cookies.token;
    const { data } = await axios.get(`${BASE_URL}/donor/profile`, {
      headers: {
        Authorization: `Bearer ${cookieToken}`,
      },
    });
    return {
      props: { donor: data },
    };
  } catch (error: any) {
    return {
      props: {
        error:
          error?.response?.data?.message ||
          error?.message ||
          "Error fetching prescription data",
      },
    };
  }
}
