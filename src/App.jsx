import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from "./components/Home";
import AdminLogin from "./components/AdminLogin";
import NotFound from "./components/NotFound";
import AdminDashboard from './components/AdminDashboard';
 
  
export default function App() {
  return (
    <Router>
      <div className="App">
       
        <main className="">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-login" element={<AdminLogin />} />
             <Route path="/admin-dashboard" element={<AdminDashboard />} />
            {/* <Route 
              path="/admin-dashboard" 
              element={
                // <ProtectedRoute>
                  <AdminDashboard />
                // </ProtectedRoute>
              } 
            />
            <Route path="/admin-dashboard-leaderboard" element={<Leaderboard />} />
            <Route path="/scoreboard/:gameId" element={<Scoreboard />} />
            <Route path="/game-setup" element={<GameTemplateWizard />} />
            <Route path="/game/:gameId" element={<SingleGame />} />
            <Route path="/tournament-leaderboard" element={<TournamentLeaderboard />} />
            <Route path="/tournament-scoring/:tournamentId" element={<TournamentScoring />} /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}