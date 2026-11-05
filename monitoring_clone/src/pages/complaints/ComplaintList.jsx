import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComplaintFilter from "../../components/complaint/ComplaintFilter";
import ComplaintTable from "../../components/complaint/ComplaintTable";
import {
  ComplaintTypeSummaryChart,
  RegionSummaryChart,
} from "../../components/charts/ComplaintCharts";
import {
  getComplaintChartData,
  getComplaintList,
} from "../../api/complaintApi";

const statusTabs = ["전체", "접수", "처리중", "완료", "지연"];

const ComplaintList = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [type, setType] = useState("전체");
  const [status, setStatus] = useState("전체");
  const [search, setSearch] = useState("");
  const { complaints } = getComplaintList();
  const chartData = getComplaintChartData();

  const filteredComplaints = useMemo(
    () =>
      complaints.filter((complaint) => {
        const matchesStatus = status === "전체" || complaint.status === status;
        const matchesType = type === "전체" || complaint.type === type;
        const query = search.trim().toLowerCase();
        const matchesSearch =
          !query ||
          Object.values(complaint).some((value) =>
            String(value).toLowerCase().includes(query),
          );
        return matchesStatus && matchesType && matchesSearch;
      }),
    [complaints, search, status, type],
  );

  return (
    <main className="basic-page complaint-page">
      <div className="complaint-heading">
        <div>
          <h1>민원 목록</h1>
          <p>접수된 민원을 확인하고 처리 현황을 관리할 수 있습니다.</p>
        </div>
        <div className="complaint-date-top">2026.10.01 ~ 2026.10.31⌄</div>
      </div>
      <ComplaintFilter
        keyword={keyword}
        type={type}
        onKeywordChange={setKeyword}
        onTypeChange={setType}
        onSearch={() => setSearch(keyword)}
      />
      <div className="status-tabs">
        {statusTabs.map((tab) => (
          <button
            type="button"
            className={status === tab ? "active" : ""}
            key={tab}
            onClick={() => setStatus(tab)}>
            {tab === "지연" && <i />} {tab}
          </button>
        ))}
      </div>
      <ComplaintTable
        complaints={filteredComplaints}
        onView={(complaint) => navigate(`/complaints/${complaint.number}`)}
      />
      <div className="complaint-summary-grid">
        <section className="panel">
          <div className="panel-title">
            <h2>민원 유형별 현황</h2>
            <a className="more" href="/dashboard">
              더보기 ›
            </a>
          </div>
          <div className="complaint-donut-content">
            <div className="highchart highchart--donut">
              <ComplaintTypeSummaryChart data={chartData} />
            </div>
            <div className="legend">
              {chartData.types.map(({ name, value, color }) => (
                <div key={name}>
                  <i
                    className="legend-dot"
                    style={{ backgroundColor: color }}
                  />
                  {name}
                  <b>{value}%</b>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="panel">
          <div className="panel-title">
            <h2>지역별 민원 현황</h2>
            <a className="more" href="/complaints/map">
              더보기 ›
            </a>
          </div>
          <div className="region-summary">
            <div className="highchart highchart--region">
              <RegionSummaryChart data={chartData.regions} />
            </div>
            <ol>
              {chartData.regions.map(({ name, value, percent }) => (
                <li key={name}>
                  <b>{name}</b>
                  <span>{value}건</span>
                  <em>{percent}%</em>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ComplaintList;
