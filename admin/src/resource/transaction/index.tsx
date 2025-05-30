import { MonetizationOn } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './transactionCreate';
import show from './transactionShow';
import list from './transactionList';

const Resource: ResourceType = {
  list,
  create,
  show,
  icon: MonetizationOn,
};

export default Resource;
