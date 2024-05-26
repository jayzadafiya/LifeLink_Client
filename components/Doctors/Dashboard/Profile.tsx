import Image from "next/image";
import toast from "react-hot-toast";
import axios, { AxiosResponse } from "axios";

import {
  createTimeSlot,
  findUpdatedTimeSlots,
} from "../../../utils/heplerFunction";

import {
  doctorValidateForm,
  handleNestedInputValidation,
} from "../../../utils/formValidation";

import {
  Doctor,
  Experience,
  QTE,
  Qualification,
  TimeSlot,
  TimeslotCreated,
} from "../../../interfaces/Doctor";

import {
  DoctorForm,
  NestedDoctorForm,
  ValidationErrors,
} from "../../../interfaces/Forms";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../../../utils/uploadCloudinary";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { AiOutlineDelete } from "react-icons/ai";
import { RootState, useAppDispatch } from "../../../store/store";
import { BASE_URL } from "../../../utils/config";

export default function Profile({
  doctor,
  setTab,
}: {
  doctor: Doctor;
  setTab: (tab: string) => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, accessToken } = useSelector(
    (state: RootState) => state.user
  );
  const [errors, setErrors] = useState<Partial<DoctorForm>>({});
  const [nestedErrors, setNestedErrors] = useState<Partial<ValidationErrors>>(
    {}
  );
  const [formData, setFormData] = useState<Doctor>({
    bio: doctor?.bio || "",
    name: doctor?.name || "",
    email: doctor?.email || "",
    photo: doctor?.photo || "",
    about: doctor?.about || "",
    gender: doctor?.gender || "",
    address: doctor?.address || "",
    timeSlots_data: doctor?.timeSlots_data || [
      { slot: "", appointments_time: 0, startingTime: "", endingTime: "" },
    ],
    experiences: doctor?.experiences || [
      { startingDate: "", endingDate: "", position: "", place: "" },
    ],
    specialization: doctor?.specialization || "",
    qualifications: doctor?.qualifications || [
      { startingDate: "", endingDate: "", degree: "", university: "" },
    ],
    phone: doctor?.phone || "",
    fees: doctor?.fees || 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newValue = name === "fees" ? parseInt(value) : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const formErrors = doctorValidateForm({ ...formData, [name]: value });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof DoctorForm] || "", // Clear previous errors for this field
    }));
  };

  const handleFileInputChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
    e.preventDefault();
    if (type !== "remove") {
      const inputElement = e.target as HTMLInputElement;
      const files = inputElement.files;
      if (files && files.length > 0) {
        const file = files[0];

        const { url, public_id } = await uploadImageToCloudinary(file);
        setFormData({ ...formData, photo: url });
      }
    }

    if (type !== "input") {
      if (formData.photo) await deleteImageFromCloudinary(formData.photo);
    }

    if (type === "remove") {
      setFormData({ ...formData, photo: "" });
    }
  };

  //reusable function for adding  item
  const addItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: keyof Partial<Doctor>
  ) => {
    e.preventDefault();

    let item: any;

    if (key === "qualifications") {
      item = { startingDate: "", endingDate: "", degree: "", university: "" };
    } else if (key === "experiences") {
      item = { startingDate: "", endingDate: "", position: "", place: "" };
    } else if (key === "timeSlots_data") {
      item = {
        slot: "",
        appointments_time: "",
        startingTime: "",
        endingTime: "",
      };
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...(prevFormData[key] as QTE), item],
    }));
  };

  //reusable function for deleting  item
  const deleteItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: keyof Partial<Doctor>,
    index: number
  ) => {
    e.preventDefault();

    setFormData((prevFormData) => {
      const data = prevFormData[key] as Array<
        Qualification | TimeSlot | Experience
      >;
      return {
        ...prevFormData,
        [key]: data.filter((_, i) => i !== index),
      };
    });
  };

  //reuable input change function
  const handleReuableInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    key: keyof Doctor,
    index: number
  ) => {
    const { name, value } = event.target;

    const newValue =
      key === "timeSlots_data" && name === "appointments_time"
        ? parseInt(value)
        : value;

    if (name === "endingDate") {
      const date = new Date(value);
      const data = (formData[key] as Array<Qualification | Experience>)?.[
        index
      ];

      if (!data.startingDate) {
        nestedErrors.startingDate = {
          message: "Please provied first starting date",
          index,
          key,
        };
      }

      const staringDate = new Date(data.startingDate);
      if (staringDate >= date) {
        nestedErrors.startingDate = {
          message: "Please provied valid starting date",
          index,
          key,
        };
      }
    }

    setFormData((prevFormData) => {
      const updateItems = [...(prevFormData[key] as QTE)];

      // (updateItems[index] as Partial<Qualification | TimeSlot | Experience>)[
      //   name as keyof Partial<Qualification | TimeSlot | Experience>
      // ] = newValue;

      updateItems[index] = {
        ...updateItems[index],
        [name as keyof Partial<Qualification | TimeSlot | Experience>]:
          newValue,
      };

      return { ...prevFormData, [key]: updateItems };
    });
  };

  const handleReusableBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    key: keyof Doctor,
    index: number
  ) => {
    const { name, value } = e.target;

    const updateItems = (formData[key] as QTE)[index];

    const formErrors = handleNestedInputValidation(
      { ...updateItems, [key]: value } as NestedDoctorForm,
      index,
      key
    );

    setNestedErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name] || "", // Clear previous errors for this field
    }));
  };

  const updateProfileHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const formErrors = doctorValidateForm(formData);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const updatedFormData = { ...formData } as Doctor;
        const newTimeSlotsData = findUpdatedTimeSlots(
          doctor.timeSlots_data,
          formData.timeSlots_data
        );
        let data: { formData: Doctor; timeSlots?: TimeslotCreated[] };

        let deleteRequests: Promise<AxiosResponse<any>>[] = [];

        if (newTimeSlotsData.length > 0) {
          if (doctor?.timeSlots_data && doctor?.timeSlots_data?.length > 0) {
            newTimeSlotsData.forEach(async (timeslot) => {
              // Delete timeslot because doctor dont want to get appointment for this time slots
              deleteRequests = await axios.delete(
                `${BASE_URL}/timeslot/${doctor._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                  data: { slotPhase: timeslot.slot },
                }
              );
            });
          }

          await Promise.all(deleteRequests);

          data = {
            formData: updatedFormData,
            timeSlots: createTimeSlot(newTimeSlotsData),
          };
        } else {
          // No need to update time slots
          data = {
            formData: updatedFormData,
          };
        }

        // dispatch(updateUser(data)).then(
        //   (result: PayloadAction<{ data: Doctor }>) => {
        //     if (result.payload && result.payload.data) {
        //       router.push("/doctors/profile");
        //     }
        //   }
        // );

        await axios.put(`${BASE_URL}/update-doctor/${doctor._id}`, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        toast.success(`Update request send succefully`);
        setTab("overview");
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);
        return null;
      }
    }
  };

  return (
    <div>
      <h2 className="text-headingColor text-[24px] font-bold leading-9 mb-10">
        Profile Information
      </h2>

      <form>
        <div className="mb-5">
          <p className="form__label">Name*</p>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form__input"
            value={formData.name}
            onBlur={handleBlur}
            onChange={handleInputChange}
          />
          {errors.name && (
            <p className="text-red-500 text-md  mb-4">{errors.name}</p>
          )}
        </div>
        <div className="mb-5">
          <p className="form__label">Email*</p>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form__input"
            value={formData.email}
            readOnly
            aria-readonly
          />
        </div>
        <div className="mb-5">
          <p className="form__label">Phone*</p>
          <input
            type="number"
            name="phone"
            placeholder="Phone Number"
            className="form__input"
            onBlur={handleBlur}
            value={formData.phone}
            onChange={handleInputChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-md  mb-4">{errors.phone}</p>
          )}
        </div>
        <div className="mb-5">
          <p className="form__label">Bio*</p>
          <input
            type="text"
            name="bio"
            placeholder="Bio"
            className="form__input"
            value={formData.bio}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength={100}
          />
          {errors.bio && (
            <p className="text-red-500 text-md  mb-4">{errors.bio}</p>
          )}
        </div>
        <div className="mb-5">
          <p className="form__label">Address*</p>
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="form__input"
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleBlur}
            maxLength={100}
          />
          {errors.address && (
            <p className="text-red-500 text-md  mb-4">{errors.address}</p>
          )}
        </div>
        <div className="mb-5">
          <div className="grid  grid-cols-3 gap-5 mb-[30px]">
            <div>
              <p className="form__label">Gender</p>
              <select
                name="gender"
                className="form__input"
                onChange={handleInputChange}
                onBlur={handleBlur}
                value={formData.gender}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-md  mb-4">{errors.gender}</p>
              )}
            </div>
            <div>
              <p className="form__label">Specialization</p>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="form__input "
              >
                <option value="">Select</option>
                <option value="allergist">Allergist/Immunologist</option>
                <option value="anesthesiologist">Anesthesiologist</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="dermatologist">Dermatologist</option>
                <option value="endocrinologist">Endocrinologist</option>
                <option value="gastroenterologist">Gastroenterologist</option>
                <option value="hematologist">Hematologist</option>
                <option value="infectious_disease_specialist">
                  Infectious Disease Specialist
                </option>
                <option value="nephrologist">Nephrologist</option>
                <option value="neurologist">Neurologist</option>
                <option value="ob_gyn">
                  Obstetrician/Gynecologist (OB/GYN)
                </option>
                <option value="oncologist">Oncologist</option>
                <option value="ophthalmologist">Ophthalmologist</option>
                <option value="orthopedic_surgeon">Orthopedic Surgeon</option>
                <option value="otolaryngologist">
                  Otolaryngologist (ENT Specialist)
                </option>
                <option value="pediatrician">Pediatrician</option>
                <option value="psychiatrist">Psychiatrist</option>
                <option value="pulmonologist">Pulmonologist</option>
                <option value="rheumatologist">Rheumatologist</option>
                <option value="urologist">Urologist</option>
              </select>
              {errors.specialization && (
                <p className="text-red-500 text-md  mb-4">
                  {errors.specialization}
                </p>
              )}
            </div>
            <div>
              <p className="form__label">Appointment Fees</p>
              <input
                type="number"
                placeholder="100"
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="form__input"
              />
              {errors.fees && (
                <p className="text-red-500 text-md  mb-4">{errors.fees}</p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-5">
          <p className="form__label ">Qualifications*</p>
          {formData.qualifications?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <p className="form__label ">Starting Date*</p>
                    <input
                      type="date"
                      name="startingDate"
                      className="form__input"
                      value={item.startingDate}
                      onChange={(e) =>
                        handleReuableInputChange(e, "qualifications", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "qualifications", index)
                      }
                    />
                    {nestedErrors.startingDate &&
                      nestedErrors.startingDate.key === "qualifications" &&
                      index === nestedErrors.startingDate?.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.startingDate.message}
                        </p>
                      )}
                  </div>
                  <div>
                    <p className="form__label">Ending Date*</p>
                    <input
                      type="date"
                      name="endingDate"
                      className="form__input"
                      value={item.endingDate}
                      onChange={(e) =>
                        handleReuableInputChange(e, "qualifications", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "qualifications", index)
                      }
                    />
                    {nestedErrors.endingDate &&
                      nestedErrors.endingDate.key === "qualifications" &&
                      index === nestedErrors.endingDate?.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.endingDate.message}
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 ">
                  <div>
                    <p className="form__label">Degree*</p>
                    <input
                      type="text"
                      name="degree"
                      className="form__input"
                      value={item.degree}
                      onChange={(e) =>
                        handleReuableInputChange(e, "qualifications", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "qualifications", index)
                      }
                    />
                    {nestedErrors.degree &&
                      index === nestedErrors.degree?.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.degree.message}
                        </p>
                      )}
                  </div>
                  <div>
                    <p className="form__label">University*</p>
                    <input
                      type="text"
                      name="university"
                      className="form__input"
                      value={item.university}
                      onChange={(e) =>
                        handleReuableInputChange(e, "qualifications", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "qualifications", index)
                      }
                    />
                    {nestedErrors.university &&
                      index === nestedErrors.university.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.university.message}
                        </p>
                      )}
                  </div>
                </div>

                <button
                  onClick={(e) => deleteItem(e, "qualifications", index)}
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]  cursor-pointer"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          {errors.qualifications && (
            <p className="text-red-500 text-md  mb-4">
              {errors.qualifications}
            </p>
          )}
          <button
            onClick={(e) => addItem(e, "qualifications")}
            className="bg-[#000] p-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Qualification
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label">Experiences*</p>
          {formData.experiences?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5 mb-5">
                  <div>
                    <p className="form__label">Starting Date*</p>
                    <input
                      type="date"
                      name="startingDate"
                      className="form__input"
                      value={item.startingDate}
                      onChange={(e) =>
                        handleReuableInputChange(e, "experiences", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "experiences", index)
                      }
                    />
                    {nestedErrors.startingDate &&
                      nestedErrors.startingDate.key === "experiences" &&
                      index === nestedErrors.startingDate?.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.startingDate.message}
                        </p>
                      )}
                  </div>
                  <div>
                    <p className="form__label">Ending Date*</p>
                    <input
                      type="date"
                      name="endingDate"
                      className="form__input"
                      value={item.endingDate}
                      onChange={(e) =>
                        handleReuableInputChange(e, "experiences", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "experiences", index)
                      }
                    />
                    {nestedErrors.endingDate &&
                      nestedErrors.endingDate.key === "experiences" &&
                      index === nestedErrors.endingDate?.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.endingDate.message}
                        </p>
                      )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5 ">
                  <div>
                    <p className="form__label">Position*</p>
                    <input
                      type="text"
                      name="position"
                      className="form__input"
                      value={item.position}
                      onChange={(e) =>
                        handleReuableInputChange(e, "experiences", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "experiences", index)
                      }
                    />
                    {nestedErrors.position &&
                      index === nestedErrors.position.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.position.message}
                        </p>
                      )}
                  </div>
                  <div>
                    <p className="form__label">Place*</p>
                    <input
                      type="text"
                      name="place"
                      className="form__input"
                      value={item.place}
                      onChange={(e) =>
                        handleReuableInputChange(e, "experiences", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "experiences", index)
                      }
                    />
                    {nestedErrors.place &&
                      index === nestedErrors.place.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.place.message}
                        </p>
                      )}
                  </div>
                </div>

                <button
                  onClick={(e) => deleteItem(e, "experiences", index)}
                  className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px]  cursor-pointer"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          {errors.experiences && (
            <p className="text-red-500 text-md  mb-4">{errors.experiences}</p>
          )}
          <button
            onClick={(e) => addItem(e, "experiences")}
            className="bg-[#000] p-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Experiences
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label ">Time Slots*</p>
          {formData.timeSlots_data?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-3 gap-5 md:grid-cols-5 mb-[30px] ">
                  <div>
                    <p className="form__label">Slot*</p>
                    <select
                      name="slot"
                      className="form__input"
                      onChange={(e) =>
                        handleReuableInputChange(e, "timeSlots_data", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "timeSlots_data", index)
                      }
                      value={item.slot}
                    >
                      <option value="">Select</option>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>

                    {nestedErrors.slot && index === nestedErrors.slot.index && (
                      <p className="text-red-500 text-md  mb-4">
                        {nestedErrors.slot.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="form__label">Number*</p>
                    <input
                      type="number"
                      placeholder="10"
                      name="appointments_time"
                      value={item.appointments_time}
                      onChange={(e) =>
                        handleReuableInputChange(e, "timeSlots_data", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "timeSlots_data", index)
                      }
                      className="form__input"
                    />
                    {nestedErrors.appointments_time &&
                      index === nestedErrors.appointments_time.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.appointments_time.message}
                        </p>
                      )}
                  </div>
                  <div>
                    <p className="form__label">Starting Time*</p>
                    <input
                      type="time"
                      name="startingTime"
                      className="form__input"
                      value={item.startingTime}
                      onChange={(e) =>
                        handleReuableInputChange(e, "timeSlots_data", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "timeSlots_data", index)
                      }
                    />
                    {nestedErrors.startingTime &&
                      index === nestedErrors.startingTime.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.startingTime.message}
                        </p>
                      )}
                  </div>
                  <div>
                    <p className="form__label">Ending Time*</p>
                    <input
                      type="time"
                      name="endingTime"
                      className="form__input"
                      value={item.endingTime}
                      onChange={(e) =>
                        handleReuableInputChange(e, "timeSlots_data", index)
                      }
                      onBlur={(e) =>
                        handleReusableBlur(e, "timeSlots_data", index)
                      }
                    />
                    {nestedErrors.endingTime &&
                      index === nestedErrors.endingTime.index && (
                        <p className="text-red-500 text-md  mb-4">
                          {nestedErrors.endingTime.message}
                        </p>
                      )}
                  </div>
                  <div className="flex items-center ">
                    <button
                      onClick={(e) => deleteItem(e, "timeSlots_data", index)}
                      className="bg-red-600 p-2 rounded-full text-white text-[18px]   cursor-pointer mt-6 "
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {errors.timeSlots_data && (
            <p className="text-red-500 text-md  mb-4">
              {errors.timeSlots_data}
            </p>
          )}
          <button
            onClick={(e) => addItem(e, "timeSlots_data")}
            className="bg-[#000] p-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add TimeSlot
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea
            name="about"
            rows={5}
            placeholder="Write about you"
            className="form__input"
            onChange={handleInputChange}
            onBlur={handleBlur}
            value={formData.about}
          ></textarea>
          {errors.about && (
            <p className="text-red-500 text-md  mb-4">{errors.about}</p>
          )}
        </div>
        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[68px] h-[68px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center cursor-pointer ">
              <input
                type="file"
                name="photo"
                id="customFile"
                onChange={(e) => handleFileInputChange(e, "edit")}
                accept=".jpg , .png"
                className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
              />
              <label htmlFor="customFile" className="">
                <Image
                  src={formData.photo}
                  alt=""
                  className="rounded-full w-[68px] h-[68px]"
                  height={68}
                  width={68}
                />
              </label>
            </figure>
          )}

          <div className="relative w-[138px] h-[58px]">
            {formData.photo ? (
              <button
                type="submit"
                onClick={(e) => handleFileInputChange(e, "remove")}
                className="h-full flex items-center px-[1.5rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#ff000046] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
              >
                Remove Photo
              </button>
            ) : (
              <>
                <input
                  type="file"
                  name="photo"
                  id="customFile"
                  onChange={(e) => handleFileInputChange(e, "input")}
                  accept=".jpg , .png"
                  className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
                />
                <label
                  htmlFor="customFile"
                  className="absolute  top-0 left-0 w-full h-full flex items-center px-[1.5rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
                >
                  Upload Photo
                </label>
              </>
            )}
          </div>
        </div>
        <div className="mt-7">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg"
          >
            {loading ? (
              <HashLoader size={25} color="#ffffff" />
            ) : (
              "Update Profile"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
