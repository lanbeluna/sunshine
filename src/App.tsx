import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { QlBodyClass } from '@/components/layout/QlBodyClass';
import { AppShell } from '@/components/layout/AppShell';
import { OfflineNotice } from '@/components/layout/OfflineNotice';

const DecisionPage = lazy(() => import('@/pages/DecisionPage'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AboutPage = lazy(() => import('@/pages/profile/AboutPage'));
const CollectionsPage = lazy(() => import('@/pages/profile/CollectionsPage'));
const DecisionHistoryPage = lazy(() => import('@/pages/profile/DecisionHistoryPage'));
const DraftsPage = lazy(() => import('@/pages/profile/DraftsPage'));
const LanguagePage = lazy(() => import('@/pages/profile/LanguagePage'));
const LegalPage = lazy(() => import('@/pages/profile/LegalPage'));
const NotesPage = lazy(() => import('@/pages/profile/NotesPage'));
const NotificationSettingsPage = lazy(() => import('@/pages/profile/NotificationSettingsPage'));
const PreferencesPage = lazy(() => import('@/pages/profile/PreferencesPage'));
const DestinationDetailPage = lazy(() => import('@/pages/DestinationDetailPage'));
const TripDetailPage = lazy(() => import('@/pages/TripDetailPage'));
const TripPage = lazy(() => import('@/pages/TripPage'));
const MessagesPage = lazy(() => import('@/pages/MessagesPage'));
const AiAssistantPage = lazy(() => import('@/pages/AiAssistantPage'));

function RouteFallback() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] items-center justify-center bg-wander-bg text-sm text-wander-secondary">
      加载中...
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <QlBodyClass />
        <OfflineNotice />
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/assistant" element={<AiAssistantPage />} />
            <Route element={<AppShell />}>
              <Route path="/" element={<Navigate to="/explore" replace />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/decision" element={<DecisionPage />} />
              <Route path="/destination/:id" element={<DestinationDetailPage />} />
              <Route path="/trip/:tripId" element={<TripDetailPage />} />
              <Route path="/trips" element={<TripPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/collections" element={<CollectionsPage />} />
              <Route path="/profile/decision-history" element={<DecisionHistoryPage />} />
              <Route path="/profile/notes" element={<NotesPage />} />
              <Route path="/profile/drafts" element={<DraftsPage />} />
              <Route path="/profile/notifications" element={<NotificationSettingsPage />} />
              <Route path="/profile/language" element={<LanguagePage />} />
              <Route path="/profile/about" element={<AboutPage />} />
              <Route path="/profile/legal" element={<LegalPage />} />
              <Route path="/profile/preferences" element={<PreferencesPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/explore" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
