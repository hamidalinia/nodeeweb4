import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './forumTopicCreate';
import edit from './forumTopicEdit';
import list from './forumTopicList';

const Resource: ResourceType = {
  list,
  edit,
  create,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
