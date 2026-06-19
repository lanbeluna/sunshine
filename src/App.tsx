import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { QlBodyClass } from '@/components/layout/QlBodyClass';
import { AppShell } from '@/components/layout/AppShell';
import { OfflineNotice } from '@/components/layout/OfflineNotice';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/features/auth/pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('@/features/auth/pages/AuthCallbackPage'));
const DecisionPage = lazy(() => import('@/features/decision/pages/DecisionPage'));
const ExplorePage = lazy(() => import('@/features/explore/pages/ExplorePage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const AboutPage = lazy(() => import('@/features/profile/pages/AboutPage'));
const CollectionsPage = lazy(() => import('@/features/profile/pages/CollectionsPage'));
const DecisionHistoryPage = lazy(() => import('@/features/profile/pages/DecisionHistoryPage'));
const DraftsPage = lazy(() => import('@/features/profile/pages/DraftsPage'));
const LanguagePage = lazy(() => import('@/features/profile/pages/LanguagePage'));
const LegalPage = lazy(() => import('@/features/profile/pages/LegalPage'));
const NotesPage = lazy(() => import('@/features/profile/pages/NotesPage'));
const NotificationSettingsPage = lazy(() => import('@/features/profile/pages/NotificationSettingsPage'));
const PreferencesPage = lazy(() => import('@/features/profile/pages/PreferencesPage'));
const DestinationDetailPage = lazy(() => import('@/features/destinations/pages/DestinationDetailPage'));
const TripDetailPage = lazy(() => import('@/features/trips/pages/TripDetailPage'));
const TripPage = lazy(() => import('@/features/trips/pages/TripPage'));
const MessagesPage = lazy(() => import('@/features/messages/pages/MessagesPage'));
const AiAssistantPage = lazy(() => import('@/features/assistant/pages/AiAssistantPage'));

function RouteFallback() {
  return (
    <div
      className="mx-auto flex min-h-dvh w-full max-w-[430px] items-center justify-center bg-wander-bg text-sm text-wander-secondary"
      role="status"
      aria-live="polite"
    >
      正在加载...
    </div>
  );
}

function protect(element: ReactNode) {
  return <ProtectedRoute>{element}</ProtectedRoute>;
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <QlBodyClass />
          <OfflineNotice />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/auth/callback" element={<AuthCallbackPage />} />
              <Route path="/assistant" element={<AiAssistantPage />} />
              <Route element={<AppShell />}>
                <Route path="/" element={<Navigate to="/decision" replace />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/decision" element={<DecisionPage />} />
                <Route path="/destination/:id" element={<DestinationDetailPage />} />
                <Route path="/trip/:tripId" element={<TripDetailPage />} />
                <Route path="/trips" element={<TripPage />} />
                <Route path="/profile" element={protect(<ProfilePage />)} />
                <Route path="/profile/collections" element={protect(<CollectionsPage />)} />
                <Route path="/profile/decision-history" element={protect(<DecisionHistoryPage />)} />
                <Route path="/profile/notes" element={protect(<NotesPage />)} />
                <Route path="/profile/drafts" element={protect(<DraftsPage />)} />
                <Route path="/profile/notifications" element={protect(<NotificationSettingsPage />)} />
                <Route path="/profile/language" element={protect(<LanguagePage />)} />
                <Route path="/profile/about" element={<AboutPage />} />
                <Route path="/profile/legal" element={<LegalPage />} />
                <Route path="/profile/preferences" element={protect(<PreferencesPage />)} />
              </Route>
              <Route path="*" element={<Navigate to="/decision" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
