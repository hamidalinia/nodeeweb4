import courseCreate from "./courseCreate";
import courseEdit from "./courseEdit";
import courseList from "./courseList";
import courseShow from "./courseShow";
import { Storefront,LocalMall } from "@mui/icons-material";

const Course = {
  list:courseList,
  edit:courseEdit,
  create:courseCreate,
  show:courseShow,
  icon: Storefront,
  createIcon: LocalMall,
};
export default Course;