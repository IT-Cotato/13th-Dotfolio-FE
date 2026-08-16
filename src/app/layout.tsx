import { useEffect, useRef, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./home";
import Landing from "./landing";
import Memo from "./memo";
import Login from "./login";
import Signup from "./signup";
import PasswordReset from "./password-reset";
import PasswordResetConfirm from "./password-reset-confirm";
import ImmersionGoalPage from "./immersion-goal";
import ImmersionRecordPage from "./immersion-record";
import ImmersionCompletePage from "./immersion-complete";
import ImmersionReturningPage from "./immersion-returning";
import Record from "./record";
import RecordAll from "./record-all";
import RecordWrite from "./record-write";
import TemplateAll from "./template-all";
import MyStoryArchive from "./mystory";
import MyStoryInsightsPage from "./mystory-insights";
import MyStoryAiMatchingPage from "./mystory-ai-matching";
import MyPage from "./mypage";
import { ImmersionToggle } from "@/components/home/ImmersionToggle";
import { ImmersionStartingOverlay } from "@/components/immersion/ImmersionStartingOverlay";
import { Sidebar } from "@/components/common/sidebar";
import { ActivitiesProvider } from "@/contexts/ActivitiesContext";
import { TemplatesProvider } from "@/contexts/TemplatesContext";
import { RecordsProvider } from "@/contexts/RecordsContext";
import ProfileIcon from "@/assets/profile.svg";
import MenuIcon from "@/assets/menu.svg";
import { getRecords } from "@/api/records";

const IMMERSION_LOADING_DELAY_MS = 2000;

export default function Layout() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password/request" element={<PasswordReset />} />
      <Route path="/reset-password" element={<PasswordResetConfirm />} />
      <Route path="/immersion/goal" element={<ImmersionGoalPage />} />
      <Route path="/immersion/record" element={<ImmersionRecordPage />} />
      <Route path="/immersion/complete" element={<ImmersionCompletePage />} />
      <Route path="/immersion/returning" element={<ImmersionReturningPage />} />
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<HomeLayout />} />
    </Routes>
  );
}

function HomeLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isStartingImmersion, setIsStartingImmersion] = useState(false);
  const isCheckingDraftsRef = useRef(false);
  const hasAddedLoadingGuardRef = useRef(false);
  const loadingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isStartingImmersion) return;

    const pushLoadingGuard = () => {
      window.history.pushState(
        { ...window.history.state, immersionLoadingGuard: true },
        "",
        window.location.href,
      );
    };

    if (!hasAddedLoadingGuardRef.current) {
      pushLoadingGuard();
      hasAddedLoadingGuardRef.current = true;
    }

    const preventBack = () => pushLoadingGuard();
    window.addEventListener("popstate", preventBack);

    loadingTimeoutRef.current = window.setTimeout(() => {
      window.removeEventListener("popstate", preventBack);
      navigate("/immersion/goal", { replace: true });
    }, IMMERSION_LOADING_DELAY_MS);

    return () => {
      window.removeEventListener("popstate", preventBack);
      if (loadingTimeoutRef.current !== null) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isStartingImmersion, navigate]);

  const handleImmersionToggle = async (nextIsOn: boolean) => {
    if (!nextIsOn || isStartingImmersion || isCheckingDraftsRef.current) return;

    isCheckingDraftsRef.current = true;
    try {
      const response = await getRecords({ status: "DRAFT", page: 0, size: 1 });
      if (response.data.totalElements > 0) {
        setIsStartingImmersion(true);
      }
    } catch {
      // 별도 오류 UI가 정해질 때까지 토글을 OFF 상태로 유지합니다.
    } finally {
      isCheckingDraftsRef.current = false;
    }
  };

  return (
    <ActivitiesProvider>
      <TemplatesProvider>
        <RecordsProvider>
          <div className="w-full h-screen bg-home">
            <header className="w-full h-20 relative flex items-center justify-between pl-8 pr-6">
              <div className="flex items-center gap-4">
                <MenuIcon
                  className="w-6 h-6 text-grey-700 cursor-pointer"
                  onClick={() => setIsSidebarOpen(prev => !prev)}
                />
                <span
                  className="font-nexon text-logo text-grey-600 cursor-pointer"
                  onClick={() => navigate("/home")}
                >
                  Dotfolio
                </span>
              </div>
              <div className="flex items-center gap-5">
                <button type="button" aria-label="마이페이지" onClick={() => navigate('/mypage')}>
                  <ProfileIcon className="w-6 h-6 text-grey-700 cursor-pointer" />
                </button>
              </div>
            </header>
            <div className="flex h-[calc(100vh-80px)]">
              {isSidebarOpen && (
                <nav className="w-60 shrink-0 flex flex-col items-start py-6 px-6 gap-6">
                  <ImmersionToggle
                    isOn={isStartingImmersion}
                    onToggle={handleImmersionToggle}
                  />
                  <Sidebar />
                </nav>
              )}
              <main className={`flex-1 pb-8 pr-6 h-full overflow-y-auto scrollbar-hide ${isSidebarOpen ? '' : 'pl-8'}`}>
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/memo" element={<Memo />} />
                  <Route path="/record" element={<Record />} />
                  <Route path="/record-all" element={<RecordAll />} />
                  <Route
                    path="/record/write/:templateId"
                    element={<RecordWrite />}
                  />
                  <Route path="/template-all" element={<TemplateAll />} />
                  <Route path="/mypage" element={<MyPage />} />
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
            {isStartingImmersion && <ImmersionStartingOverlay />}
          </div>
        </RecordsProvider>
      </TemplatesProvider>
    </ActivitiesProvider>
  );
}
