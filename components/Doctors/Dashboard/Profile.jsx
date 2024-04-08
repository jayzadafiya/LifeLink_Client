import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../store/slices/userSlice";
import { HashLoader } from "react-spinners";
import { AiOutlineDelete } from "react-icons/ai";
import { uploadImageToCloudinary } from "@/utils/uploadCloudinary";

export default function Profile({ doctor }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { error, loading } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    bio: doctor?.bio || "",
    name: doctor?.name || "",
    email: doctor?.email || "",
    photo: doctor?.photo || "",
    about: doctor?.about || "",
    gender: doctor?.gender || "",
    timeSlots: doctor?.timeSlots || [
      { appointments_number: "", startingTime: "", endingTime: "" },
    ],
    bloodType: doctor?.bloodType || "",
    experiences: doctor?.experiences || [
      { startingDate: "", endingDate: "", position: "", place: "" },
    ],
    specialization: doctor?.specialization || "",
    qualifications: doctor?.qualifications || [
      { startingDate: "", endingDate: "", degree: "", university: "" },
    ],
    phone: doctor?.phone || "",
    fees: doctor?.fees || "",
  });

  if (error) {
    console.log(error);
    return <Error errMessgae={error} />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "phone" || name === "fees" ? parseInt(value) : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  console.log(formData);

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];

    const { url } = await uploadImageToCloudinary(file);

    setFormData({ ...formData, photo: url });
  };

  //reusable function for adding  item

  const addItem = (e, key) => {
    e.preventDefault();

    let item;

    if (key === "qualifications") {
      item = { startingDate: "", endingDate: "", degree: "", university: "" };
    } else if (key === "experiences") {
      item = { startingDate: "", endingDate: "", position: "", place: "" };
    } else if (key === "timeSlots") {
      item = { day: "", startingTime: "", endingTime: "" };
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...prevFormData[key], item],
    }));
  };

  //reusable function for deleting  item

  const deleteItem = (e, key, index) => {
    e.preventDefault();

    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: prevFormData[key].filter((_, i) => i !== index),
    }));
  };

  //reuable input change function
  const handleReuableInputChange = (event, key, index) => {
    const { name, value } = event.target;

    const newValue =
      key === "timeSlots" && name === "appointments_number"
        ? parseInt(value)
        : value;

    setFormData((prevFormData) => {
      const updateItems = [...prevFormData[key]];

      updateItems[index][name] = newValue;

      return { ...prevFormData, [key]: updateItems };
    });
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUser(formData)).then((result) => {
        if (result.payload && result.payload.data) {
          router.push("/doctors/profile");
        }
      });
    } catch (error) {
      console.log(error);

      return <Error errMessgae={error} />;
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
            onChange={handleInputChange}
          />
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
            value={formData.phone}
            onChange={handleInputChange}
          />
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
            maxLength={100}
          />
        </div>
        <div className="mb-5">
          <div className="grid  grid-cols-3 gap-5 mb-[30px]">
            <div>
              <p className="form__label">Gender</p>
              <select
                name="gender"
                className="form__input"
                onChange={handleInputChange}
                value={formData.gender}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <p className="form__label">Specialization</p>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
                className="form__input"
              >
                <option value="">Select</option>
                <option value="surgon">Surgon</option>
                <option value="neurologist">Neurologist</option>
                <option value="dermatologist">Dermatologist</option>
              </select>
            </div>
            <div>
              <p className="form__label">Appointment Fees</p>
              <input
                type="number"
                placeholder="100"
                name="fees"
                value={formData.fees}
                onChange={handleInputChange}
                className="form__input"
              />
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
                    />
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
                    />
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
                    />
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
                    />
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
                    />
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
                    />
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
                    />
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
                    />
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

          <button
            onClick={(e) => addItem(e, "experiences")}
            className="bg-[#000] p-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Experiences
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label ">Time Slots*</p>
          {formData.timeSlots?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4 mb-[30px] ">
                  <div>
                    <p className="form__label">Appointment num*</p>
                    <input
                      type="number"
                      placeholder="10"
                      name="appointments_number"
                      value={item.appointments_number}
                      onChange={(e) =>
                        handleReuableInputChange(e, "timeSlots", index)
                      }
                      className="form__input"
                    />
                  </div>
                  <div>
                    <p className="form__label">Starting Time*</p>
                    <input
                      type="time"
                      name="startingTime"
                      className="form__input"
                      value={item.startingTime}
                      onChange={(e) =>
                        handleReuableInputChange(e, "timeSlots", index)
                      }
                    />
                  </div>
                  <div>
                    <p className="form__label">Ending Time*</p>
                    <input
                      type="time"
                      name="endingTime"
                      className="form__input"
                      value={item.endingTime}
                      onChange={(e) =>
                        handleReuableInputChange(e, "timeSlots", index)
                      }
                    />
                  </div>
                  <div className="flex items-center ">
                    <button
                      onClick={(e) => deleteItem(e, "timeSlots", index)}
                      className="bg-red-600 p-2 rounded-full text-white text-[18px]   cursor-pointer mt-6 "
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={(e) => addItem(e, "timeSlots")}
            className="bg-[#000] p-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add TimeSlot
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea
            name="about"
            rows="5"
            placeholder="Write about you"
            className="form__input"
            onChange={handleInputChange}
            value={formData.about}
          ></textarea>
        </div>
        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[68px] h-[68px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center ">
              <Image
                src={formData.photo}
                alt=""
                className="rounded-full w-[68px] h-[68px]"
                height={68}
                width={68}
              />
            </figure>
          )}

          <div className="relative w-[138px] h-[58px]">
            <input
              type="file"
              name="photo"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg , .png"
              className="absolute top-0 left-0 w-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute  top-0 left-0 w-full h-full flex items-center px-[1.5rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
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
