import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllPodcasts from "./pages/AllPodcasts";
import PodcastDetails from "./pages/PodcastDetails";
import EpisodeDetails from "./pages/EpisodeDetails";
import UserManagement from "./pages/UserManagement";
import CategoryManagement from "./pages/CategoryManagement";
import PodcastForm from "./pages/PodcastForm";
import AddEpisodeForm from "./pages/AddEpisodeForm";
import Spotify from "./components/spotify/Spotify";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/podcasts" element={<AllPodcasts />} />
          <Route path="/podcasts/:id" element={<PodcastDetails />} />
          <Route path="/create-podcast" element={<PodcastForm />} />
          <Route path="/podcasts/:id/update" element={<PodcastForm />} />
          <Route
            path="/podcasts/:id/add-episode"
            element={<AddEpisodeForm />}
          />
          <Route
            path="/podcasts/:podcastId/episodes/:episodeId"
            element={<EpisodeDetails />}
          />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/spotify" element={<Spotify />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
