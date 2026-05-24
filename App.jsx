import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventDetail from './pages/EventDetail';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyRegistrations from './pages/MyRegistrations';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="events/new"
          element={
            <ProtectedRoute roles={['organizer', 'admin']}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route path="events/:id" element={<EventDetail />} />
        <Route
          path="events/:id/edit"
          element={
            <ProtectedRoute roles={['organizer', 'admin']}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-registrations"
          element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
