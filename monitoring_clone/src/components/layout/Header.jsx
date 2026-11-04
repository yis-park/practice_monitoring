import { FiBell, FiChevronDown, FiMenu, FiX } from "react-icons/fi";

const Header = ({ mobileMenuOpen, onToggleMobileMenu }) => (
  <header className="topbar">
    <button
      className="mobile-menu-button"
      type="button"
      onClick={onToggleMobileMenu}
      aria-label="메뉴 열기"
      aria-expanded={mobileMenuOpen}
    >
      {mobileMenuOpen ? <FiX /> : <FiMenu />}
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
