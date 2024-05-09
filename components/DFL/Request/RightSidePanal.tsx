import DonorCard from "./DonorCard";
import { useSelector } from "react-redux";
import { fetchDonorData, getDonorData } from "../../../store/slices/DFLSlice";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";

import style from "../../../styles/DFL/request.module.scss";
import { RootState, useAppDispatch } from "../../../store/store";

export default function RightSidePanal(): React.JSX.Element {
  const { donorData, requestData, currentPage, prevData } = useSelector(
    (state: RootState) => state.dfl
  );

  const dispatch = useAppDispatch();

  // Function for make api request for next data
  const handleNextPage = () => {
    const nextPage = currentPage + 1;

    if (prevData[nextPage - 1]) {
      dispatch(getDonorData({ data: prevData[nextPage - 1], page: nextPage }));
    } else {
      dispatch(
        fetchDonorData({
          latlng: requestData?.latlng,
          formData: requestData?.formData,
          page: nextPage,
        })
      );
    }
  };

  // Function for make api request for Previous data
  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const data = prevData[prevPage - 1];
      dispatch(getDonorData({ data, page: prevPage }));
    }
  };

  return (
    <>
      <div className={style.right_container}>
        <div className={style.card_container}>
          {donorData && donorData.length === 0 && currentPage === 1 ? (
            <p className="title">
              No Donor found for given address and bloodType
            </p>
          ) : (
            donorData &&
            donorData.length === 0 && <p className="title">Go to Previous</p>
          )}

          {donorData &&
            donorData?.map((donor, index) => (
              <DonorCard donor={donor} key={index} />
            ))}
        </div>
        <div className={style.pagination_container}>
          <button
            className={style.prev}
            onClick={handlePrevPage}
            disabled={currentPage == 1}
          >
            <BsArrowLeft className={style.pagination_btn} />
          </button>
          {donorData && donorData.length !== 0 && (
            <button className={style.next} onClick={handleNextPage}>
              <BsArrowRight className={style.pagination_btn} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
