import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProjectListView from "./components/ProjectListView";
import ProjectCreateView from "./components/ProjectCreateView";
import ProjectEditView from "./components/ProjectEditView";
import ProjectDetailScreen from "./components/ProjectDetailScreen";
import ReportsView from "./components/ReportsView";
import ActivityView from "./components/ActivityView";
import TaskCreateView from "./components/TaskCreateView";
import UserCreateView from "./components/UserCreateView";
import RequireRole from "./components/RequireRole";
function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ProjectListView />} />
          <Route path="/projects" element={<ProjectListView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/activity" element={<ActivityView />} />
          <Route
            path="/projects/create"
            element={
              <RequireRole allowed={["admin"]}>
                <ProjectCreateView />
              </RequireRole>
            }
          />
          <Route
            path="/projects/:projectId/edit"
            element={
              <RequireRole allowed={["admin"]}>
                <ProjectEditView />
              </RequireRole>
            }
          />
          <Route
            path="/tasks/create"
            element={
              <RequireRole allowed={["admin", "manager"]}>
                <TaskCreateView />
              </RequireRole>
            }
          />
          <Route
            path="/users/create"
            element={
              <RequireRole allowed={["admin"]}>
                <UserCreateView />
              </RequireRole>
            }
          />
          <Route path="/projects/:projectId" element={<ProjectDetailScreen />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
