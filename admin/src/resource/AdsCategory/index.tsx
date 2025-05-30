import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './Create';
import edit from './Edit';
import list from './List';
import show from './Show';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
