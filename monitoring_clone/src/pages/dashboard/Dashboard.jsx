import { FiAlertCircle, FiCalendar, FiCheck, FiClock } from "react-icons/fi";

const stats = [
  {
    label: "전체 민원 수",
    value: "1,248",
    suffix: "건",
    change: "↑ 12%",
    tone: "blue",
    icon: FiAlertCircle,
  },
  {
    label: "처리 완료",
    value: "1,080",
    suffix: "건",
    change: "↑ 8%",
    tone: "green",
    icon: FiCheck,
  },
  {
    label: "처리 중",
    value: "120",
    suffix: "건",
    change: "↑ 5%",
    tone: "orange",
    icon: FiClock,
  },
  {
    label: "처리 지연",
    value: "48",
    suffix: "건",
    change: "↓ 2%",
    tone: "purple",
    icon: FiAlertCircle,
  },
];

const complaints = [
  ["2026-1047", "2026. 10.27", "공장 악취 관련 민원", "접수 대기", "waiting"],
  ["2026-1046", "2026. 10.27", "하천 수질 오염 신고", "처리 중", "working"],
  ["2026-1045", "2026. 10.26", "소음 발생 신고", "처리 완료", "done"],
  ["2026-1044", "2026. 10.26", "생활폐기물 무단투기", "처리 완료", "done"],
  ["2026-1043", "2026. 10.25", "악취 민원", "처리 완료", "done"],
];

const regions = [
  ["제천시", "320건"],
  ["단양군", "280건"],
  ["영월군", "220건"],
  ["충주시", "180건"],
  ["기타 지역", "248건"],
];

function TrendChart() {
  return (
    <div className="trend-chart">
      <div className="y-labels">
        <span>750</span>
        <span>500</span>
        <span>250</span>
        <span>0</span>
      </div>
      <div className="chart-area">
        <div className="grid-lines">
          <i />
          <i />
          <i />
          <i />
        </div>
        <svg
          viewBox="0 0 500 140"
          preserveAspectRatio="none"
          aria-label="민원 처리 추이">
          <polyline
            className="line-blue"
            points="10,93 90,66 170,61 250,36 330,48 410,83 490,56"
          />
          <polyline
            className="line-green"
            points="10,111 90,96 170,94 250,78 330,92 410,107 490,86"
          />
          {[
            ["10", 93],
            ["90", 66],
            ["170", 61],
            ["250", 36],
            ["330", 48],
            ["410", 83],
            ["490", 56],
          ].map(([x, y]) => (
            <circle className="dot-blue" cx={x} cy={y} r="4" key={`${x}-b`} />
          ))}
          {[
            ["10", 111],
            ["90", 96],
            ["170", 94],
            ["250", 78],
            ["330", 92],
            ["410", 107],
            ["490", 86],
          ].map(([x, y]) => (
            <circle className="dot-green" cx={x} cy={y} r="4" key={`${x}-g`} />
          ))}
        </svg>
        <div className="x-labels">
          {["10.21", "10.22", "10.23", "10.24", "10.25", "10.26", "10.27"].map(
            (day) => (
              <span key={day}>{day}</span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

const Panel = ({ title, children, className = "", action }) => (
  <section className={`panel ${className}`}>
    <div className="panel-title">
      <h2>{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

const Dashboard = () => (
  <main className="dashboard">
    <div className="dashboard-heading">
      <div>
        <h1>민원 현황 대시보드</h1>
        <p>환경 민원 현황을 한눈에 확인할 수 있습니다.</p>
      </div>
      <button className="date-filter">
        <FiCalendar /> 최근 30일 <span>⌄</span>
      </button>
    </div>
    <div className="stat-grid">
      {stats.map(({ label, value, suffix, change, tone, icon: Icon }) => (
        <article className={`stat-card stat-card--${tone}`} key={label}>
          <div className="stat-icon">
            <Icon />
          </div>
          <div>
            <span className="stat-label">{label}</span>
            <strong>
              {value}
              <small>{suffix}</small>
            </strong>
            <em>{change}</em>
          </div>
          <div className="sparkline" />
        </article>
      ))}
    </div>
    <div className="middle-grid">
      <Panel title="민원 유형별 현황" className="type-panel">
        <div className="donut-wrap">
          <div className="donut">
            <b>
              1,248<small>전체</small>
            </b>
          </div>
          <div className="legend">
            {[
              ["악취", "38.5%", "blue"],
              ["대기오염", "32.1%", "orange"],
              ["수질오염", "18.3%", "yellow"],
              ["기타", "10.1%", "gray"],
            ].map(([name, value, tone]) => (
              <div key={name}>
                <i className={`legend-dot ${tone}`} />
                {name}
                <b>{value}</b>
              </div>
            ))}
          </div>
        </div>
      </Panel>
      <Panel title="지역별 민원 현황" className="region-panel">
        <div className="region-content">
          <div className="fake-map">
            {[
              [28, 57, 14],
              [42, 26, 10],
              [57, 46, 16],
              [74, 62, 12],
              [35, 80, 9],
              [68, 83, 8],
              [53, 69, 7],
            ].map(([left, top, size]) => (
              <i
                key={`${left}-${top}`}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: size,
                  height: size,
                }}
              />
            ))}
          </div>
          <div className="region-list">
            {regions.map(([name, value], index) => (
              <div key={name}>
                <i className={`legend-dot ${index < 3 ? "blue" : "gray"}`} />
                {name}
                <b>{value}</b>
              </div>
            ))}
          </div>
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
            {complaints.map((row) => (
              <tr key={row[0]}>
                {row.slice(0, 3).map((cell) => (
                  <td key={cell}>{cell}</td>
                ))}
                <td>
                  <span className={`status status--${row[4]}`}>{row[3]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      <Panel
        title="처리 현황 추이"
        action={
          <div className="chart-legend">
            <span>● 접수</span>
            <span>● 처리 완료</span>
          </div>
        }>
        <TrendChart />
      </Panel>
    </div>
  </main>
);

export default Dashboard;
