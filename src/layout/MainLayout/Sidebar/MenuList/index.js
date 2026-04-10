import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Divider
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import GroupIcon from "@mui/icons-material/Group";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DescriptionIcon from "@mui/icons-material/Description";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';

import { APP_PREFIX_PATH } from "../../../../../src/config";

const menu = [
  {
    title: "Dashboard",
    icon: <HomeOutlinedIcon />,
    url: APP_PREFIX_PATH + "/dashboard"
  },
  {
    title: "My Patients",
    icon: <GroupIcon />,
    url: APP_PREFIX_PATH + "/patients"
  },
  {
    title: "Analytics",
    icon: <AutoGraphIcon />,
    url: APP_PREFIX_PATH + "/analytics"
  },
  {
    title: "Tabular Report",
    icon: <BackupTableIcon />,
    children: [
      {
        title: "Shared Information",
        icon: <DescriptionIcon />,
        url: APP_PREFIX_PATH + "/tabular-report/shared-report"
      }
    ]
  },
  {
    title: "New Insights",
    icon: <SignalCellularAltIcon />,
    url: APP_PREFIX_PATH + "/new-insights"
  },
];

const bottomMenu = [
  {
    title: "Contact Us",
    icon: <ContactSupportIcon />,
    url: APP_PREFIX_PATH + "/manage-contact-us"
  }
  // {
  //   title: "More Info",
  //   icon: <DescriptionIcon />,
  //   url: APP_PREFIX_PATH + "/more-info"
  // }
];

const MenuList = ({ collapsed }) => {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState({});
  const isActive = (url) => {
    return location.pathname === url;
  };
  const toggleMenu = (title) => {
    setOpenMenu((prev) => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const isChildActive = (children) => {
    if (!children) return false;
    return children.some((child) => location.pathname === child.url);
  };

  React.useEffect(() => {
    const newOpenMenu = {};

    menu.forEach((item) => {
      if (item.children) {
        const childActive = item.children.some(
          (child) => location.pathname === child.url
        );

        if (childActive) {
          newOpenMenu[item.title] = true;
        }
      }
    });

    setOpenMenu(newOpenMenu);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      {/* TOP MENU */}
      <List>
        {menu.map((item) => (
          <React.Fragment key={item.title}>
            <ListItemButton
              component={item.url ? Link : "div"}
              to={item.url || undefined}
              onClick={() => item.children && toggleMenu(item.title)}
              selected={isActive(item.url) || isChildActive(item.children)}
              sx={{
                mb: 0.5,
                px: collapsed ? 1 : 1.5,
                py: 0.8,
                justifyContent: collapsed ? "center" : "flex-start",
                "&.Mui-selected": {
                  background: "rgba(29,222,196,0.15)",
                  borderLeft: "4px solid #1ddec4"
                },

                "&.Mui-selected:hover": {
                  background: "rgba(29,222,196,0.20)"
                },

                "&:hover": {
                  background: "rgba(29,222,196,0.08)"
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  color: "#1ddec4"
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && <ListItemText primary={item.title} />}

              {!collapsed &&
                item.children &&
                (openMenu[item.title] ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>

            {/* SUBMENU */}
            {item.children && (
              <Collapse in={openMenu[item.title]} timeout="auto" unmountOnExit>
                <List disablePadding sx={{
                  px: 1,
                  width: "100%"
                }}>
                  {item.children.map((child) => (
                    <ListItemButton
                      key={child.title}
                      component={Link}
                      to={child.url}
                      selected={isActive(child.url)}
                      sx={{
                        mb: 0.5,
                        width: "100%",
                        px: collapsed ? 0 : 2,
                        py: 0.8,
                        justifyContent: collapsed ? "center" : "flex-start",
                        "&.Mui-selected": {
                          color: "#1ddec4",
                          fontWeight: 600
                        },

                        "&:hover": {
                          background: "rgba(29,222,196,0.08)"
                        }
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: collapsed ? "100%" : 32,
                          color: "#1ddec4"
                        }}
                      >
                        {child.icon}
                      </ListItemIcon>

                      {!collapsed && <ListItemText primary={child.title} />}
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* BOTTOM MENU */}
      <Box  style={{  width: "100%",
    position: "absolute",
    bottom: "60px"}}>
        <Divider className="border-2" />

        <List>
          {bottomMenu.map((item) => (
            <ListItemButton
              key={item.title}
              component={Link}
              to={item.url}
              sx={{
                mb: 0.5,
                px: collapsed ? 1 : 1.5,
                py: 0.8,
                justifyContent: collapsed ? "center" : "flex-start",
                "&.Mui-selected": {
                  background: "rgba(29,222,196,0.15)",
                  borderLeft: "4px solid #1ddec4"
                },

                "&.Mui-selected:hover": {
                  background: "rgba(29,222,196,0.20)"
                },

                "&:hover": {
                  background: "rgba(29,222,196,0.08)"
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  color: "#1ddec4"
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <ListItemText primary={item.title} />
              )}
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default MenuList;