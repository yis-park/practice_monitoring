import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./style/pc.css";
import "./style/mobile.css";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import ComplaintCreate from "./pages/complaints/ComplaintCreate";
import ComplaintList from "./pages/complaints/ComplaintList";
import ComplaintMapPage from "./pages/complaints/ComplaintMapPage";
import AnswerManagement from "./pages/management/AnswerManagement";
import HistoryManagement from "./pages/management/HistoryManagement";
import StatusManagement from "./pages/management/StatusManagement";
import NoticeList from "./pages/notices/NoticeList";
import Settings from "./pages/settings/Settings";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.matchMedia("(min-width: 62.5rem)").matches
  );

  return (
    <BrowserRouter>
      <section id="center">
        <Sidebar isOpen={isSidebarOpen} />
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((open) => !open)}
        />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/complaints" element={<ComplaintList />} />
          <Route path="/complaints/create" element={<ComplaintCreate />} />
          <Route path="/complaints/map" element={<ComplaintMapPage />} />
          <Route path="/management/status" element={<StatusManagement />} />
          <Route path="/management/answer" element={<AnswerManagement />} />
          <Route path="/management/history" element={<HistoryManagement />} />
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </section>
    </BrowserRouter>
  );
}

export default App;
