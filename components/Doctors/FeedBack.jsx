import Image from "next/image";
import avater from "../../public/assets/images/avatar-icon.png";
import { formateDate } from "@/utils/formateDate";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react";
import FeedbackForm from "./FeedbackForm";

export default function FeedBack() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  return (
    <div>
      <div className="mb-[50px]">
        <h4 className="text-[20px] leading-[30px] text-headingColor font-bold mb-[30px]">
          All reviews (272)
        </h4>

        <div className="flex justify-between gap-10 mb-[38px] ">
          <div className="flex gap-3  ">
            <figure className="w-10 h-10 rounded-full ">
              <Image src={avater} alt="" className="w-full" />
            </figure>

            <div>
              <h5 className="tet-[16px] leading-6 text-primaryColor font-bold">
                Ali ahmed
              </h5>
              <p className="text-[14px] leading-6 text-textColor ">
                {formateDate("02-14-2023")}
              </p>

              <p className="text__para mt-3 font-medium text-[15px]">
                Good services, Enjoy tretement
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {[...Array(5).keys()].map((_, index) => (
              <AiFillStar key={index} color="#8067FF" />
            ))}
          </div>
        </div>
      </div>

      {!showFeedbackForm && (
        <div className="text-center ">
          <button className="btn" onClick={() => setShowFeedbackForm(true)}>
            Give Feedback
          </button>
        </div>
      )}

      {showFeedbackForm && <FeedbackForm />}
    </div>
  );
}
