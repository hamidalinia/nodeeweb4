import { CategoryRounded, LibraryAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './organisationRoleCreate';
import edit from './organisationRoleEdit';
import list from './organisationRoleList';
import show from './organisationRoleShow';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: CategoryRounded,
  createIcon: LibraryAdd,
};

export default Resource;
