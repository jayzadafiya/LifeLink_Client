import { formateDate } from "@/utils/heplerFunction";
import Image from "next/image";

export default function Appointments({ appointments }) {
  return (
    <table className="w-full text-left text-sm text-gray-500">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Gender
          </th>
          <th scope="col" className="px-6 py-3">
            Payment
          </th>
          <th scope="col" className="px-6 py-3">
            Price
          </th>
          <th scope="col" className="px-6 py-3">
            Booked on
          </th>
        </tr>
      </thead>

      <tbody>
        {appointments?.map((item) => (
          <tr key={item_id}>
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
            >
              <Image
                src={item.user.photo}
                className="rounded-full"
                width={40}
                height={40}
              />

              <div className="pl-3">
                <div className="text-base font-semibold">{item.user.name}</div>
                <div className=" text-gray-500">{item.user.email}</div>
              </div>
            </th>

            <td className="px-6 py-4">{item.user.gender}</td>
            <td className="px-6 py-4">
              {item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 bg-green-500 mr-2"></div>
                  Paid
                </div>
              )}

              {!item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 bg-red-500 mr-2"></div>
                  Unpaid
                </div>
              )}
            </td>
            <td className="px-6 py-4">{item.user.ticketPrice}</td>
            <td className="px-6 py-4">{formateDate(item.createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
