import { FiBell, FiChevronDown, FiMenu, FiX } from "react-icons/fi";

const Header = ({ isSidebarOpen, onToggleSidebar }) => (
  <header className="topbar">
    <button className="mobile-toggle" onClick={onToggleSidebar} aria-label="메뉴 열기">
      {isSidebarOpen ? <FiX /> : <FiMenu />}
    </button>
    <div className="topbar-actions">
      <FiBell className="bell" />
      <span className="avatar">●</span>
      <span>관리자</span>
      <FiChevronDown />
    </div>
  </header>
);

export default Header;
