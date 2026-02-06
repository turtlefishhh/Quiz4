import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import StatusPill from "./StatusPill";
import useCurrentUser, { getRoleFlags } from "../hooks/useCurrentUser";
import { deleteProject, fetchProjects } from "../features/projects/projectsSlice";

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

const taskMatchesUser = (task, user) => {
  const assignedName = String(task?.user_assigned || "").toLowerCase();
  const assignedId = String(task?.user_assigned_id || task?.user_id || "");
  const userName = String(user?.name || "").toLowerCase();
  const userId = String(user?.id || "");

  if (assignedId && userId && assignedId === userId) return true;
  if (assignedName && userName && assignedName.includes(userName)) return true;
  return false;
};

const canViewProject = (project, user, isAdmin) => {
  if (isAdmin) return true;
  return (project?.tasks || []).some((task) => taskMatchesUser(task, user));
};

function ProjectListView() {
  const dispatch = useDispatch();
  const user = useCurrentUser();
  const { isAdmin } = getRoleFlags(user);
  const { items, status, error } = useSelector((state) => state.projects);
  const [expandedId, setExpandedId] = useState(null);
  const [lastError, setLastError] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (error) {
      setLastError(error);
    }

    if (status === "succeeded") {
      setLastError("");
    }
  }, [error, status]);

  const projects = useMemo(() => items || [], [items]);
  const visibleProjects = useMemo(
    () => projects.filter((project) => canViewProject(project, user, isAdmin)),
    [projects, user, isAdmin],
  );

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;
    await dispatch(deleteProject(projectId));
  };

  return (
    <section className="dashboard">
      <div className="dashboard-hero">
        <div>
          <p className="dashboard-kicker">Projects</p>
          <h1>Project overview</h1>
          <p className="dashboard-subtitle">
            Track active work, milestones, and task ownership.
          </p>
        </div>
        <div className="dashboard-meta">
          <div>
            <span className="meta-label">Visible projects</span>
            <strong>{visibleProjects.length}</strong>
          </div>
          <div>
            <span className="meta-label">Role</span>
            <strong>{user?.role || "admin"}</strong>
          </div>
        </div>
      </div>

      {(lastError || status === "failed") && (
        <div className="alert-card" role="status">
          <span className="alert-title">API notice</span>
          <span>
            {lastError ||
              "Backend is unavailable. Check your API server and REACT_APP_API_BASE."}
          </span>
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2>Projects</h2>
            <p>Each row expands to reveal project details and tasks.</p>
          </div>
          <div className="table-actions">
            {isAdmin && (
              <Link className="button button-primary" to="/projects/create">
                Create project
              </Link>
            )}
          </div>
        </div>

        {status === "loading" && visibleProjects.length === 0 && (
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
              {visibleProjects.map((project) => {
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
                          {formatDate(project.start_date)} -{" "}
                          {formatDate(project.end_date)}
                        </span>
                      </td>
                      <td>
                        <span className="metric">{taskCount}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link
                            className="button"
                            to={`/projects/${project.id}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            View
                          </Link>
                          {isAdmin && (
                            <>
                              <Link
                                className="button"
                                to={`/projects/${project.id}/edit`}
                                onClick={(event) => event.stopPropagation()}
                              >
                                Edit
                              </Link>
                              <button
                                className="button button-danger"
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleDelete(project.id);
                                }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
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

export default ProjectListView;
