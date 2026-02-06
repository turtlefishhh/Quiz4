import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProjects } from "../features/projects/projectsSlice";
import StatusPill from "./StatusPill";

const formatDate = (value) => {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function HomeScreen() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.projects);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  const projects = useMemo(() => items || [], [items]);

  return (
    <section className="dashboard">
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-kicker">Portfolio Overview</p>
          <h1>Project command center</h1>
          <p className="dashboard-subtitle">
            Track active work, surface blockers, and move teams faster with a
            single view of every project.
          </p>
        </div>
        <div className="dashboard-meta">
          <div>
            <span className="meta-label">Active projects</span>
            <strong>{projects.length}</strong>
          </div>
          <div>
            <span className="meta-label">Status</span>
            <strong>{status === "loading" ? "Syncing" : "Ready"}</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert-card" role="status">
          <span className="alert-title">API notice</span>
          <span>{error}</span>
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Projects</h2>
            <p>Each row expands to reveal project details and task highlights.</p>
          </div>
          <div className="table-actions">
            <span className="badge-outline">Admin View</span>
            <span className="badge-outline">Team Assignments</span>
          </div>
        </div>

        {status === "loading" && projects.length === 0 && (
          <div className="alert-card" role="status">
            <span className="alert-title">Loading</span>
            <span>Fetching projects from /api/v1/projects.</span>
          </div>
        )}

        <div className="table-wrap">
          <table className="project-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Hours</th>
                <th>Timeline</th>
                <th>Tasks</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const isExpanded = expandedId === project.id;
                const taskCount = project.tasks?.length || 0;
                return (
                  <React.Fragment key={project.id}>
                    <tr
                      className={`project-row ${isExpanded ? "is-open" : ""}`}
                      onClick={() =>
                        setExpandedId(isExpanded ? null : project.id)
                      }
                    >
                      <td>
                        <button
                          className="row-toggle"
                          type="button"
                          aria-expanded={isExpanded}
                        >
                          <span className="row-title">
                            {project.project_name}
                          </span>
                          <span className="row-subtitle">
                            {project.project_description}
                          </span>
                        </button>
                      </td>
                      <td>
                        <StatusPill value={project.status} />
                      </td>
                      <td>
                        <span className="metric">{project.hours_consumed}</span>
                      </td>
                      <td>
                        <span className="date-range">
                          {formatDate(project.start_date)} -
                          {" "}
                          {formatDate(project.end_date)}
                        </span>
                      </td>
                      <td>
                        <span className="metric">{taskCount}</span>
                      </td>
                      <td>
                        <Link
                          className="link-pill"
                          to={`/projects/${project.id}`}
                          onClick={(event) => event.stopPropagation()}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="project-detail-row">
                        <td colSpan={6}>
                          <div className="project-accordion">
                            <div>
                              <h3>Project pulse</h3>
                              <p>{project.project_description}</p>
                              <div className="pill-row">
                                <span className="badge-solid">
                                  Hours: {project.hours_consumed}
                                </span>
                                <span className="badge-solid">
                                  Start: {formatDate(project.start_date)}
                                </span>
                                <span className="badge-solid">
                                  End: {formatDate(project.end_date)}
                                </span>
                              </div>
                            </div>
                            <div>
                              <h3>Task highlights</h3>
                              <ul className="task-mini-list">
                                {(project.tasks || []).slice(0, 3).map((task) => (
                                  <li key={task.id}>
                                    <span>{task.task_name}</span>
                                    <StatusPill value={task.status} />
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default HomeScreen;