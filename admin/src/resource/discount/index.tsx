import { Discount, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './discountCreate';
import edit from './discountEdit';
import list from './discountList';
import show from './discountShow';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: Discount,
  createIcon: LibraryAdd,
};

export default Resource;
