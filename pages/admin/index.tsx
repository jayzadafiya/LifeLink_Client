import axios from "axios";
import Cookies from "js-cookie";
import DoctorCard from "../../components/Doctors/DoctorCard";
import toast from "react-hot-toast";
import DonorCard from "../../components/DFL/Request/DonorCard";
import PaginationComponent from "../../components/Pagination/Pagination";
import {
  fetchData,
  setInitialData,
  setNewData,
} from "../../store/slices/pagination";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/store";
import { Doctor } from "../../interfaces/Doctor";
import { DonorForm } from "../../interfaces/Forms";
import { useRouter } from "next/router";
import { logout } from "../../store/slices/userSlice";
import { BASE_URL } from "../../utils/config";
import { FcApproval } from "react-icons/fc";
import { LuSigma } from "react-icons/lu";
import { useSocket } from "../../context/SocketContext";
import { MdOutlinePendingActions, MdDoNotDisturbAlt } from "react-icons/md";
import { adminLogout } from "../../store/slices/adminSlice";
import { PayloadAction } from "@reduxjs/toolkit";
import { decodeToken } from "../../utils/heplerFunction";

interface AdminReportData {
  updateRequest: number;
  acceptedNumber: number;
  cancelledNumber: number;
  donorsNumber: number;
}

export default function AdminPage(): React.JSX.Element {
  const token = Cookies.get("token");

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { socket } = useSocket();

  const [tab, setTab] = useState<string>("requests");
  const [reportData, setReportData] = useState<AdminReportData>({
    updateRequest: 0,
    acceptedNumber: 0,
    cancelledNumber: 0,
    donorsNumber: 0,
  });

  useEffect(() => {
    if (token && socket) {
      const { userId, role } = decodeToken(token);

      socket.emit("identify", { id: userId, role });

      socket.on("logoutAdmin", () => {
        dispatch(logout());
        router.replace("/admin/login");
      });

      return () => {
        socket.emit("removeIdentity", { id: userId });
        socket.off("logoutAdmin");
      };
    }
  }, [socket]);

  useEffect(() => {
    // Function for get report
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/admin/report`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReportData(data);
      } catch (error: any) {
        const err = error?.response?.data?.message || error?.message;
        toast.error(err);

        return null;
      }
    })();
  }, []);

  useEffect(() => {
    dispatch(setInitialData());
    dispatch(fetchData({ page: 1, type: "admin", status: tab }));

    if (tab === "requests" && socket) {
      socket.on("updateDoctorToAdmin", (updateData: Partial<Doctor>) => {
        dispatch(setNewData(updateData));
      });

      return () => {
        socket.off("updateDoctorToAdmin");
      };
    }
  }, [dispatch, socket, tab]);

  const handleLogout = () => {
    if (token) {
      dispatch(adminLogout(token)).then((result: PayloadAction<void>) => {
        router.replace("/admin/login");
      });
    }
  };

  const renderDoctorCard = (doctor: Partial<Doctor | DonorForm>) => (
    <DoctorCard key={doctor._id} doctor={doctor as Doctor} />
  );
  const renderDonorCard = (donor: Partial<Doctor | DonorForm>) => (
    <DonorCard donor={donor as DonorForm} key={donor._id} />
  );

  return (
    <>
      <div className="header flex gap-5 pl-[3%] pr-[3%] items-center justify-between ">
        <div className="w-full text-textColor font-semibold text-[30px]">
          <span className="text-[40px] font-bold text-primaryColor">L</span>
          ife
          <span className="text-[40px] font-bold text-primaryColor">L</span>
          ink
        </div>

        <div className=" text-right ">
          <button
            onClick={handleLogout}
            className="p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7  border-textColor bg-slate-100"
          >
            Logout
          </button>
        </div>
      </div>

      <section>
        <div className="mx-[3%]  flex flex-col sm:flex-row gap-5 mb-10">
          <div className="flex gap-4 w-full justify-center sm:justify-start sm:w-fit">
            <button
              onClick={() => setTab("requests")}
              className={`${
                tab === "requests" && " bg-yellow-200  font-normal"
              } w-[200px]   rounded-md  font-semibold text-[16px] text-yellow-700 border-[3px] border-solid border-yellow-200   leading-7 p-4 flex flex-col shadow  `}
            >
              <p>Pending Request</p>
              <div className="flex gap-5 items-center w-full text-[22px]">
                <MdOutlinePendingActions />
                <p>{reportData.updateRequest}</p>
              </div>
            </button>
            <button
              onClick={() => setTab("cancelled")}
              className={`${
                tab === "cancelled" && "bg-red-200 font-bold"
              } w-[200px] rounded-md  font-semibold text-[16px] text-red-800 leading-7 border-[3px] border-solid border-red-200  p-4 flex flex-col shadow`}
            >
              <p>Rejected Doctors</p>
              <div className="flex gap-5 items-center w-full text-[22px]">
                <MdDoNotDisturbAlt />
                <p>{reportData.cancelledNumber}</p>
              </div>
            </button>
          </div>
          <div className="flex gap-5 w-full justify-center sm:justify-start sm:w-fit">
            <button
              onClick={() => setTab("approved")}
              className={`${
                tab === "approved" && "bg-green-300 font-bold"
              } w-[200px]  rounded-md   text-[16px] text-green-800 leading-7  border-[3px] border-solid border-green-300 p-4 flex flex-col font-semibold shadow`}
            >
              <p>Approved Doctors</p>
              <div className="flex gap-5 items-center w-full text-[22px]">
                <FcApproval />
                <p>{reportData.acceptedNumber}</p>
              </div>
            </button>
            <button
              onClick={() => setTab("donor")}
              className={`${
                tab === "donor" && "bg-blue-300 font-bold text-white"
              } w-[200px]  rounded-md   text-[16px] text-blue-800 leading-7  border-[3px] border-solid border-blue-300 p-4 flex flex-col font-semibold shadow`}
            >
              <p>Total Donors</p>
              <div className="flex gap-5 items-center w-full text-[22px]">
                <LuSigma />
                <p>{reportData.donorsNumber}</p>
              </div>
            </button>
          </div>
        </div>
        <div className="md:col-span-2 md:px-[30px]">
          <PaginationComponent
            renderItem={tab === "donor" ? renderDonorCard : renderDoctorCard}
            type="admin"
            tab={tab}
          />
        </div>
      </section>
    </>
  );
}
