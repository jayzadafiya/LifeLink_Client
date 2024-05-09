import { faqs } from "../../public/assets/data/faqs";
import FaqItem from "./FaqItem";

export default function FaqList(): React.JSX.Element {
  return (
    <div className="mt-[38px]">
      {faqs.map((item, index) => (
        <FaqItem item={item} key={index} />
      ))}
    </div>
  );
}
