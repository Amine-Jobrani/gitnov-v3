import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { RestaurantsPage } from './pages/RestaurantsPage';
import { RestaurantDetailPage } from './pages/RestaurantDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReservationsPage } from './pages/ReservationsPage';
import { ProtectedRoute, GuestRoute } from './components/ProtectedRoute';
import { ReservationCheckoutPage } from './pages/ReservationCheckoutPage';
import { PartnerDashboard } from './pages/dashboard/PartnerDashboard';
import { OrganizerDashboard } from './pages/dashboard/OrganizerDashboard';
import { CreateRestaurantPage } from './pages/dashboard/CreateRestaurantPage';
import { EditRestaurantPage } from './pages/dashboard/EditRestaurantPage';
import { CreateEventPage } from './pages/dashboard/CreateEventPage';
import { EditEventPage } from './pages/dashboard/EditEventPage';
import { RoleSwitchPage } from './pages/RoleSwitchPage';
import { ExplorePage } from './pages/ExplorePage';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { RestaurantCheckoutPage } from './pages/RestaurantCheckoutPage';
import UserManagementPage from './pages/UserManagementPage';
import RoleSettingsPage from './pages/RoleSettingsPage';
import RoleTestPage from './pages/RoleTestPage';

// Inside your <Routes>


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Layout principal */}
          <Route path="/" element={<Layout />}>
            {/* Accueil */}
            <Route index element={<HomePage />} />

            {/* --- AUTH PAGES : UNIQUEMENT POUR INVITÉS --- */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            {/* Événements publics */}
            <Route path="events" element={<EventsPage />} />
            <Route path="events/:slug" element={<EventDetailPage />} />

            {/* Restaurants publics */}
            <Route path="restaurants" element={<RestaurantsPage />} />
            <Route path="restaurants/:slug" element={<RestaurantDetailPage />} />

            {/* Paiement réservation */}
            <Route
              path="reserve/event/:slug" 
              element={
                <ProtectedRoute>
                  <ReservationCheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout/restaurant/:slug"
              element={
                <ProtectedRoute>
                  <RestaurantCheckoutPage />
                </ProtectedRoute>
              }
            />


            {/* Profil utilisateur */}
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Mes réservations */}
            <Route
              path="reservations"
              element={
                <ProtectedRoute>
                  <ReservationsPage />
                </ProtectedRoute>
              }
            />

            {/* Favoris */}
            {/* <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              }
            /> */}

            {/* Dashboards */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard-partner"
              element={
                <ProtectedRoute requiredRoles={['partner']}>  {/* corrigé */}
                  <PartnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard-organizer"
              element={
                <ProtectedRoute requiredRoles={['organizer']}>
                  <OrganizerDashboard />
                </ProtectedRoute>
              }
            />

            {/* --- PARTNER : Restaurants --- */}
            <Route
              path="dashboard-partner/restaurants/new"
              element={
                <ProtectedRoute requiredRoles={['partner']}>
                  <CreateRestaurantPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard-partner/restaurants/edit"
              element={
                <ProtectedRoute requiredRoles={['partner']}>
                  <EditRestaurantPage />
                </ProtectedRoute>
              }
            />

            {/* --- ORGANIZER : Events --- */}
            <Route
              path="dashboard-organizer/events/new"
              element={
                <ProtectedRoute requiredRoles={['organizer']}>
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="dashboard-organizer/events/edit"
              element={
                <ProtectedRoute requiredRoles={['organizer']}>
                  <EditEventPage />
                </ProtectedRoute>
              }
            />

            {/* Changement de rôle */}
            <Route
              path="change-role"
              element={
                <ProtectedRoute requiredRoles={['client']}>
                  <RoleSwitchPage />
                </ProtectedRoute>
              }
            />
            {/* Changement de rôle */}
            <Route
              path="explore"
              element={
                <ProtectedRoute>
                  <ExplorePage />
                </ProtectedRoute>
              }
            />

            {/* Role Management */}
            <Route
              path="user-management"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="role-settings"
              element={
                <ProtectedRoute>
                  <RoleSettingsPage />
                </ProtectedRoute>
              }
            />
            
            {/* Role Test Page - Remove in production */}
            <Route
              path="role-test"
              element={
                <ProtectedRoute>
                  <RoleTestPage />
                </ProtectedRoute>
              }
            />

          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
