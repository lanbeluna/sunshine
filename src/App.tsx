import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { QlBodyClass } from '@/components/layout/QlBodyClass';
import { AppShell } from '@/components/layout/AppShell';
import DecisionPage from '@/pages/DecisionPage';
import ExplorePage from '@/pages/ExplorePage';
import ProfilePage from '@/pages/ProfilePage';
import AboutPage from '@/pages/profile/AboutPage';
import CollectionsPage from '@/pages/profile/CollectionsPage';
import DecisionHistoryPage from '@/pages/profile/DecisionHistoryPage';
import DraftsPage from '@/pages/profile/DraftsPage';
import LanguagePage from '@/pages/profile/LanguagePage';
import LegalPage from '@/pages/profile/LegalPage';
import NotesPage from '@/pages/profile/NotesPage';
import NotificationSettingsPage from '@/pages/profile/NotificationSettingsPage';
import PreferencesPage from '@/pages/profile/PreferencesPage';
import DestinationDetailPage from '@/pages/DestinationDetailPage';
import TripDetailPage from '@/pages/TripDetailPage';
import TripPage from '@/pages/TripPage';
import MessagesPage from '@/pages/MessagesPage';
import AiAssistantPage from '@/pages/AiAssistantPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <QlBodyClass />
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
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
