import Featured from "@/components/featured/Featured";
import Styles from "./homepage.module.css";
import CategoryList from "@/components/categoryList/CategoryList";
import CardList from "@/components/cardList/CardList";
import Menu from "@/components/menu/Menu";

export default function Home({ searchParams }) {
  const page = parseInt(searchParams.page) || 1;
  return (
    <div className={Styles.container}>
      <Featured />
      <CategoryList />
      <div className={Styles.content}>
        <CardList page={page} />
        <Menu />
      </div>
    </div>
  );
}
