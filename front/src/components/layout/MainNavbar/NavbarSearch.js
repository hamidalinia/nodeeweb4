import { useState } from 'react';
import {
  Form,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  NavLink,
} from 'shards-react';
import { NavLink as RouteNavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { SearchIt, isClient } from '#c/functions';
import store from '#c/functions/store';

import { toggleSearch } from '#c/functions/index';
import Loading from '@/components/Loading';
import EmptyList from '@/components/common/EmptyList';

export default function NavbarSearch({
  className,
  entity,
  style = {},
  classes = '',
}) {
  const { t } = useTranslation();

  const [searchT, setSearchText] = useState(() => {
    if (isClient) {
      const url = new URL(window.location.href);
      return url.searchParams.get('search') || '';
    }
    return '';
  });

  const [loading, setLoading] = useState(false);
  const [openBox, SetOpenBox] = useState(false);
  const [data, SetData] = useState([]);
  const lan = store.getState().store.lan || 'fa';
  const searchform = useSelector((st) => !!st.store.searchvisible);

  const handleClick = () => toggleSearch(searchform);

  const handleEvent = (T) => {
    // console.log('s', T);
    if (T) {
      setSearchText(T);
      // SetOpenBox(true);
      SearchIt(T).then((posts) => {
        // console.log('posts', posts);
        // if (posts.success)
        // this.setState({ load: true, searchT: s, data: posts });
        // if (posts.length > 0)
        SetData(posts);
        setLoading(true);
      });
    } else {
      SetOpenBox(false);
      setLoading(false);
      setSearchText('');
    }
  };
  const va = () => {
    SetData([]);
    setLoading(false);
    SetOpenBox(false);
  };
  const onClickX = () => {
    console.log('onClickX');
    SetData([]);
    setLoading(false);
    SetOpenBox(false);

    setSearchText('');
    // this.setState({searchT: ''});
  };
  const onCloseSearch = () => {
    console.log('onCloseSearch');
    SetData([]);
    setLoading(false);
    SetOpenBox(false);

    setSearchText('');
    handleClick();
    // this.setState({searchT: ''});
  };

  return (
    <Form
      style={style}
      action={isClient ? `${window.location.origin}/${entity}` : ''}
      className={clsx(
        'main-navbar__search w-100 d-md-flex d-lg-flex desktopnoned stf posrel mindfghj',
        className,
        classes
      )}>
      <InputGroup seamless className="">
        <FormInput
          className="navbar-search"
          placeholder={t('search please...')}
          value={searchT}
          name="search"
          onChange={(event) => {
            // onChange(event.target.value);
            handleEvent(event.target.value);
          }}
        />

        {openBox && (
          <InputGroupAddon
            type="append"
            className={'clickable'}
            onClick={(event) => {
              onClickX();
            }}>
            <InputGroupText>
              <CloseIcon />
            </InputGroupText>
          </InputGroupAddon>
        )}
        <InputGroupAddon
          className="frtyuioiuy"
          type="append"
          onClick={(event) => {
            console.log('event', event);
          }}>
          <InputGroupText>
            <SearchIcon />
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {openBox && (
        <div className="sdfgde">
          {loading ? (
            <Loading />
          ) : data.length > 0 ? (
            <>
              {data.map((da, dai) => (
                <div className={'search_item'} key={dai}>
                  <NavLink
                    exact
                    tag={RouteNavLink}
                    to={da.url}
                    onClick={() => {
                      va();
                      onCloseSearch();
                    }}>
                    {/*{da.photo && <div className={'search_image'}><img src={da.photo}/></div>}*/}
                    <div className="search_title">
                      <div>{da.title[lan]}</div>
                      <div>
                        {da && da.data && da.data.commercialbenefit
                          ? da.data.commercialbenefit
                          : ''}
                      </div>
                    </div>
                  </NavLink>
                </div>
              ))}
              <div className="search_item textAlignCenter">
                <NavLink
                  exact
                  tag={RouteNavLink}
                  to={'/products/0/20?search=' + searchT}
                  onClick={() => {
                    onCloseSearch();
                  }}>
                  <div className="search_title"> {t('show all')}</div>
                </NavLink>
              </div>
            </>
          ) : (
            <EmptyList />
          )}
        </div>
      )}
    </Form>
  );
}
