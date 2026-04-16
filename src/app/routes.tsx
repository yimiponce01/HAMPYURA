import { createHashRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PlantDetail from './pages/PlantDetail';
import PublishPlant from './pages/PublishPlant';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import AdminDashboard from './pages/AdminDashboard';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import AdminModeration from "./pages/AdminModeration";


export const router = createHashRouter([
  {
    path: '/',
    element: <Layout />, // ✅ SOLO Layouts
    children: [
      { index: true, element: <Home /> },
      { path: 'plant/:id', element: <PlantDetail /> },
      { path: 'publish', element: <PublishPlant /> },
      { path: 'profile', element: <Profile /> },
      { path: 'edit-profile', element: <EditProfile /> },
      { path: 'articles', element: <Articles /> },
      { path: 'article/:id', element: <ArticleDetail /> },
      { path: 'admin', element: <AdminDashboard /> },
      { path: 'notifications', element: <Notifications /> },
      { path: "admin/moderacion", element: <AdminModeration /> },
      { path: '*', element: <NotFound /> },
    ],
  },

  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },


]);