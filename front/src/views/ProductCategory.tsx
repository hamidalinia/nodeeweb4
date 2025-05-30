import {lazy, useEffect, useState} from 'react';
import {Col, Row} from 'shards-react';
import {useTranslation, withTranslation} from 'react-i18next';
import {useSearchParams} from 'react-router-dom';
import {Meta} from 'react-head';
import {styled} from '@mui/material/styles';

import TablePagination from '@mui/material/TablePagination';

import {NormalizeString} from '#c/helpers';
import EmptyList from '#c/components/common/EmptyList';
import Loading from '#c/components/common/Loading';
import {getEntitiesWithCount, isClient,loadProductCategory} from '@/functions';
import {useParams} from "react-router-dom/dist/index";

const ProductCard = lazy(() => import('#c/components/Home/ProductCard'));

const NoOp = () => {
};
const MyPagination = styled(TablePagination)(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',

    '& .MuiToolbar-root': {
      padding: 0,
    },
    '& p': {
      margin: 0,
    },
    '& .MuiInputBase-root': {
      marginInlineEnd: theme.spacing(4),
      marginInlineStart: theme.spacing(1),
    },
    '& .MuiTablePagination-actions': {
      marginLeft: 0,
      marginRight: theme.spacing(2.5),
    },
  })
);
export const Headers = ({entity}) => {
  if (entity === 'item')
    return <Meta name="robots" content="noindex,nofollow"/>;
};

function ProductCategory(props) {
  // props={}
  console.log("props", props)
  const {t} = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  let params = useParams();

  const [category, setCategory] = useState({});
  const [tracks, setTracks] = useState([]);
  const [counts, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  //
  // let { element = {}, params = {} } = props;
  // let { settings = {} } = element;
  // let { general = {} } = settings;
  // let { fields = {} } = general;
  let entity = 'product', customQuery = {}, populateQuery = {};

  const defaultLimit = 25;

  useEffect(() => {
    if (isClient) {
      loadProductCategoryItems();
      loadProductItems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSearchParams, defaultLimit]);

  const limit = Number(searchParams.get('limit')) || defaultLimit;
  const offset = Number(searchParams.get('offset')) || 0;

  // const loadProductItems = useCallback(
  const loadProductCategoryItems = (filter = {}) => {
    console.group('loadCategoryDescription');

    console.log("loadCategoryDescription", searchParams,filter)
    const query: any = {};

    if (customQuery) {
      if (typeof customQuery == 'string') {
        customQuery = JSON.parse(customQuery);
      }
      Object.keys(customQuery).forEach((item) => {
        let main = customQuery[item];
        if (params._id) {
          let theVariable = params._id;
          const json2 = isStringified(theVariable);
          if (typeof json2 == 'object') {
            console.log('theVariable', theVariable);
          } else {
            theVariable = JSON.stringify(theVariable);
          }
          main = main.replace('"params._id"', theVariable);
          main = main.replace("'params._id'", theVariable);
          main = main.replace('params._id', theVariable);
        }

        function isStringified(jsonValue) {
          // use this function to check
          try {
            return JSON.parse(jsonValue);
          } catch (err) {
            return jsonValue;
          }
        }

        const json = isStringified(main);

        if (typeof json == 'object') {
          query[item] = JSON.parse(main);
        } else {
          main = main.replaceAll(/\"/g, '');
          query[item] = main;
        }
      });
    }

    // get query paramters
    for (const [key, value] of searchParams)
      query[key] = NormalizeString(value);
    // const limit = parseInt(query.limit || defaultLimit);
    // const offset = parseInt(query.offset || 0);
    // delete query.offset;
    // delete query.limit;
    console.log("cact slug:", params?._id)
    if (params?._id) {
      query['productCategory.slug'] = params?._id;
    }
    // console.log('offset:', offset);
    console.log('filter:', filter);
    console.log('query:', query);
    console.groupEnd();

    loadProductCategory(params?._id).then(e=>{
      console.log("loadProductCategoryloadProductCategory",e)
      setCategory(e)
    }).catch(e=>{
      console.log("loadProductCategoryloadProductCategory",e)

    })
  }
  const loadProductItems = (filter = {}) => {
    console.group('loadProductItems');

    console.log("searchParams", searchParams)
    console.log("props", props)
    console.log("filter", filter)
    // setTracks([...[]]);
    setTracks([]);
    setLoading(true);
    const query: any = {};

    if (customQuery) {
      if (typeof customQuery == 'string') {
        customQuery = JSON.parse(customQuery);
      }
      Object.keys(customQuery).forEach((item) => {
        let main = customQuery[item];
        if (params._id) {
          let theVariable = params._id;
          const json2 = isStringified(theVariable);
          if (typeof json2 == 'object') {
            console.log('theVariable', theVariable);
          } else {
            theVariable = JSON.stringify(theVariable);
          }
          main = main.replace('"params._id"', theVariable);
          main = main.replace("'params._id'", theVariable);
          main = main.replace('params._id', theVariable);
        }

        function isStringified(jsonValue) {
          // use this function to check
          try {
            return JSON.parse(jsonValue);
          } catch (err) {
            return jsonValue;
          }
        }

        const json = isStringified(main);

        if (typeof json == 'object') {
          query[item] = JSON.parse(main);
        } else {
          main = main.replaceAll(/\"/g, '');
          query[item] = main;
        }
      });
    }

    // get query paramters
    for (const [key, value] of searchParams)
      query[key] = NormalizeString(value);
    const limit = parseInt(query.limit || defaultLimit);
    const offset = parseInt(query.offset || 0);
    delete query.offset;
    delete query.limit;
    console.log("params", params?._id)
    if (params?._id) {
      query['productCategory.slug'] = params?._id;
    }
    console.log('offset:', offset);
    console.log('filter:', filter);
    console.log('query:', query);
    console.groupEnd();

    getEntitiesWithCount(
      entity || params.entity,
      offset,
      limit,
      false,
      JSON.stringify(query),
      JSON.stringify(populateQuery)
    )
      .then(({items, count}) => {
        setTracks([...items]);
        setCount(count);
      })
      .finally(() => setLoading(false));
  }
  //   ,
  //   [searchParams]
  // );

  const handleChangePage = (event, newPage) => {
    if (isClient) {
      window.scrollTo(0, 0);

      setSearchParams((p) => {
        p.set('offset', String(newPage * limit));
        return p;
      });
      loadProductItems();
    }
  };
  const handleChangeRowsPerPage = (event, obj) => {
    const newLimit = parseInt(obj.props.children);

    setSearchParams((p) => {
      p.set('limit', String(newLimit));
      p.set('offset', '0');
      return p;
    });

    loadProductItems();
  };

  return loading ? (
    <Loading/>
  ) : (
    <>
      <Row className={'gap-10 justify-content-center product-category-classic '} style={{
        paddingTop:'15px'
      }}>


        <Col><h1>{category?.name?.fa}</h1></Col></Row>
      <Row className={'gap-10 justify-content-center product-category-classic'}>
        {tracks.length ? (
          tracks.map((i, idx) => (
            <Col
              key={idx}
              lg="3"
              md="3"
              sm="4"
              xs="6"
              className=" post-style-grid">
              <Headers entity={entity}/>
              {entity === 'product' && (
                <ProductCard item={i} method="grid" onClick={NoOp}/>
              )}
            </Col>
          ))
        ) : (
          <EmptyList/>
        )}
      </Row>

      {counts > 0 && (
        <MyPagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={Math.floor(counts)}
          rowsPerPage={limit}
          page={Math.floor(offset / limit)}
          labelRowsPerPage={t('number per row:')}
          nexticonbuttontext={t('next page')}
          previousiconbuttontext={t('previous page')}
          labelDisplayedRows={({page}) =>
            `${page + 1} ${t('from')} ${Math.floor(counts / limit) || 1}`
          }
          onPageChange={(e, newPage) => handleChangePage(e, newPage)}
          // @ts-ignore
          onRowsPerPageChange={(e, newLimit) =>
            handleChangeRowsPerPage(e, newLimit)
          }
        />
      )}


      {category?.description && category?.description?.['fa'] && (<Row className={'gap-10 justify-content-center product-category-classic'}>

        <Col><div className={'pt-5 product-category-description'} id={'description'}>

          <div
            className="d-inline-block item-icon-wrapper ki765rfg  hgfd"
            dangerouslySetInnerHTML={{ __html: category?.description?.['fa'] }}
          />

        </div></Col></Row>)}
    </>
  );
}

export default withTranslation()(ProductCategory);
