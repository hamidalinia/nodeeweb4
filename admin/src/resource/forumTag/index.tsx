import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './forumTagCreate';
import edit from './forumTagEdit';
import list from './forumTagList';
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
