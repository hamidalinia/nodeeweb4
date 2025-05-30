import { Storefront, LocalMall } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './dynamicCreate';
import edit from './Edit';
import list from './dynamicList';
import show from './dynamicShow';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: Storefront,
  createIcon: LocalMall,
};

export default Resource;
