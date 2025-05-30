import campaignList from "./campaignList";
import campaignCreate from "./campaignCreate";
import campaignEdit from "./campaignEdit";
import { Send,Textsms } from "@mui/icons-material";
import CampaignIcon from '@mui/icons-material/Campaign';

const Campaign = {
  list: campaignList,
  edit: campaignEdit,
  create: campaignCreate,
  icon: CampaignIcon,
  createIcon: Send,
};
export default Campaign;