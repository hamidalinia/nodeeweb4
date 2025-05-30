import { useState } from 'react';
import {
  List,
  MenuItem,
  ListItemIcon,
  Typography,
  Collapse,
  Tooltip,
} from '@mui/material';

import {
  ExpandLessRounded,
  KeyboardArrowLeftRounded,
} from '@mui/icons-material';

import { useSidebarState } from 'react-admin';

const Wrapper = ({ open, text, children }) =>
  open ? (
    children
  ) : (
    <Tooltip title={text} placement="right" arrow>
      {children}
    </Tooltip>
  );

export default function SubMenu({ name, label, icon, children, dense }) {
  const [sidebarIsOpen] = useSidebarState();
  const [open, setOpen] = useState(false);

  const text = label || name;

  return (
    <>
      <Wrapper text={text} open={sidebarIsOpen || open}>
        <MenuItem dense={dense} onClick={() => setOpen((p) => !p)}>
          {icon}
          <Typography
            sx={{ width: '100%', mr: 1.5 }}
            variant="inherit"
            color="textSecondary">
            {text}
          </Typography>
          {open ? <ExpandLessRounded /> : <KeyboardArrowLeftRounded />}
        </MenuItem>
      </Wrapper>

      <Collapse in={open} sx={{ pr: 4 }} timeout="auto" unmountOnExit>
        <List
          dense={dense}
          component="div"
          disablePadding
          sx={{
            '& a': {
              transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
              paddingLeft: sidebarIsOpen ? 4 : 2,
            },
          }}>
          {children}
        </List>
      </Collapse>
    </>
  );
}
