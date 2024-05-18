import DoctorCard from "../../components/Doctors/DoctorCard";
import PaginationComponent from "../../components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../store/store";
import { BASE_URL } from "../../utils/config";
import { Doctor } from "../../interfaces/Doctor";
import { fetchData } from "../../store/slices/pagination";
import { DonorForm } from "../../interfaces/Forms";

// export default function AdminPage({
//   admin,
//   error,
// }: AdminProp): React.JSX.Element {
//   const [tab, setTab] = useState<string>("requests");

//   if (error) {
//     return <Error errMessage={error} />;
//   }

//   return (
//     <section>
//       <div className="container">
//         <div className="md:col-span-2 md:px-[30px]">
//           <div>
//             <button
//               onClick={() => setTab("requests")}
//               className={`${
//                 tab === "requests" && "bg-primaryColor text-white font-normal"
//               }  p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7  border-primaryColor`}
//             >
//               Requests
//             </button>
//           </div>
//           <section>
//             <div className="container">
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4   gap-5 ">
//                 {admin?.doctors.map((doctor) => (
//                   <DoctorCard key={doctor._id} doctor={doctor} />
//                 ))}
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </section>
//   );
// }

// Data fetching Function for get request data of doctor

export default function AdminPage(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<string>("requests");

  const renderItem = (doctor: Partial<Doctor | DonorForm>) => (
    <DoctorCard key={doctor._id} doctor={doctor as Doctor} />
  );

  useEffect(() => {
    dispatch(
      fetchData({ url: `${BASE_URL}/admin/profile`, page: 1, type: "admin" })
    );
  }, []);

  return (
    <section>
      <div className="container">
        <div className="md:col-span-2 md:px-[30px]">
          <div className="container">
            <button
              onClick={() => setTab("requests")}
              className={`${
                tab === "requests" && "bg-primaryColor text-white font-normal"
              }  p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] border border-solid leading-7  border-primaryColor`}
            >
              Requests
            </button>
          </div>
          <section>
            <div>
              <PaginationComponent renderItem={renderItem} type="admin" />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
