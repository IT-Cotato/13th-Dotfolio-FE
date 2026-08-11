import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./home";
import Memo from "./memo";
import Login from "./login";
import Signup from "./signup";
import PasswordReset from "./password-reset";
import PasswordResetConfirm from "./password-reset-confirm";
import ImmersionGoalPage from "./immersion-goal";
import Record from "./record";
import RecordAll from "./record-all";
import RecordWrite from "./record-write";
import TemplateAll from "./template-all";
import MyStoryArchive from "./mystory";
import MyStoryInsightsPage from "./mystory-insights";
import MyStoryAiMatchingPage from "./mystory-ai-matching";
import { ImmersionToggle } from "@/components/home/ImmersionToggle";
import { Sidebar } from "@/components/common/sidebar";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { TemplatesProvider } from "@/contexts/TemplatesContext";
import { RecordsProvider } from "@/contexts/RecordsContext";
import AlarmIcon from "@/assets/alarm.svg";
import ProfileIcon from "@/assets/profile.svg";
import MenuIcon from "@/assets/menu.svg";

export default function Layout() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password/request" element={<PasswordReset />} />
      <Route path="/reset-password" element={<PasswordResetConfirm />} />
      <Route path="/immersion/goal" element={<ImmersionGoalPage />} />
      <Route path="*" element={<HomeLayout />} />
    </Routes>
  );
}

function HomeLayout() {
  const navigate = useNavigate();

  return (
    <ActivitiesProvider>
      <TemplatesProvider>
        <RecordsProvider>
          <div className="w-full h-screen bg-home">
            <header className="w-full h-20 relative flex items-center justify-between pl-8 pr-6">
              <div className="flex items-center gap-4">
                <MenuIcon className="w-6 h-6 text-grey-700 cursor-pointer" />
                <span
                  className="font-nexon text-logo text-grey-600 cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Dotfolio
                </span>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative p-0.75">
                  <AlarmIcon className="w-6 h-6 text-grey-700 cursor-pointer" />
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-error-text" />
                </div>
                <ProfileIcon className="w-6 h-6 text-grey-700 cursor-pointer" />
              </div>
            </header>
            <div className="flex h-[calc(100vh-80px)]">
              <nav className="w-60 shrink-0 flex flex-col items-start py-6 px-6 gap-6">
                <ImmersionToggle />
                <Sidebar />
              </nav>
              <main className="flex-1 pb-8 pr-6 h-full overflow-y-auto scrollbar-hide">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/memo" element={<Memo />} />
                  <Route path="/record" element={<Record />} />
                  <Route path="/record-all" element={<RecordAll />} />
                  <Route
                    path="/record/write/:templateId"
                    element={<RecordWrite />}
                  />
                  <Route path="/template-all" element={<TemplateAll />} />
                  <Route path="/mystory/archive" element={<MyStoryArchive />} />
                  <Route
                    path="/mystory/insights"
                    element={<MyStoryInsightsPage />}
                  />
                  <Route
                    path="/mystory/ai-matching"
                    element={<MyStoryAiMatchingPage />}
                  />
                </Routes>
              </main>
            </div>
          </div>
        </RecordsProvider>
      </TemplatesProvider>
    </ActivitiesProvider>
  );
}
