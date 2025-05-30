import { LibraryBooksRounded, PostAddRounded } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './entryCreate';
import edit from './entryEdit';
import show from './Show';
import list from './entryList';

const Resource: ResourceType = {
  list,
  edit,
  create,
  show,
  icon: LibraryBooksRounded,
  createIcon: PostAddRounded,
};

export default Resource;
