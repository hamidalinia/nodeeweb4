import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './customerGroupCreate';
import edit from './customerGroupEdit';
import list from './customerGroupList';
import show from './customerGroupShow';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
