import { useEffect, useRef, useState } from "react";
import { FiDownload, FiExternalLink } from "react-icons/fi";

const ComplaintTable = ({ complaints, onView }) => {
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const selectAllRef = useRef(null);
  const visibleNumbers = complaints.map(({ number }) => number);
  const selectedVisibleCount = visibleNumbers.filter((number) =>
    selectedNumbers.includes(number),
  ).length;
  const allVisibleSelected =
    visibleNumbers.length > 0 && selectedVisibleCount === visibleNumbers.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedVisibleCount > 0 && !allVisibleSelected;
    }
  }, [allVisibleSelected, selectedVisibleCount]);

  const handleSelectAll = (event) => {
    setSelectedNumbers((current) => {
      if (event.target.checked) {
        return [...new Set([...current, ...visibleNumbers])];
      }
      return current.filter((number) => !visibleNumbers.includes(number));
    });
  };

  const handleSelect = (number, checked) => {
    setSelectedNumbers((current) =>
      checked
        ? [...new Set([...current, number])]
        : current.filter((selectedNumber) => selectedNumber !== number),
    );
  };

  return (
    <section className="complaint-table-panel panel">
    <div className="complaint-table-heading">
      <h2>총 245건</h2>
      <button type="button" className="download-button">
        <FiDownload /> 엑셀 다운로드
      </button>
    </div>
    <div className="table-scroll">
      <table className="complaint-table">
        <thead>
          <tr>
            <th>
              <input
                ref={selectAllRef}
                type="checkbox"
                aria-label="전체 선택"
                checked={allVisibleSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th>접수번호</th>
            <th>접수일시</th>
            <th>민원 유형</th>
            <th>신고자</th>
            <th>위치</th>
            <th>처리 상태</th>
            <th>담당자</th>
            <th>상세보기</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => (
            <tr key={complaint.number}>
              <td>
                <input
                  type="checkbox"
                  aria-label={`${complaint.number} 선택`}
                  checked={selectedNumbers.includes(complaint.number)}
                  onChange={(event) =>
                    handleSelect(complaint.number, event.target.checked)
                  }
                />
              </td>
              <td className="complaint-number">{complaint.number}</td>
              <td>{complaint.receivedAt}</td>
              <td>
                <span
                  className={`type-badge type-badge--${complaint.type === "악취" ? "blue" : complaint.type === "대기오염" ? "green" : complaint.type === "수질오염" ? "purple" : "orange"}`}>
                  {complaint.type}
                </span>
              </td>
              <td>{complaint.reporter}</td>
              <td>{complaint.location}</td>
              <td>
                <span className={`status status--${complaint.statusTone}`}>
                  {complaint.status}
                </span>
              </td>
              <td>{complaint.assignee}</td>
              <td>
                <button
                  type="button"
                  className="view-button"
                  onClick={() => onView(complaint)}>
                  보기 <FiExternalLink />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="table-footer">
      <span>전체 245건 중 1~8건 표시</span>
      <div className="pagination">
        <button type="button">«</button>
        <button type="button">‹</button>
        <button type="button" className="active">
          1
        </button>
        <button type="button">2</button>
        <button type="button">3</button>
        <button type="button">4</button>
        <button type="button">5</button>
        <button type="button">›</button>
        <button type="button">»</button>
      </div>
      <span className="page-size">
        10개 <FiDownload />
      </span>
    </div>
    </section>
  );
};

export default ComplaintTable;
