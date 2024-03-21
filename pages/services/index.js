import ServiceCard from "@/components/Services/ServiceCard";
import { services } from "@/public/assets/data/services";

export default function Services() {
  return (
    <section>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] ">
          {services.map((item, index) => (
            <ServiceCard items={item} key={index} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
