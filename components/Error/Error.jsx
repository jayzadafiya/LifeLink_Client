import React from "react";

export default function Error({ errMessgae }) {
  console.log(errMessgae);
  return (
    <div className="text-headingColor text-[28px] leading-[30px] text-center mt-[50px] font-semibold">
      {errMessgae}
    </div>
  );
}
