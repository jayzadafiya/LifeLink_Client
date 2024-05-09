import axios from "axios";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { AiFillStar } from "react-icons/ai";
import { BASE_URL } from "../../utils/config";
import { RootState } from "../../store/store";
import { ReviewData } from "../../interfaces/User";

export default function FeedbackForm() {
  const router = useRouter();
  const ratingRef = useRef<number>(0);
  const reviewTextRef = useRef<HTMLTextAreaElement>(null);
  const [hover, setHover] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useSelector((state: RootState) => state.user);

  const { slug } = router.query as { slug: string };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const reviewData: ReviewData = {
      reviewText: reviewTextRef.current?.value ?? "",
      rating: ratingRef.current,
    };

    try {
      if (ratingRef.current === 0 || reviewTextRef.current?.value === "") {
        setLoading(false);
        toast.error("Please enter rating and reviewText");
        return null;
      }

      await axios.post(`${BASE_URL}/doctors/${slug}/reviews`, reviewData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setLoading(false);
      toast.success("Thank you for review 😀");
      router.replace(`/doctors/${slug}`);
    } catch (error: any) {
      setLoading(false);

      const err = error?.response?.data?.message || error?.message;
      toast.error(err);

      return null;
    }

    ratingRef.current = 0;
    if (reviewTextRef.current) reviewTextRef.current.value = "";
    setHover(0);
  };

  return (
    <>
      <form action="">
        <div>
          <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
            How would you rate the overall experience
          </h3>
          <div>
            {[...Array(5)].map((_, index) => {
              index += 1;

              return (
                <button
                  className={`${
                    index <= ((ratingRef.current && hover) || hover)
                      ? "text-yellowColor"
                      : "text-gray-400"
                  } bg-transparent border-none outline-none text-[22px] cursor-pointer`}
                  key={index}
                  type="button"
                  onClick={() => (ratingRef.current = index)}
                  onMouseEnter={() => setHover(index)}
                  onMouseLeave={() => setHover(ratingRef.current)}
                  onDoubleClick={() => {
                    setHover(0);
                    ratingRef.current = 0;
                  }}
                >
                  <span>
                    <AiFillStar />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-[30px] ">
          <h3 className="text-headingColor text-[16px] leading-6 font-semibold mb-4 mt-0">
            share your feedback or suggestions
          </h3>
          <textarea
            ref={reviewTextRef}
            className="border border-solid border-[#0066ff34] focus:outline outline-primaryColor w-full px-4 py-3 rounded-md"
            rows={5}
            placeholder="write you message"
          ></textarea>
        </div>

        <button className="btn" type="submit" onClick={handleSubmitReview}>
          {loading ? (
            <HashLoader size={25} color="white" />
          ) : (
            " Submit Feedback"
          )}
        </button>
      </form>
    </>
  );
}
