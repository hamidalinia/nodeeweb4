import accCategoriesCreate from './accCategoriesCreate';
import accCategoriesEdit from './accCategoriesEdit';
import accCategoriesList from './accCategoriesList';
import CategoryIcon from '@mui/icons-material/Category';

const AccCategories = {
    list: accCategoriesList,
    edit: accCategoriesEdit,
    create: accCategoriesCreate,
    icon: CategoryIcon,
    createIcon: CategoryIcon,
};

export default AccCategories;
