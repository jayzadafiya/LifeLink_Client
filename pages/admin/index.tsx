import DoctorCard from "../../components/Doctors/DoctorCard";
import PaginationComponent from "../../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/store";
import { Doctor } from "../../interfaces/Doctor";
import { fetchData, setInitialData } from "../../store/slices/pagination";
import { DonorForm } from "../../interfaces/Forms";
import { BiMenu } from "react-icons/bi";

export default function AdminPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<string>("requests");
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const tabs = ["requests", "cancelled", "approved"];

  const renderItem = (doctor: Partial<Doctor | DonorForm>) => (
    <DoctorCard key={doctor._id} doctor={doctor as Doctor} />
  );

  useEffect(() => {
    dispatch(setInitialData());
    dispatch(fetchData({ page: 1, type: "admin", status: tab }));
  }, [dispatch, tab]);

  const renderButton = (tabName: string) => (
    <button
      key={tabName}
      onClick={() => setTab(tabName)}
      className={`${
        tab === tabName && "bg-primaryColor text-white font-normal"
      } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7`}
    >
      {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
    </button>
  );

  return (
    <>
      <div className="header flex gap-5 pl-[3%] pr-[3%] items-center justify-between">
        <div className="w-full hidden sm:block">
          {/* <button
            onClick={() => setTab("requests")}
            className={`${
              tab === "requests" && "bg-primaryColor text-white font-normal"
            }  p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px]  leading-7  `}
          >
            Request
          </button>
          <button
            onClick={() => setTab("cancelled")}
            className={`${
              tab === "cancelled" && "bg-primaryColor text-white font-normal"
            }  p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px]  leading-7  `}
          >
            Rejected
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`${
              tab === "approved" && "bg-primaryColor text-white font-normal"
            }  p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px]  leading-7  `}
          >
            Approved
          </button> */}

          {tabs.map(renderButton)}
        </div>
        <div className="sm:hidden">
          <BiMenu
            className="w-8 h-8 cursor-pointer"
            onClick={() => setShowMenu((prev) => !prev)}
          />
        </div>

        <div className=" text-right ">
          <button className="p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7  border-textColor bg-slate-100">
            Logout
          </button>
        </div>
      </div>
      {showMenu && (
        <div className="flex flex-col w-full   sm:hidden px-4 mt-[-10px]">
          {tabs.map(renderButton)}
        </div>
      )}
      <section>
        <div className="md:col-span-2 md:px-[30px]">
          <div>
            <PaginationComponent
              renderItem={renderItem}
              type="admin"
              tab={tab}
            />
          </div>
        </div>
      </section>
    </>
  );
}
