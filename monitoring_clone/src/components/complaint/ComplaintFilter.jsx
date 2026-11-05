import { FiCalendar, FiChevronDown, FiSearch } from "react-icons/fi";

const ComplaintFilter = ({
  keyword,
  type,
  onKeywordChange,
  onTypeChange,
  onSearch,
}) => (
  <div className="complaint-filter">
    <select
      value={type}
      onChange={(event) => onTypeChange(event.target.value)}
      aria-label="민원 유형">
      <option value="전체">전체</option>
      <option value="악취">악취</option>
      <option value="대기오염">대기오염</option>
      <option value="수질오염">수질오염</option>
      <option value="소음·진동">소음·진동</option>
      <option value="기타">기타</option>
    </select>
    <FiChevronDown className="filter-chevron" />
    <div className="complaint-search">
      <input
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
        onKeyDown={(event) => event.key === "Enter" && onSearch()}
        placeholder="검색어를 입력하세요. (접수번호, 제목, 신고자 등)"
        aria-label="민원 검색"
      />
      <button type="button" onClick={onSearch}>
        <FiSearch /> 검색
      </button>
    </div>
    <div className="complaint-date">
      <FiCalendar /> 2026.10.01 ~ 2026.10.31 <FiChevronDown />
    </div>
  </div>
);

export default ComplaintFilter;
