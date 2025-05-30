import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './Create';
import edit from './Edit';
import list from './List';

const Resource: ResourceType = {
  create,
  list,
  edit,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
