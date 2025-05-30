import { Receipt, AddShoppingCartOutlined } from '@mui/icons-material';

import { ResourceType } from '@/types/resource';

import create from './requestCreate';
import edit from './requestEdit';
import list from './List';

const Resource: ResourceType = {
    list,
    create,
    edit,
    icon: Receipt,
    createIcon: AddShoppingCartOutlined,
};

export default Resource;
