import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './forumPostCreate';
import edit from './forumPostEdit';
import list from './forumPostList';
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
