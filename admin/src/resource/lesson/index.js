import lessonCreate from "./lessonCreate";
import lessonEdit from "./lessonEdit";
import lessonList from "./lessonList";
import lessonShow from "./lessonShow";
import { Storefront,LocalMall } from "@mui/icons-material";

const lesson = {
  list:lessonList,
  edit:lessonEdit,
  create:lessonCreate,
  show:lessonShow,
  icon: Storefront,
  createIcon: LocalMall,
};
export default lesson;