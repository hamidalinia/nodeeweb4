import { Fitbit, ControlPointDuplicate } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './attributesCreate';
import edit from './attributesEdit';
import list from './attributesList';

const Resource: ResourceType = {
  list,
  edit,
  create,
  icon: Fitbit,
  createIcon: ControlPointDuplicate,
};

export default Resource;
