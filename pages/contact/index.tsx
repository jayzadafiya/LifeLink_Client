import { PayloadAction } from "@reduxjs/toolkit";
import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { contactFormValidation } from "../../utils/formValidation";
import { ContactForm } from "../../interfaces/Forms";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { HashLoader } from "react-spinners";

export default function Contact(): React.JSX.Element {
  const [formData, setFormData] = useState<ContactForm>({
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Partial<ContactForm>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handelInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value }: { name: string; value: string } = e.target;
    const formErrors = contactFormValidation({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof ContactForm] || "", // Clear previous errors for this field
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formErrors = contactFormValidation(formData);
    setErrors(formErrors);

    if (!loading && Object.keys(formErrors).length === 0) {
      try {
        await axios.post(`${BASE_URL}/contact`, formData);
        setLoading(false);
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);
        setLoading(false);

        return null;
      }
    }
    setLoading(false);
  };
  return (
    <section>
      <Head>
        <title>Contact Us</title>
        <meta name="description" content="Contact us page" />
      </Head>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center  text__para">
          Get a technical issue? Want to send feedback about a beta feature? Let
          us know
        </p>
        <form>
          <div className="mb-5">
            <label htmlFor="" className="from__label">
              Your Email
            </label>
            <input
              type="email"
              className="form__input mt-1"
              name="email"
              placeholder="example@gmail.com"
              onBlur={handleBlur}
              onChange={handelInputChange}
              value={formData.email}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div className="mb-5">
            <label htmlFor="" className="from__label">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              className="form__input mt-1"
              placeholder="Let us know how we can help you"
              onBlur={handleBlur}
              onChange={handelInputChange}
              value={formData.subject}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
          <div className="sm:col-span-2 mb-5">
            <label htmlFor="" className="from__label">
              Your Message
            </label>
            <textarea
              rows={6}
              className="form__input mt-1"
              name="message"
              placeholder="Leave a comment...."
              onBlur={handleBlur}
              onChange={handelInputChange}
              value={formData.message}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message}</p>
            )}
          </div>
          <button
            className="btn rounded sm:w-fit"
            type="submit"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Submit"}
          </button>
        </form>
      </div>
    </section>
  );
}
