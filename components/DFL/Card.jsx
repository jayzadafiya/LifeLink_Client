import Image from "next/image";
import style from "../../styles/DFL/HomeDfl.module.scss";

export default function Card({ title, text, img, alt = "" }) {
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
