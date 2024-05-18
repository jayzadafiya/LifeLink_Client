import Image, { StaticImageData } from "next/image";
import style from "../../styles/DFL/HomeDfl.module.scss";

// Interface for components props type
interface CardProps {
  title: string;
  text: string;
  img: StaticImageData;
  alt?: string;
}
export default function Card({
  title,
  text,
  img,
  alt = "",
}: CardProps): React.JSX.Element {
  return (
    <div className={style.card}>
      <div>
        <Image className={style.card_img_top} src={img} alt={alt} />
      </div>

      <div className={style.card_body}>
        <h4 className={style.card_title}>{title}</h4>
        <p className={style.card_text}>{text}</p>
      </div>
    </div>
  );
}
