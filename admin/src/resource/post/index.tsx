import { LibraryBooksRounded, PostAddRounded } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './postCreate';
import edit from './postEdit';
import list from './postList';

const Resource: ResourceType = {
  list,
  edit,
  create,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};

export default Resource;
