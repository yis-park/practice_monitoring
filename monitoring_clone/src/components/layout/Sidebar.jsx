import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiChevronDown,
  FiChevronUp,
  FiClipboard,
  FiGrid,
  FiSettings,
  FiShield,
  FiSpeaker,
} from "react-icons/fi";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { getNavigationMenu } from "../../api/navigationApi";

const iconMap = {
  grid: FiGrid,
  clipboard: FiClipboard,
  shield: FiShield,
  speaker: FiSpeaker,
  settings: FiSettings,
};

const SidebarLink = ({
  to,
  end = false,
  onClick,
  children,
  className = "",
  activeClassName = "active",
}) => (
  <ListItem disablePadding>
    <NavLink to={to} end={end} onClick={onClick} className="sidebar-link">
      {({ isActive }) => (
        <ListItemButton
          component="span"
          className={`${className} ${isActive ? activeClassName : ""}`}>
          {children}
        </ListItemButton>
      )}
    </NavLink>
  </ListItem>
);

const MenuList = ({
  menuGroups,
  expandedMenus,
  handleMenuClick,
  onNavigate,
}) => (
  <List className="sidebar-nav" aria-label="주 메뉴">
    {menuGroups.map(({ label, icon, to, children }) => {
      const Icon = iconMap[icon];

      return (
        <Box className="nav-group" key={label}>
          <SidebarLink
            to={to}
            end={to === "/"}
            className={`nav-item ${children ? "nav-item--group" : ""}`}
            activeClassName={children ? "" : "nav-item--active"}
            onClick={() => handleMenuClick(label, Boolean(children))}>
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={label} />
            {children &&
              (expandedMenus[label] ? (
                <FiChevronUp className="nav-arrow" />
              ) : (
                <FiChevronDown className="nav-arrow" />
              ))}
          </SidebarLink>
          {children && expandedMenus[label] && (
            <List className="nav-children">
              {children.map(({ label: childLabel, to: childPath }) => (
                <SidebarLink
                  to={childPath}
                  end
                  key={childPath}
                  className="nav-child-item"
                  activeClassName="active"
                  onClick={onNavigate}>
                  <ListItemText primary={childLabel} />
                </SidebarLink>
              ))}
            </List>
          )}
        </Box>
      );
    })}
  </List>
);

const Sidebar = ({ mobileMenuOpen, onMobileNavigate }) => {
  const menuGroups = getNavigationMenu();
  const [expandedMenus, setExpandedMenus] = useState(() =>
    menuGroups.reduce((expanded, menu) => {
      if (menu.children) expanded[menu.label] = true;
      return expanded;
    }, {}),
  );
  const toggleMenu = (label) => {
    setExpandedMenus((current) => ({ ...current, [label]: !current[label] }));
  };
  const handleMenuClick = (label, hasChildren) => {
    if (hasChildren) {
      toggleMenu(label);
    }
    onMobileNavigate?.();
  };

  return (
    <>
      <Drawer className="sidebar-drawer" variant="permanent" anchor="left">
        <NavLink to="/" className="brand">
          <span className="brand-mark">◒</span>
          <span>
            환경 민원
            <br />
            관리 시스템
          </span>
        </NavLink>
        <Divider />
        <MenuList
          menuGroups={menuGroups}
          expandedMenus={expandedMenus}
          handleMenuClick={handleMenuClick}
        />
      </Drawer>
      {mobileMenuOpen && (
        <Box className="mobile-menu">
          <MenuList
            menuGroups={menuGroups}
            expandedMenus={expandedMenus}
            handleMenuClick={handleMenuClick}
            onNavigate={onMobileNavigate}
          />
        </Box>
      )}
    </>
  );
};

export default Sidebar;
