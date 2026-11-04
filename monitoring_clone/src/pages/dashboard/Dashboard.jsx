import { FiAlertCircle, FiCheck, FiClock } from "react-icons/fi";
import {
  ComplaintTypeChart,
  ProcessingTrendChart,
  RegionComplaintChart,
} from "../../components/charts/DashboardCharts";
import { getDashboardChartData } from "../../api/dashboardApi";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";

const chartData = getDashboardChartData();

const stats = [
  {
    label: "전체 민원 수",
    key: "total",
    suffix: "건",
    tone: "blue",
    icon: FiAlertCircle,
  },
  {
    label: "처리 완료",
    key: "completed",
    suffix: "건",
    tone: "green",
    icon: FiCheck,
  },
  {
    label: "처리 중",
    key: "inProgress",
    suffix: "건",
    tone: "orange",
    icon: FiClock,
  },
  {
    label: "처리 지연",
    key: "delayed",
    suffix: "건",
    tone: "purple",
    icon: FiAlertCircle,
  },
];

const Panel = ({ title, children, className = "", action }) => (
  <section className={`panel ${className}`}>
    <div className="panel-title">
      <h2>{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const Dashboard = () => {
  const [days, setDays] = useState(10);
  const handleChange = (event) => {
    setDays(event.target.value);
  };

  return (
    <main className="dashboard">
      <div className="dashboard-heading">
        <div>
          <h1>민원 현황 대시보드</h1>
          <p>환경 민원 현황을 한눈에 확인할 수 있습니다.</p>
        </div>
        <FormControl>
          <InputLabel id="demo-simple-select-label">검색 기간</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={days}
            label="검색 기간"
            onChange={handleChange}>
            <MenuItem value={10}>최근 10일</MenuItem>
            <MenuItem value={20}>최근 20일</MenuItem>
            <MenuItem value={30}>최근 30일</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="stat-grid">
        {stats.map(({ label, key, suffix, tone, icon: Icon }) => {
          const summary = chartData.summary[key];

          return (
            <article className={`stat-card stat-card--${tone}`} key={label}>
              <div className="stat-icon">
                <Icon />
              </div>
              <div>
                <span className="stat-label">{label}</span>
                <strong>
                  {summary.value.toLocaleString()}
                  <small>{suffix}</small>
                </strong>
                <em>{summary.change}</em>
              </div>
            </article>
          );
        })}
      </div>
      <div className="middle-grid">
        <Panel title="민원 유형별 현황" className="type-panel">
          <div className="donut-wrap">
            <div className="highchart highchart--donut">
              <ComplaintTypeChart
                data={{
                  total: chartData.summary.total.value,
                  types: chartData.complaintTypes,
                }}
              />
            </div>
            <div className="legend">
              {chartData.complaintTypes.map(({ name, value, color }) => (
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
        </Panel>
        <Panel title="지역별 민원 현황" className="region-panel">
          <div className="highchart highchart--region">
            <RegionComplaintChart data={chartData.regions} />
          </div>
        </Panel>
      </div>
      <div className="bottom-grid">
        <Panel
          title="최근 민원 접수 현황"
          action={
            <a className="more" href="#">
              더보기 ›
            </a>
          }>
          <table>
            <thead>
              <tr>
                <th>접수번호</th>
                <th>신청일</th>
                <th>민원 내용</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {chartData.recentComplaints.map((complaint) => (
                <tr key={complaint.number}>
                  <td>{complaint.number}</td>
                  <td>{complaint.date}</td>
                  <td>{complaint.content}</td>
                  <td>
                    <span className={`status status--${complaint.statusTone}`}>
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="처리 현황 추이">
          <div className="highchart highchart--trend">
            <ProcessingTrendChart data={chartData.processingTrend} />
          </div>
        </Panel>
      </div>
    </main>
  );
};

export default Dashboard;
