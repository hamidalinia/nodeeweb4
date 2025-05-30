import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './postCategoryCreate';
import edit from './postCategoryEdit';
import list from './postCategoryList';
import show from './postCategoryShow';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
