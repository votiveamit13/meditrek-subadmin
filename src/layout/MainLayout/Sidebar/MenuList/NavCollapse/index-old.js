import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Typography, ListItemIcon, ListItemText, Collapse, List, ListItemButton } from '@mui/material';

// project import
import NavItem from '../NavItem';
import { useLocation } from 'react-router-dom'; // ✅ added
// assets
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// ==============================|| NAV COLLAPSE ||============================== //

const NavCollapse = ({ menu, level }) => {
  const theme = useTheme();
  const { pathname } = useLocation(); // ✅ added
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(null);

  const handleClick = () => {
    setOpen(!open);
    setSelected(!selected ? menu.id : null);
  };

  // ✅ Auto select & open the correct menu based on current URL
  React.useEffect(() => {
    if (pathname.includes(menu.id)) {
      setOpen(true);
      setSelected(menu.id);
    }
  }, [pathname]);
  // -----------//

  const menus = menu.children.map((item) => {
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  const Icon = menu.icon;
  const menuIcon = menu.icon ? <Icon /> : <ArrowForwardIcon fontSize={level > 0 ? 'inherit' : 'default'} />;

  return (
    <>
      <ListItemButton
        sx={{
          borderRadius: '30px',
          mb: 1.2,
          pl: `${level * 16}px`,
          p:"8px 16px",
          color: '#1DDEC4',
          fontWeight: 500,
          transition: 'all .2s ease',

          '&:hover': {
            backgroundColor: '#1DDEC4',
            color: '#fff',
            '& .MuiListItemIcon-root': {
              color: '#fff'
            }
          },

          '&.Mui-selected': {
            backgroundColor: '#1DDEC4',
            color: '#fff',
            '& .MuiListItemIcon-root': {
              color: '#fff'
            }
          },
          ...(level > 1 && { backgroundColor: 'transparent !important', py: 1, borderRadius: '5px' })
        }}
        // selected={selected === menu.id}
        selected={pathname.includes(menu.id)} // ✅ updated
        onClick={handleClick}
      >
        <ListItemIcon  sx={{
    minWidth: 36,
    color: 'inherit'
  }}>{menuIcon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography variant={pathname.includes(menu.id) ? 'subtitle1' : 'body1'} color="inherit">
              {menu.title}
            </Typography>
          }
          secondary={
            menu.caption && (
              <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption, pl: 2 }} display="block" gutterBottom>
                {menu.caption}
              </Typography>
            )
          }
        />
        {open ? <ExpandLess sx={{ fontSize: '1rem' }} /> : <ExpandMore sx={{ fontSize: '1rem' }} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menus}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object,
  level: PropTypes.number,
  title: PropTypes.string,
  icon: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.string
};

export default NavCollapse;
