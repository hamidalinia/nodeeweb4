import accountingCreate from "./accountingCreate";
import accountingEdit from "./accountingEdit";
import accountingList from "./accountingList";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { LibraryBooksRounded,PostAddRounded} from "@mui/icons-material";
const Accounting = {
  list: accountingList,
  edit: accountingEdit,
  create: accountingCreate,
  icon: PointOfSaleIcon,
  createIcon: PointOfSaleIcon,
};
export default Accounting;