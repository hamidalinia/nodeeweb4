import { useEffect, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from 'shards-react';
import { useTranslation } from 'react-i18next';
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
} from '@mui/icons-material';
import { useFormikContext } from 'formik';
import _get from 'lodash/get';

import { getAllAdCategories } from '@/functions';
import Loading from '@/components/common/Loading';

import { Row } from './components';

export const parseData = (arr) => {
  const makeForest = (id, xs) =>
    xs
      .filter((i) => (i.parent || null) === id)
      .map((i) => {
        const children = makeForest(i._id, xs);
        return {
          _id: i._id,
          children: children.length ? children : [],
          name: _get(i, 'nameForAdd.fa', '') || _get(i, 'name.fa', ''),
          slug: i.slug,
          parent: i.parent || null,
          order: i.order || 0,
        };
      })
      .sort((a, b) => a.order - b.order);

  return makeForest(null, arr);
};

const getChild = (arr = [], parent_id) => {
  if (!parent_id) return arr;

  let temp = [];
  for (const i of arr) {
    if (i._id === parent_id) temp = i.children;
    if (i.children.length) getChild(i.children, parent_id);
  }

  return temp;
};

export default function SidebarCategories({ onMainCategory }) {
  const { t } = useTranslation();

  const formContext = useFormikContext();

  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(() => {
    return {
      // list of all items
      mainList: [],
      // list of items to display
      categoryList: [],
      selectedCategory: {
        _id: '-1',
        parent: '-1',
      },
    };
  });

  useEffect(() => {
    getAllAdCategories()
      .then((data = []) => {
        // remove disabled items
        let categoryList = data
          .filter((i) => i.active)
          .sort((a, b) => a.order - b.order);
        categoryList = parseData(categoryList);

        setState((p) => ({
          ...p,
          mainList: categoryList,
          categoryList: categoryList,
        }));
      })
      .finally(() => setLoading(false));
  }, []);

  const onListItemClick = (item) => {
    const haveChild = item.children.length;
    if (!haveChild) {
      onMainCategory(item);

      setTimeout(() => {
        formContext.submitForm();
      }, 10);

      return;
    }
    // already selected so back
    if (haveChild && item._id === selectedCategory._id) {
      const parentId = selectedCategory.parent;
      const items = getChild(state.mainList, parentId);

      const parent = state.mainList.find((i) => i._id === parentId);
      setState((p) => ({
        ...p,
        categoryList: parent ? [parent, ...items] : items,
        selectedCategory: parent || { _id: '-1', parent: '-1' },
      }));

      return;
    }

    setState((p) => ({
      ...p,
      categoryList: [item, ...item.children],
      selectedCategory: item,
    }));
  };

  const { categoryList, selectedCategory } = state;

  return (
    <Card small className="mb-3 edit">
      <CardHeader className="border-bottom">
        <span className="fontWeightBold">{t('please choose category')}</span>
      </CardHeader>
      <CardBody className="p-0">
        {loading ? (
          <Loading />
        ) : (
          <ListGroup flush>
            {categoryList?.map((i, idx) => {
              const isSelected = i._id === selectedCategory._id;
              return (
                <ListGroupItem
                  className="p-3 hov"
                  key={idx}
                  onClick={() => onListItemClick(i)}>
                  <Row>
                    {isSelected && <ArrowForwardIosRounded fontSize="small" />}
                    {i.name}

                    {!isSelected && i.children.length ? (
                      <ArrowBackIosRounded fontSize="small" />
                    ) : (
                      <span />
                    )}
                  </Row>
                </ListGroupItem>
              );
            })}
          </ListGroup>
        )}
      </CardBody>
    </Card>
  );
}
