import './App.css'
import './landing/LandingPage.css'
import 'react-toastify/dist/ReactToastify.css';

import SignUp from './users/SignUp'
import Login from './users/Login'
import Logout from './users/Logout' 
import ChatInterface from './chat/ChatInterface'
import Home from './users/Home'
import CreateTicket from './tickets/CreateTicket'
import EditTicket from './tickets/EditTicket'
import TicketDetails from './tickets/TicketDetails'
import Profile from './users/Profile'
import LandingPage from './landing/LandingPage'
import HostList from './users/HostList'
import ProtectedRoute from './secure_routes/ProtectedRoute'
// import AdminRoute from './secure_routes/AdminRoute'
import { ToastContainer } from 'react-toastify';
import HostInbox from './chat/HostInbox';
import HostMessages from './chat/HostMessages';
import HostChat from './chat/HostChat';
import Inbox from './chat/Inbox';

import { Routes, Route } from 'react-router-dom'

function App() {

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/chat/:hostId" element={<ProtectedRoute><ChatInterface /></ProtectedRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/create-ticket" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
        <Route path="/edit-ticket/:id" element={<ProtectedRoute><EditTicket /></ProtectedRoute>} />
        <Route path="/ticket/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/hosts" element={<ProtectedRoute><HostList /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute><Inbox /></ProtectedRoute>} />
        <Route path="/host-inbox" element={<ProtectedRoute><HostInbox /></ProtectedRoute>} />
        <Route path="/host-messages" element={<ProtectedRoute><HostMessages /></ProtectedRoute>} />
        <Route path="/host-chat/:userId" element={<ProtectedRoute><HostChat /></ProtectedRoute>} />
        {/* <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} /> */}
        {/* <Route path="/chat2" element={<Chat2 />} /> */}
      </Routes>
    </>
  )
}

export default App
