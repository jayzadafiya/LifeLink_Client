import axios from "axios";
import toast from "react-hot-toast";
import { RootState, useAppDispatch } from "../../store/store";
import { useRouter } from "next/router";
import { useState } from "react";
import { UpdatePasswordForm } from "../../interfaces/Forms";
import { updatePasswordFormvalidation } from "../../utils/formValidation";
import { PayloadAction } from "@reduxjs/toolkit";
import { updatePassword } from "../../store/slices/userSlice";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { BASE_URL } from "../../utils/config";

export default function PasswrodUpdate(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, role, accessToken } = useSelector(
    (state: RootState) => state.user
  );
  const [errors, setErrors] = useState<Partial<UpdatePasswordForm>>({});
  const [formData, setFormData] = useState<UpdatePasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handelInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const formErrors = updatePasswordFormvalidation({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof UpdatePasswordForm] || "",
    }));
  };

  const handelSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formError = updatePasswordFormvalidation(formData);
    setErrors(formError);

    if (Object.keys(formError).length === 0) {
      try {
        dispatch(updatePassword(formData)).then(
          (result: PayloadAction<{ token: string }>) => {
            if (result.payload && result.payload.token) {
              router.push(
                `/${role === "doctor" ? "doctors" : "users"}/profile`
              );
            }
          }
        );
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);

        return null;
      }
    }
  };

  const handleForgotPassword = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Reset link send to registered mail");
    } catch (error: any) {
      const err = error?.response?.data?.message || error?.message;
      toast.error(err);

      return null;
    }
  };

  return (
    <div className="mt-10 ">
      <form className="w-[90%]" onSubmit={handelSubmit}>
        <div className="mb-5">
          <p className="form__label">Old Password*</p>
          <input
            type="text"
            placeholder="Old Password"
            name="oldPassword"
            onBlur={handleBlur}
            value={formData.oldPassword}
            onChange={handelInputChange}
            className="form__input "
          />
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>
          )}
        </div>
        <div className="mb-5">
          <p className="form__label">New Password*</p>
          <input
            type="password"
            placeholder="New Password"
            name="newPassword"
            value={formData.newPassword}
            onBlur={handleBlur}
            onChange={handelInputChange}
            className="form__input"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
          )}
        </div>
        <div className="mb-5">
          <p className="form__label">Confirm Password*</p>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onBlur={handleBlur}
            onChange={handelInputChange}
            className="form__input"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div className="text-right">
          <button
            className="text-[16px]  hover:font-bold hover:text-primaryColor"
            onClick={handleForgotPassword}
          >
            Forgot Password??
          </button>
        </div>
        <div className="mt-7">
          <button
            disabled={loading && true}
            className="btn w-full rounded-md btn-hover"
            type="submit"
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
