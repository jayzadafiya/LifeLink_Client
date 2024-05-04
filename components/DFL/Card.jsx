import Image from "next/image";

export default function Card({ title, text, img, alt = "" }) {
  return (
    <div className="card ">
      <div className="overlay">
        <Image className="card-img-top" src={img} alt={alt} />
      </div>

      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
}
