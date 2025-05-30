import { Group, GroupAdd } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './Create';
import edit from './Edit';
import show from './Show';
import list from './List';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: Group,
  createIcon: GroupAdd,
};

export default Resource;
