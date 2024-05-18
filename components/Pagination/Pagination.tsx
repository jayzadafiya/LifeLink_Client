import { useSelector, useDispatch } from "react-redux";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { RootState } from "../../store/store";
import { fetchData, getData } from "../../store/slices/pagination";
import { DonorForm } from "../../interfaces/Forms";
import { Doctor } from "../../interfaces/Doctor";
import { HashLoader } from "react-spinners";

interface PaginationComponentProps {
  renderItem: (item: Partial<Doctor | DonorForm>) => JSX.Element;
  type: string;
}

export default function PaginationComponent({
  renderItem,
  type,
}: PaginationComponentProps): React.JSX.Element {
  const { data, requestData, currentPage, loading, prevData } = useSelector(
    (state: RootState) => state.pagination
  );
  const dispatch = useDispatch();

  const handleNextPage = () => {
    const nextPage = currentPage + 1;

    if (prevData[nextPage - 1]) {
      dispatch(getData({ data: prevData[nextPage - 1], page: nextPage }));
    } else {
      dispatch(
        fetchData({
          type,
          latlng: requestData?.latlng,
          formData: requestData?.formData,
          page: nextPage,
        })
      );
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      const data = prevData[prevPage - 1];
      dispatch(getData({ data, page: prevPage }));
    }
  };

  console.log(prevData);
  return (
    <div>
      <div>
        {loading && (
          <div className="w-full flex justify-center">
            <HashLoader size={50} color="#0067FF" />
          </div>
        )}
        {!loading && data && data.length === 0 && currentPage === 1 ? (
          <p className="title">No data found for the given criteria</p>
        ) : (
          !loading &&
          data &&
          data.length === 0 && <p className="title">Go to Previous</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5 min-h-[465px] ">
          {data && data.map((item) => renderItem(item))}
        </div>
      </div>

      <div className="flex justify-between items-center p-[3%] ">
        <button
          className="btn-pagination hover:content-prev"
          onClick={handlePrevPage}
          disabled={currentPage == 1}
        >
          <BsArrowLeft />
        </button>
        {data && data.length !== 0 && (
          <button
            className="btn-pagination hover:content-next"
            onClick={handleNextPage}
          >
            <BsArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}
