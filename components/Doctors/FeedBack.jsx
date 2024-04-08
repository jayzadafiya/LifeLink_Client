import Image from "next/image";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";
import { formateDate } from "@/utils/heplerFunction";
import { AiFillStar } from "react-icons/ai";
import { useRef, useState } from "react";
import FeedbackForm from "./FeedbackForm";
import { useSelector } from "react-redux";

export default function FeedBack({ reviews, totalRating }) {
  const { role } = useSelector((state) => state.user);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

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
        <div className="w-[750px] h-[600px] overflow-hidden">
          <AutoSizer>
            {({ width, height }) => (
              <List
                width={width}
                height={height}
                rowHeight={cache.rowHeight}
                deferredMeasurementCache={cache}
                rowCount={reviews.length}
                rowRenderer={({ key, index, style, parent }) => {
                  const review = reviews[index];

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
                          ref={registerChild}
                          className="flex justify-between"
                        >
                          <div className="flex gap-3">
                            <figure className="rounded-full ">
                              <Image
                                src={review.user?.photo}
                                alt=""
                                width={40}
                                height={40}
                              />
                            </figure>

                            <div>
                              <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                                {review?.user?.name}
                              </h5>
                              <p className="text-[14px] leading-6 text-textColor ">
                                {formateDate(review?.createdAt)}
                              </p>

                              <p className="text__para mt-3 font-medium text-[15px]">
                                {review?.reviewText}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1 mr-5">
                            {[...Array(review?.rating).keys()].map((_, idx) => (
                              <AiFillStar key={idx} color="#8067FF" />
                            ))}
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
