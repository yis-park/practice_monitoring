const dashboardChartData = {
  summary: {
    total: { value: 1248, change: "↑ 12%" },
    completed: { value: 1080, change: "↑ 8%" },
    inProgress: { value: 120, change: "↑ 5%" },
    delayed: { value: 48, change: "↓ 2%" },
  },
  complaintTypes: [
    { name: "악취", value: 38.5, color: "#4786ef" },
    { name: "대기오염", value: 32.1, color: "#ffb045" },
    { name: "수질오염", value: 18.3, color: "#ffbb70" },
    { name: "기타", value: 10.1, color: "#cad3e2" },
  ],
  regions: [
    { name: "제천시", value: 320 },
    { name: "단양군", value: 280 },
    { name: "영월군", value: 220 },
    { name: "충주시", value: 180 },
    { name: "기타 지역", value: 248 },
  ],
  processingTrend: {
    categories: ["10.21", "10.22", "10.23", "10.24", "10.25", "10.26", "10.27"],
    series: [
      {
        name: "접수",
        color: "#4387ef",
        data: [280, 420, 445, 590, 530, 350, 490],
      },
      {
        name: "처리 완료",
        color: "#43bfa0",
        data: [150, 260, 275, 390, 285, 180, 310],
      },
    ],
  },
  recentComplaints: [
    {
      number: "2026-1047",
      date: "2026. 10.27",
      content: "공장 악취 관련 민원",
      status: "접수 대기",
      statusTone: "waiting",
    },
    {
      number: "2026-1046",
      date: "2026. 10.27",
      content: "하천 수질 오염 신고",
      status: "처리 중",
      statusTone: "working",
    },
    {
      number: "2026-1045",
      date: "2026. 10.26",
      content: "소음 발생 신고",
      status: "처리 완료",
      statusTone: "done",
    },
    {
      number: "2026-1044",
      date: "2026. 10.26",
      content: "생활폐기물 무단투기",
      status: "처리 완료",
      statusTone: "done",
    },
    {
      number: "2026-1043",
      date: "2026. 10.25",
      content: "악취 민원",
      status: "처리 완료",
      statusTone: "done",
    },
  ],
};

export const getDashboardChartData = () => dashboardChartData;

// 실제 api연동시
// export const getDashboardChartData = async () => {
//   const response = await axios.get("/api/dashboard");
//   return response.data;
// };
