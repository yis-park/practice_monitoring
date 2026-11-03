import { NavLink } from "react-router-dom";
import {
  FiChevronDown,
  FiClipboard,
  FiGrid,
  FiSettings,
  FiShield,
  FiSpeaker,
} from "react-icons/fi";

const menuGroups = [
  { label: "민원 현황", icon: FiGrid, to: "/" },
  {
    label: "민원 관리",
    icon: FiClipboard,
    to: "/complaints",
    children: [["민원 목록", "/complaints"], ["민원 접수", "/complaints/create"], ["민원 지도", "/complaints/map"]],
  },
  {
    label: "처리 관리",
    icon: FiShield,
    to: "/management/status",
    children: [["처리 현황", "/management/status"], ["담당 관리", "/management/answer"], ["처리 이력", "/management/history"]],
  },
  { label: "공지사항", icon: FiSpeaker, to: "/notices" },
  { label: "시스템 설정", icon: FiSettings, to: "/settings" },
];

const Sidebar = ({ isOpen }) => (
  <aside className={`sidebar ${isOpen ? "" : "sidebar--closed"}`}>
    <div className="brand">
      <span className="brand-mark">◒</span>
      <span>환경 민원<br />관리 시스템</span>
    </div>
    <nav className="sidebar-nav" aria-label="주 메뉴">
      {menuGroups.map(({ label, icon: Icon, to, children }) => (
        <div className="nav-group" key={label}>
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "nav-item--active" : ""}`}
            to={to}
            end={to === "/"}
          >
            <Icon />
            <span>{label}</span>
            {children && <FiChevronDown className="nav-arrow" />}
          </NavLink>
          {children && (
            <div className="nav-children">
              {children.map(([child, childPath]) => <NavLink to={childPath} key={child}>{child}</NavLink>)}
            </div>
          )}
        </div>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
