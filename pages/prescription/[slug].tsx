import toast from "react-hot-toast";
import axios from "axios";
import Error from "../../components/Error/Error";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { AiOutlineDelete } from "react-icons/ai";
import { PrescriptionForm } from "../../interfaces/Forms";
import { capitalize } from "../../utils/heplerFunction";
import { BASE_URL } from "../../utils/config";
import { GetServerSidePropsContext } from "next";
import { Medicine, PrescriptionFormData } from "../../interfaces/Doctor";
import { prescriptionFormValidation } from "../../utils/formValidation";
import { PayLoad } from "../../interfaces/User";

interface PrescritonProps {
  prescriptionId: string;
  prescriptionData: PrescriptionFormData;
  errors: any;
}
export default function Prescription({
  prescriptionId,
  errors,
  prescriptionData,
}: PrescritonProps): React.JSX.Element {
  const router = useRouter();
  const { appointmentData } = useSelector((state: RootState) => state.doctor);

  const [formData, setFormData] = useState({
    symptoms: prescriptionData.symptoms || [""],
    advice: prescriptionData.advice || [""],
    test: prescriptionData.test || [""],
    medicine: prescriptionData.medicine || [
      { name: "", dailyTime: "", mealTime: "", totalMedicine: 0 },
    ],
  });

  const [error, setError] = useState<Partial<PrescriptionForm>>({});
  const [role, setRole] = useState<string>("");
  const pdfRef = useRef<HTMLDivElement>(null);
  const { slug } = router.query;
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwt.decode(token) as PayLoad;
      setRole(decodedToken.role);
    }
  }, []);

  if (errors) {
    return <Error errMessage={errors} />;
  }

  // Function for add items to formData
  const addItem = (key: string) => {
    let item: any;

    if (role !== "doctor") {
      return null;
    }

    if (key === "medicine") {
      item = {
        name: "",
        dailyTime: "",
        mealTime: "",
        totalMedicen: 0,
      };

      setFormData((prevFormData) => ({
        ...prevFormData,
        medicine: [...prevFormData.medicine, item],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key as keyof PrescriptionFormData], ""],
      }));
    }
  };

  // Function for delete items to formData
  const deleteItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    key: string,
    index: number
  ) => {
    e.preventDefault();

    if (role !== "doctor") {
      return null;
    }

    setFormData((prev) => ({
      ...prev,
      [key]: prev[key as keyof PrescriptionFormData].filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleReuableInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    key: string,
    index: number
  ) => {
    const { name, value } = event.target;

    if (role !== "doctor") {
      return null;
    }

    setFormData((prevFormData) => {
      const updateItems = [...prevFormData[key as keyof PrescriptionFormData]];

      if (key === "medicine") {
        const newValue = name === "totalMedicine" ? parseInt(value) : value;

        updateItems[index] = {
          ...(updateItems[index] as Medicine),
          [name]: newValue,
        };
      } else {
        updateItems[index] = value;
      }

      return { ...prevFormData, [key]: updateItems };
    });
  };

  const handleReusableBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const formErrors = prescriptionFormValidation({
      ...formData,
      [name]: value,
    });
    setError((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name as keyof PrescriptionFormData] || "",
    }));
  };

  const handelSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    type: string
  ) => {
    e.preventDefault();

    const formErrors = prescriptionFormValidation(formData);
    setError(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        let prescription;
        if (type === "create") {
          prescription = await axios.post(
            `${BASE_URL}/prescription/${slug}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } else if (prescriptionId !== "" && type === "update") {
          prescription = await axios.patch(
            `${BASE_URL}/prescription/${slug}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        if (prescription) {
          router.replace("/doctors/profile");
        }
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);
        return null;
      }
    }
  };

  const handelDownload = () => {
    const input = pdfRef.current;

    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4", true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        pdf.addImage(imgData, "PNG", -35, 30, 280, imgHeight * ratio + 50);
        pdf.save("prescription.pdf");
      });
    }
  };

  return (
    <section ref={pdfRef}>
      <div className="container flex justify-center">
        <table className="min-w-[960px] h-[960px] border border-gray-500 ">
          <tbody>
            <tr className="h-[15%] border-b">
              <td colSpan={2}>
                <div className="header  leading-6 w-full flex h-full p-5 items-center justify-between bg-slate-200">
                  <div className="w-[50%] ml-3">
                    <p>
                      <strong>Doctor Name:</strong>
                      {appointmentData?.doctor?.name}
                    </p>
                    <p>
                      <strong>Fees:</strong>
                      {appointmentData?.fees}
                    </p>
                    <p>
                      <strong>Time:</strong>
                      {appointmentData?.time}
                    </p>
                    <p>
                      <strong>Date:</strong>
                      {appointmentData?.bookingDate}
                    </p>
                  </div>
                  <div className=" w-[30%]  flex ">
                    <div className="flex flex-col">
                      <strong>Patient </strong>
                      <strong>Gender</strong>
                      <strong>BloodType</strong>
                    </div>
                    <div className="flex flex-col">
                      <p>: {appointmentData?.user?.name}</p>
                      <p>: {appointmentData?.user?.gender}</p>
                      <p>: {appointmentData?.user?.bloodType || "-"}</p>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-[30%] p-4 border-r">
                <div className="grid grid-col-3 h-full">
                  {["symptoms", "test", "advice"].map((itemName, i) => (
                    <div key={i} className="flex flex-col">
                      <div className="h-[95%]">
                        <h4 className="w-full text-center p-1 text-white font-semibold bg-emerald-500">
                          {capitalize(itemName)}
                        </h4>
                        <ul className="symp list-disc ml-3">
                          {formData[itemName as keyof PrescriptionFormData].map(
                            (item, index) => (
                              <li
                                className="flex border-b mt-1 text-[15px]"
                                key={index}
                              >
                                <input
                                  name={itemName}
                                  type="text"
                                  className="pscForm__input w-full "
                                  value={typeof item === "string" ? item : ""}
                                  placeholder={`Add ${itemName}`}
                                  onChange={(e) =>
                                    handleReuableInputChange(e, itemName, index)
                                  }
                                  onBlur={(e) => handleReusableBlur(e)}
                                />

                                <button
                                  onClick={(e) =>
                                    deleteItem(e, itemName, index)
                                  }
                                  className="bg-red-600 p-1 rounded-full  text-white text-[16px] mt-1 mb-1   cursor-pointer "
                                >
                                  <AiOutlineDelete />
                                </button>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                      <div className=" flex my-2 items-center justify-between">
                        <button
                          className="bg-textColor px-2 rounded text-white h-fit cursor-pointer "
                          onClick={() => addItem(itemName)}
                        >
                          +
                        </button>
                        {error[itemName as keyof PrescriptionFormData] && (
                          <p className="text-red-500 text-md font-semibold  ">
                            {error[itemName as keyof PrescriptionFormData]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </td>
              <td className="w-[70%] p-4" valign="top">
                <div className="flex flex-col h-full">
                  <div className="h-[95%]">
                    <span className="text-[24px]">
                      R<sub>x</sub>
                    </span>
                    <hr />
                    <ol className=" list-decimal ml-3">
                      {formData.medicine?.map((item, index) => (
                        <li key={index} className="mb-5 border-b ">
                          <div className="flex gap-5  items-center mb-2 mt-3 border border-b-[1px] border-x-0 border-t-0">
                            <div className="w-[95%]">
                              <input
                                type="text"
                                name="name"
                                className="pscForm__input w-full "
                                value={item.name}
                                placeholder="Medicine Name"
                                onChange={(e) =>
                                  handleReuableInputChange(e, "medicine", index)
                                }
                                onBlur={handleReusableBlur}
                              />
                            </div>
                            <button
                              onClick={(e) => deleteItem(e, "medicine", index)}
                              className="bg-red-600 p-1 rounded-full  text-white text-[18px] mt-1 mb-1   cursor-pointer "
                            >
                              <AiOutlineDelete />
                            </button>
                          </div>
                          <div className="flex mt-3 ">
                            <div className="w-[40%]">
                              <select
                                name="mealTime"
                                className="pscForm__input w-full  appearance-none  "
                                value={item.mealTime}
                                onChange={(e) =>
                                  handleReuableInputChange(e, "medicine", index)
                                }
                                onBlur={handleReusableBlur}
                              >
                                <option value="">Select Meal time</option>
                                <option value="after-meal">After Meal</option>
                                <option value="before-meal">Before Meal</option>
                                <option value="any-time">Any Time</option>
                              </select>
                            </div>
                            <div className="w-[20%]">
                              <select
                                name="dailyTime"
                                className="pscForm__input  appearance-none border-l-2 w-full text-center"
                                value={item.dailyTime}
                                onChange={(e) =>
                                  handleReuableInputChange(e, "medicine", index)
                                }
                                onBlur={handleReusableBlur}
                              >
                                <option value="1-0-1">1 - 0 - 1</option>
                                <option value="1-1-1">1 - 1 - 1</option>
                                <option value="1-0-0">1 - 0 - 0</option>
                                <option value="0-0-1">0 - 0 - 1</option>
                                <option value="0-1-0">0 - 1 - 0</option>
                                <option value="1-1-0">1 - 1 - 0</option>
                                <option value="0-1-1">0 - 1 - 1</option>
                                <option value="1-0-1">1 - 0 - 1</option>
                                <option value="0-0-0">0 - 0 - 0</option>
                              </select>
                            </div>
                            <div className="w-[40%]">
                              <input
                                type="number"
                                name="totalMedicine"
                                className="pscForm__input border-l-2 "
                                value={item.totalMedicine}
                                placeholder="Total medicine number"
                                onChange={(e) =>
                                  handleReuableInputChange(e, "medicine", index)
                                }
                                onBlur={handleReusableBlur}
                              />
                            </div>
                          </div>
                          <hr />
                        </li>
                      ))}
                      <button
                        onClick={() => addItem("medicine")}
                        className="bg-slate-600 p-2 px-5 rounded text-white h-fit cursor-pointer"
                      >
                        Add Medicine
                      </button>
                    </ol>
                  </div>
                  <div className="ml-3 mt-2 flex  items-center justify-between">
                    {role === "doctor" && (
                      <>
                        <button
                          type="submit"
                          onClick={(e) =>
                            handelSubmit(
                              e,
                              prescriptionId !== "" ? "update" : "create"
                            )
                          }
                          className="bg-primaryColor p-2 px-5 rounded text-white h-fit cursor-pointer"
                        >
                          {prescriptionId !== "" ? "UPDATE" : "SUBMIT"}
                        </button>
                        {error.medicine && (
                          <p className="text-red-500 text-md font-semibold  ">
                            {error.medicine}
                          </p>
                        )}
                      </>
                    )}

                    {role !== "doctor" && (
                      <button
                        type="submit"
                        onClick={handelDownload}
                        className="bg-primaryColor p-2 px-5 rounded text-white h-fit cursor-pointer"
                      >
                        DOWNLOAD
                      </button>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: Partial<PrescritonProps> }> {
  try {
    const cookieToken = context.req.cookies.token;
    const { slug } = context.query;

    const { data } = await axios.get(`${BASE_URL}/prescription/${slug}`, {
      headers: {
        Authorization: `Bearer ${cookieToken}`,
      },
    });

    return {
      props: {
        prescriptionId: data._id || "",
        prescriptionData: {
          symptoms: data?.symptoms || [""],
          test: data?.test || [""],
          advice: data?.advice || [""],
          medicine: data?.medicine || [
            { name: "", dailyTime: "", mealTime: "", totalMedicine: 0 },
          ],
        },
      },
    };
  } catch (error: any) {
    return {
      props: {
        errors:
          error?.response?.data?.message ||
          error?.message ||
          "Error fetching prescription data",
      },
    };
  }
}
