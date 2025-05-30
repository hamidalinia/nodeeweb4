import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './categoryCreate';
import edit from './categoryEdit';
import list from './categoryList';
import show from './categoryShow';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
