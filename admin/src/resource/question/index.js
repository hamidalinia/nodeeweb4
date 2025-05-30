import questionCreate from "./questionCreate";
import questionEdit from "./questionEdit";
import questionList from "./questionList";
import { LibraryBooksRounded,PostAddRounded} from "@mui/icons-material";
const Question = {
  list: questionList,
  edit: questionEdit,
  create: questionCreate,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};
export default Question;