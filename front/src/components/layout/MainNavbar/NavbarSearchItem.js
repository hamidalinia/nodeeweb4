import { useState } from 'react';
import {
  Button,
  Form,
  FormInput,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  NavLink,
} from 'shards-react';
import clsx from 'clsx';

// import { useTranslation } from 'react-i18next'
import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import { useNavigate } from 'react-router-dom';
// import {toggleSearch} from '#c/functions/index';
import { NavLink as RouteNavLink } from 'react-router-dom';
import { isClient, SearchItItem, toggleSearch } from '#c/functions/index';
import store from '#c/functions/store';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
// class NavbarSearch extends React.Component {
// history = useNavigate();
function NavbarSearchItem({
  className,
  type = 'prepend',
  t,
  style = {},
  classes = '',
}) {
  let url = isClient ? new URL(window.location.href) : '';
  let searchd = isClient ? url.searchParams.get('search') || '' : '';
  let [searchT, SetSearchText] = useState(searchd || '');
  let [load, SetLoad] = useState(false);
  let [openBox, SetOpenBox] = useState(false);
  let [data, SetData] = useState([]);
  let [loadBtn, setLoadBtn] = useState(false);

  let [lan, setLan] = useState(store.getState().store.lan || 'fa');
  const searchform = useSelector((st) => !!st.store.searchvisible);
  const navigate = useNavigate();

  const handleClick = () => toggleSearch(searchform);

  // const formRef = useRef(null);
  // const searchform = useSelector((st) => !!st.store.searchvisible);
  //
  // useEffect(() => {
  //   console.log('useEffect', searchT);
  // }, [searchT]);

  // constructor(props) {
  //   super(props);
  //
  //   let url = new URL(window.location.href);
  //   let search = url.searchParams.get("search") || "";
  //   console.log('search', search);
  //   this.state = {
  //     search: search,
  //     t: false
  //   };
  //   // this.handleEvent = this.handleEvent.bind(this);
  // }
  //
  //
  // render() {
  //
  //   const {onChange,t}=this.props;
  //
  //   console.log('this.search', this.state.search,this.props);
  //   if (this.state.t) {
  //     // const history = useNavigate();
  //     // history.push("/?"+this.state.search);
  //   }
  const handleTheClick = (e) => {
    e.preventDefault();
    console.log('handleTheClick', searchT);
    if (searchT) {
      navigate('/item?search=' + searchT);
    }
  };
  const handleEvent = (T) => {
    // console.log('s', T);
    if (T) {
      SetSearchText(T);
      // SetOpenBox(true);
      // SearchItItem(T).then((posts) => {
      //   console.log('posts', posts);
      //   // if (posts.success)
      //   // this.setState({ load: true, searchT: s, data: posts });
      //   // if (posts.length > 0)
      //   SetData(posts);
      //   SetLoad(true);
      // });
    } else {
      // SetOpenBox(false);
      SetLoad(false);
      SetSearchText('');
    }
  };
  const va = () => {
    SetData([]);
    SetLoad(false);
    SetOpenBox(false);
  };
  const onClickX = () => {
    console.log('onClickX');
    SetData([]);
    SetLoad(false);
    SetOpenBox(false);

    SetSearchText('');
    // this.setState({searchT: ''});
  };
  const onCloseSearch = () => {
    console.log('onCloseSearch');
    SetData([]);
    SetLoad(false);
    SetOpenBox(false);

    SetSearchText('');
    handleClick();
    // this.setState({searchT: ''});
  };
  const loader = (
    <div className="loadNotFound loader ">
      {t('loading...')}
      <LoadingComponent />
    </div>
  );

  return (
    <Form
      style={style}
      onSubmit={(e) => handleTheClick(e)}
      // action={isClient ? (window.location.origin + '/item') : ''}
      className={clsx(
        'main-navbar__search w-100 d-md-flex d-lg-flex desktopnoned stf posrel mindfghj' +
          className,

        classes
      )}>
      <InputGroup seamless className="">
        <FormInput
          className="navbar-search"
          placeholder={'جستجوی ارزش صادراتی...'}
          value={searchT}
          name="search"
          onChange={(event) => {
            // onChange(event.target.value);
            handleEvent(event.target.value);
          }}
        />
        {!openBox && (
          <Button
            theme="secondary"
            type={'button'}
            className={'initem-search-button'}
            onClick={(e) => handleTheClick(e)}>
            {loadBtn ? (
              <p>Loading...</p>
            ) : (
              <span style={{ fontSize: '16px' }}>جستجو</span>
            )}
            <SearchIcon className="thisis" style={{ marginRight: '10px' }} />
          </Button>
        )}
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
      </InputGroup>
      {openBox && (
        <div className={'sdfgde'}>
          {!load && loader}
          {load &&
            data.length > 0 && [
              data.map((da, dai) => {
                return (
                  <div className={'search_item'} key={dai}>
                    <NavLink
                      exact
                      tag={RouteNavLink}
                      to={'#'}
                      onClick={() => {
                        va();
                        onCloseSearch();
                      }}>
                      {/*{da.photo && <div className={'search_image'}><img src={da.photo}/></div>}*/}
                      <div className={'search_title'}>
                        <div>{da.title[lan]}</div>
                        <div className={'d-flex justify-content-sb'}>
                          <span className={'d-f-item'}>
                            <span>ردیف تعرفه:</span>
                            <span>{da && da.sku ? ' ' + da.sku : ''}</span>
                          </span>
                          <span className={'d-f-item'}>
                            <span>ارزش گمرکی:</span>
                            <span>
                              {da && da.data && da.data.arzesh
                                ? ' ' + da.data.arzesh
                                : ''}
                            </span>
                          </span>
                          <span className={'d-f-item'}>
                            <span>نوع ارز:</span>
                            <span>
                              {da && da.data && da.data.dolar
                                ? ' ' + da.data.dolar
                                : ''}
                            </span>
                          </span>
                          <span className={'d-f-item'}>
                            <span>واحد کالا:</span>
                            <span>
                              {da && da.data && da.data.number
                                ? ' ' + da.data.number
                                : ''}
                            </span>
                          </span>
                        </div>
                      </div>
                    </NavLink>
                  </div>
                );
              }),
              <div className={'search_item textAlignCenter'}>
                {/*<NavLink exact tag={RouteNavLink} to={'/products/0/20?search=' + searchT} onClick={() => {*/}
                {/*onCloseSearch()*/}
                {/*}}>*/}
                {/*<div className={'search_title'}> {t('show all')}</div>*/}
                {/*</NavLink>*/}
              </div>,
            ]}
          {load && data.length < 1 && t('nothing found...')}
        </div>
      )}
      <div
        className={'jhgfghj'}
        onClick={(event) => {
          onCloseSearch();
        }}></div>
    </Form>
  );
}

export default withTranslation()(NavbarSearchItem);
