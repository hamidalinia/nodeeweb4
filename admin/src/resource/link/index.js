import linkList from "./linkList";
import linkCreate from "./linkCreate";
import linkEdit from "./linkEdit";
import { Send,Textsms } from "@mui/icons-material";

const Campaign = {
  list: linkList,
  edit: linkEdit,
  create: linkCreate,
  icon: Textsms,
  createIcon: Send,
};
export default Campaign;