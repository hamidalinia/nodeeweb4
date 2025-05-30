import { useState } from 'react';
import { Button, Form, FormInput, InputGroup } from 'shards-react';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import clsx from 'clsx';

import { isClient } from '@/functions';

export default function NavbarSearch({ className, style = {}, classes = '' }) {
  const [searchT, setSearchText] = useState(() => {
    if (isClient) {
      const url = new URL(window.location.href);
      return url.searchParams.get('search') || '';
    }
    return '';
  });

  const navigate = useNavigate();

  const handleTheClick = (e) => {
    e.preventDefault();

    if (searchT) navigate('/initem/0/15?search=' + searchT);
  };

  return (
    <Form
      style={style}
      onSubmit={(e) => handleTheClick(e)}
      className={clsx(
        'main-navbar__search d-md-flex d-lg-flex desktopnoned stf posrel mindfghj',
        className,
        classes
      )}>
      <InputGroup seamless>
        <FormInput
          className="navbar-search"
          placeholder="جستجوی کالا، خدمات..."
          value={searchT}
          name="search"
          type="search"
          onChange={(event) => {
            // onChange(event.target.value);
            setSearchText(event.target.value);
          }}
        />

        <Button
          theme="secondary"
          type={'button'}
          className={'initem-search-button'}
          onClick={(e) => handleTheClick(e)}>
          <span style={{ fontSize: '16px' }}>جستجو</span>

          <SearchIcon className="thisis" style={{ marginRight: '10px' }} />
        </Button>
      </InputGroup>
    </Form>
  );
}
