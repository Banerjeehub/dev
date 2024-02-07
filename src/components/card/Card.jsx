import Image from "next/image";
import Styles from "./card.module.css";
import Link from "next/link";

const Card = ({ item, key }) => {
  const URL = "/post/";
  return (
    <div className={Styles.container} key={key}>
      {item.img && (
        <div className={Styles.imageContainer}>
          <Image src={item.img} alt="" fill className={Styles.image} />
        </div>
      )}
      <div className={Styles.textContainer}>
        <div className={Styles.detail}>
          <span className={Styles.date}>
            {item.createdAt.substring(0, 10)} -{" "}
          </span>
          <span className={Styles.category}>{item.catSlug}</span>
        </div>
        <a href={`${URL}${item.slug}`}>
          <h1>{item.title}</h1>
        </a>
        <div
          className={Styles.desc}
          dangerouslySetInnerHTML={{ __html: item?.desc.substring(0, 60) }}
        />
        <a href={`${URL}${item.slug}`} className={Styles.link}>
          Read More
        </a>
      </div>
    </div>
  );
};

export default Card;
