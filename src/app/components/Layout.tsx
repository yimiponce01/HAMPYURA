import { Outlet, useLocation } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { AccessibilityControls } from './AccessibilityControls';
import { WelcomeVisitorModal } from './WelcomeVisitorModal';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const location = useLocation();
  const { isVisitor } = useAuth();
  const showMobileNav = !location.pathname.includes('/login') && 
                        !location.pathname.includes('/register') && 
                        !location.pathname.includes('/forgot-password');

  return (
    <>
      <AccessibilityControls />
      <Outlet />
      {showMobileNav && <MobileNavigation />}
      {isVisitor && <WelcomeVisitorModal />}
    </>
  );
}