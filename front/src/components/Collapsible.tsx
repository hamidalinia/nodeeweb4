import { useCallback, useState } from 'react';
import { List, ListItemButton, ListItemText, Collapse } from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  HighlightOffRounded,
} from '@mui/icons-material';

import { useSearchParams } from 'react-router-dom';

const MenuItem = ({ isActive, title, onToggle }) => {
  return (
    <ListItemButton selected={isActive} onClick={onToggle}>
      <ListItemText primary={title} />
      {isActive ? <HighlightOffRounded fontSize="small" /> : null}
    </ListItemButton>
  );
};

export default function Collapsible({
  item,
  children = [],
  slug,
  defaultOpened = false,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(defaultOpened);
  const handleClick = () => setOpen(!open);

  const ActiveItem = searchParams.get(slug);

  const handleToggle = useCallback(
    (value) => {
      setSearchParams((p) => {
        const isActive = p.get(slug) === value;
        // toggle
        if (isActive) p.delete(slug);
        else p.set(slug, value);

        p.set('offset', '0');
        return p;
      });
    },
    [slug, setSearchParams]
  );

  if (!children.length)
    return (
      <MenuItem
        title={item.name?.fa}
        isActive={ActiveItem === item.slug}
        onToggle={() => handleToggle(item.slug)}
      />
    );

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper', py: 0.5 }}>
      <ListItemButton onClick={handleClick}>
        <ListItemText primary={item.name?.fa} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children?.map((i, idx) => (
            <MenuItem
              key={idx}
              title={i.name?.fa}
              isActive={ActiveItem === i.slug}
              onToggle={() => handleToggle(i.slug)}
            />
          ))}
        </List>
      </Collapse>
    </List>
  );
}
