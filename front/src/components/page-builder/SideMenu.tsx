import { useEffect, useState, memo } from 'react';
import { Button, Col } from 'shards-react';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import _get from 'lodash/get';

import { getEntitiesWithCount } from '@/functions';
import Collapsible from '@/components/Collapsible';
import Loading from '@/components/common/Loading';

import { parseData } from '@/components/page-builder/add-advertise/SidebarCategories';

const MenuItems = ({ items, filterParameter }) =>
  items && items.map((i, idx) => (
    <Collapsible
      key={idx}
      item={i}
      children={i.children}
      slug={filterParameter}
    />
  ));

function SideMenu({ element = {} as any, params = {} as any }) {
  const [tracks, setTracks] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const fields = _get(element, 'settings.general.fields', {});
  const Filter_Parameter = fields.filterParameter || 'product-category';
  const { customQuery, populateQuery } = fields;

  if (!params.offset) params.offset = 0;
  if (!params.limit) params.limit = 24;

  const loadProductItems = async (page, filter = {}) => {
    setTracks([]);
    setLoading(true);
    let query = {};

    if (customQuery)
      Object.keys(customQuery).forEach((item) => {
        let main = customQuery[item];

        main = main.replace('params._id', JSON.stringify(params._id));

        query[item] = JSON.parse(main);
      });

    if (query) {
      filter = JSON.stringify(query);
    }
    // let newOffset = (await offset) + 24;
    getEntitiesWithCount(
      'attributes',
      params.offset,
      params.limit,
      false,
      JSON.stringify({ useInFilter: true }),
      JSON.stringify(populateQuery)
    )
      .then((resp) => {
        const { items } = resp;

        let trackss = [...tracks];
        if (items && items.length) {
          items.forEach((item) => trackss.push(item));
          setTracks([...trackss]);
        }
      })
      .finally(() => setLoading(false));
  };
  const loadProductCategories = async (page, filter = {}) => {
    // setcats([])
    // settheload2(true)
    let query = {};

    if (customQuery)
      Object.keys(customQuery).forEach((item) => {
        let main = customQuery[item];
        main = main.replace('params._id', JSON.stringify(params._id))
        query[item] = JSON.parse(main)
      })
    if (query) {
      filter = JSON.stringify(query)
    }
    getEntitiesWithCount('productCategory', params.offset, params.limit, "", filter, JSON.stringify(populateQuery)).then((resp) => {
      afterGetDataPC(resp);
    });
  };
  const afterGetDataPC = (resp, tracks = []) => {
    console.log('afterGetData', resp, tracks)
    let trackss = [...tracks],
      {items, count} = resp;
    // if (resp.length < 24) sethasMoreItems(false);
    // console.log("resp", resp);
    if (items && items.length) {
      items.forEach((item) => {
        trackss.push(item);
      });
      console.log('set data:set data:set data:set data:set data:', trackss)
      setCats([...trackss]);
      // setcount(count);
      // settheload2(false)

      // if (resp && resp.length < 1) sethasMoreItems(false);
    } else {
      // sethasMoreItems(false);
      // setLoad(false);
      // settheload2(false)

    }
  };

  useEffect(() => {
    loadProductItems(0);
    loadProductCategories(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMobile = window && window.innerWidth < 768;

  return (
    <>
      {loading && <Loading />}
      {!loading2 && (
        <div className="d-flex justify-content-space-between align-items-center">
          <label className="the-label-head">فیلتر ها</label>
          {isMobile && (
            <Button
              className="set-filters"
              onClick={() => setOpenFilter((p) => !p)}>
              <FilterAltIcon />
            </Button>
          )}
        </div>
      )}
      <hr className="the-label-hr" />

      {!loading && (
        <Col className="main-content2 iuytfghj pb-5" sm="12" tag="nav">

          {isMobile && openFilter && (<>
            <MenuItems items={tracks} filterParameter={Filter_Parameter} />

            <MenuItems items={cats} filterParameter={Filter_Parameter} /></>
          )}
          {!isMobile && (
            <>
            <MenuItems items={tracks} filterParameter={Filter_Parameter} />

            <MenuItems items={cats} filterParameter={Filter_Parameter} /></>
          )}
        </Col>
      )}
    </>
  );
}

export default memo(SideMenu);
