import React from "react";

export default function Error({
  errMessage,
}: {
  errMessage: string;
}): React.JSX.Element {
  return (
    <div className="text-headingColor text-[28px] leading-[30px] text-center mt-[50px] font-semibold">
      {errMessage}
    </div>
  );
}
