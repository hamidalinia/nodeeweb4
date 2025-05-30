import gameCreate from "./gameCreate";
import gameEdit from "./gameEdit";
import gameList from "./gameList";
import { LibraryBooksRounded,PostAddRounded} from "@mui/icons-material";
const Game = {
  list: gameList,
  edit: gameEdit,
  create: gameCreate,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};
export default Game;