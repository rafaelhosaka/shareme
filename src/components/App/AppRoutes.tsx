import { Routes, Route, Navigate } from "react-router";
import Navbar from "../NavBar/NavBar";
import LoginForm from "../../pages/LoginPage/LoginForm";
import Feed from "../../pages/Feed/Feed";
import FriendMenu from "../../pages/FriendMenu/FriendMenu";
import Profile from "../../pages/ProfilePage/Profile";
import NotFound from "../../pages/NotFound/NotFound";
import Logout from "../../pages/LoginPage/Logout";
import RegisterForm from "../../pages/RegisterPage/RegisterForm";
import SearchMenu from "../../pages/SearchMenu/SearchMenu";
import ProtectedRoutes from "../ProtectedRoutes/ProtectedRoutes";
import Unauthorized from "../../pages/Unauthorized/Unauthorized";
import UserProfileEntity from "../../models/userProfile";
import SettingsMenu from "../../pages/SettingsMenu/SettingsMenu";
import GeneralSettings from "../../pages/SettingsMenu/GeneralSettings";
import ReSendEmail from "../../pages/ReSendEmail/ReSendEmail";
import VerifyEmailPage from "../../pages/VerifyEmailPage/VerifyEmailPage";
import NotifyEmailPage from "../../pages/VerifyEmailPage/NotifyEmailPage";
import RecoverPassword from "../../pages/RecoverPassword/RecoverPassword";
import ResetPasswordForm from "../../pages/RecoverPassword/ResetPasswordForm";
import MessagePanelList from "../MessagePanel/MessagePanelList";
import Footer from "../../pages/Footer/Footer";
import LanguageSettings from "../../pages/SettingsMenu/LanguageSettings";

const userRole = ["ROLE_USER"];
const adminRole = ["ROLE_ADMIN"];

interface AppRoutesProps {
  currentUser: UserProfileEntity | undefined;
}

function AppRoutes({ currentUser }: AppRoutesProps) {
  return (
    <>
      <div className="template">
        <header className="header">{currentUser && <Navbar />}</header>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/home" /> : <LoginForm />}
          />
          <Route
            path="/register"
            element={currentUser ? <Navigate to="/home" /> : <RegisterForm />}
          />
          <Route
            path="/resend"
            element={currentUser ? <Navigate to="/home" /> : <ReSendEmail />}
          />
          <Route
            path="/recover"
            element={
              currentUser ? <Navigate to="/home" /> : <RecoverPassword />
            }
          />
          <Route
            path="/resetPassword"
            element={
              currentUser ? <Navigate to="/home" /> : <ResetPasswordForm />
            }
          />
          <Route
            path="/verify"
            element={
              currentUser ? <Navigate to="/home" /> : <VerifyEmailPage />
            }
          />
          <Route
            path="/notify"
            element={
              currentUser ? <Navigate to="/home" /> : <NotifyEmailPage />
            }
          />

          {/* USER and ADMIN */}
          <Route
            element={
              <ProtectedRoutes allowedRoles={[...userRole, ...adminRole]} />
            }
          >
            <Route path="/home" element={<Feed />} />

            <Route path="/friends/:option" element={<FriendMenu />} />

            <Route path="/profile/:id/:option" element={<Profile />} />

            <Route path="/search/:filter" element={<SearchMenu />} />

            <Route path="/settings" element={<SettingsMenu />}>
              <Route path="general" element={<GeneralSettings />} />
              <Route path="language" element={<LanguageSettings />} />
            </Route>

            <Route path="/logout" element={<Logout />} />
          </Route>

          {/* ADMIN */}
          <Route element={<ProtectedRoutes allowedRoles={adminRole} />}></Route>

          {/* Others */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <>{currentUser && <MessagePanelList />}</>
        {!currentUser && <Footer />}
      </div>
    </>
  );
}

export default AppRoutes;
