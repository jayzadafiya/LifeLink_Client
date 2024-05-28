import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import Image from "next/image";
import FeedbackForm from "./FeedbackForm";
import { formateDate } from "../../utils/heplerFunction";
import { AiFillStar } from "react-icons/ai";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Review } from "../../interfaces/Doctor";
import { RootState } from "../../store/store";
import avtar from "../../public/assets/images/patient-avatar.png";
// Interface for components props type
interface FeedBackProps {
  reviews?: Review[];
  totalRating: number;
}

export default function FeedBack({
  reviews,
  totalRating,
}: FeedBackProps): React.JSX.Element {
  const { role } = useSelector((state: RootState) => state.user);
  const [showFeedbackForm, setShowFeedbackForm] = useState<boolean>(false);

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 100,
  });
  return (
    <div>
      <div className="mb-[50px] w-[500px]">
        <h4 className="text-[20px] leading-[30px] text-headingColor font-bold mb-[30px]">
          All reviews ({totalRating})
        </h4>
        <div className="w-[750px] min-h-[200px] max-h-[600px] ">
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowHeight={cache.rowHeight}
                deferredMeasurementCache={cache}
                rowCount={reviews ? reviews.length : 0}
                rowRenderer={({ key, index, style, parent }) => {
                  const review = reviews?.[index];

                  return (
                    <CellMeasurer
                      parent={parent}
                      key={key}
                      cache={cache}
                      columnIndex={0}
                      rowIndex={index}
                    >
                      {({ registerChild }) => (
                        <div
                          style={style}
                          ref={(element: HTMLDivElement) =>
                            registerChild && registerChild(element)
                          }
                          className="flex justify-between"
                        >
                          <div className="flex gap-3">
                            <figure className="rounded-full ">
                              <Image
                                src={review?.user?.photo || avtar}
                                alt="User Image"
                                width={40}
                                height={40}
                              />
                            </figure>

                            <div>
                              <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                                {review?.user?.name}
                              </h5>
                              <p className="text-[14px] leading-6 text-textColor ">
                                {review?.createdAt &&
                                  formateDate(review?.createdAt)}
                              </p>

                              <p className="text__para mt-3 font-medium text-[15px]">
                                {review?.reviewText}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 mr-5">
                            {[...Array(review?.rating)].map((_, idx) => (
                              <AiFillStar key={idx} color="#8067FF" />
                            ))}
                            {/* {[...Array(review?.rating).keys()].map((_, idx) => (
                              <AiFillStar key={idx} color="#8067FF" />
                            ))} */}
                          </div>
                        </div>
                      )}
                    </CellMeasurer>
                  );
                }}
              />
            )}
          </AutoSizer>
        </div>
      </div>

      {!showFeedbackForm && role === "patient" && (
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
