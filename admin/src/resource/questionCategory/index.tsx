import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './questionCategoryCreate';
import edit from './questionCategoryEdit';
import list from './questionCategoryList';
// import show from './questionCategoryShow';

const Resource: ResourceType = {
  list,
  edit,
  create,
  // show,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
