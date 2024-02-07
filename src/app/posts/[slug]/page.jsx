import Menu from "@/components/menu/Menu";
import Styles from "./page.module.css";
import Image from "next/image";
import Comments from "@/components/comments/Comments";
import moment from "moment";

const getData = async (slug) => {
  const res = await fetch(
    `https://tdev-tau-vert.vercel.app/api/posts/${slug}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed");
  }

  return res.json();
};

const Page = ({ data }) => {
  const formattedDate = moment(data.createdAt).format("Do MMMM, YYYY");
  return (
    <div className={Styles.container}>
      <div className={Styles.infoContainer}>
        <div className={Styles.textContainer}>
          <h1 className={Styles.title}>{data.title}</h1>
          <div className={Styles.user}>
            <div className={Styles.userImageContainer}>
              <Image
                src={data?.user?.image}
                alt=""
                fill
                className={Styles.avatar}
              />
            </div>
            <div className={Styles.userTextContainer}>
              <span className={Styles.userName}>{data.user.name}</span>
              <span className={Styles.date}>{formattedDate}</span>
            </div>
          </div>
        </div>
        {data?.img && (
          <div className={Styles.imageContainer}>
            <Image src={data?.img} alt="" fill className={Styles.image} />
          </div>
        )}
      </div>
      <div className={Styles.content}>
        <div className={Styles.post}>
          <div
            className={Styles.description}
            dangerouslySetInnerHTML={{ __html: data?.desc }}
          />
          <div className="comment">
            <Comments postSlug={slug} />
          </div>
        </div>

        <Menu />
      </div>
    </div>
  );
};

export const getServerSideProps = async ({ params }) => {
  const { slug } = params;
  try {
    const data = await getData(slug);
    return {
      props: { data },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      notFound: true,
    };
  }
};

export default Page;
