export const getNavigationMenu = () => [
  { label: "민원 현황", icon: "grid", to: "/" },
  {
    label: "민원 관리",
    icon: "clipboard",
    to: "/complaints",
    children: [
      { label: "민원 목록", to: "/complaints" },
      { label: "민원 접수", to: "/complaints/create" },
      { label: "민원 지도", to: "/complaints/map" },
    ],
  },
  {
    label: "처리 관리",
    icon: "shield",
    to: "/management/status",
    children: [
      { label: "처리 현황", to: "/management/status" },
      { label: "담당 관리", to: "/management/answer" },
      { label: "처리 이력", to: "/management/history" },
    ],
  },
  { label: "공지사항", icon: "speaker", to: "/notices" },
  { label: "시스템 설정", icon: "settings", to: "/settings" },
];
