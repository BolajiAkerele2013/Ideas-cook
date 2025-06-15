import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { CreateIdea } from './pages/ideas/CreateIdea';
import { ViewIdea } from './pages/ideas/ViewIdea';
import { EditIdea } from './pages/ideas/EditIdea';
import { TaskDetails } from './pages/ideas/tasks/TaskDetails';
import { ForumHome } from './pages/forum/ForumHome';
import { CreateThread } from './pages/forum/CreateThread';
import { ViewThread } from './pages/forum/ViewThread';
import { Messages } from './pages/messages/Messages';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ideas/create" element={<CreateIdea />} />
            <Route path="/ideas/:id" element={<ViewIdea />} />
            <Route path="/ideas/:id/edit" element={<EditIdea />} />
            <Route path="/ideas/:ideaId/tasks/:taskId" element={<TaskDetails />} />
            <Route path="/forum" element={<ForumHome />} />
            <Route path="/forum/new" element={<CreateThread />} />
            <Route path="/forum/thread/:id" element={<ViewThread />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Messages />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}