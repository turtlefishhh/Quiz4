import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import StatusPill from "./StatusPill";
import AccessDenied from "./AccessDenied";
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

function ProjectDetailScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const user = useCurrentUser();
  const { isAdmin } = getRoleFlags(user);
  const { items, status } = useSelector((state) => state.projects);
  const project = items.find((item) => item.id === projectId);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  if (!project) {
    return (
      <section className="detail-screen">
        <div className="detail-card empty-state">
          <h1>Project not found</h1>
          <p>We could not locate that project in the current data set.</p>
          <Link className="link-pill" to="/projects">
            Back to projects
          </Link>
        </div>
      </section>
    );
  }

  const canViewProject = () => {
    if (isAdmin) return true;
    return (project?.tasks || []).some((task) => {
      const assigned = String(task?.user_assigned || "").toLowerCase();
      const assignedId = String(task?.user_assigned_id || task?.user_id || "");
      const userName = String(user?.name || "").toLowerCase();
      const userId = String(user?.id || "");

      if (assignedId && userId && assignedId === userId) return true;
      return assigned && userName && assigned.includes(userName);
    });
  };

  if (!canViewProject()) {
    return <AccessDenied />;
  }

  const handleDelete = async () => {
    if (!window.confirm("Delete this project?")) return;
    const resultAction = await dispatch(deleteProject(project.id));
    if (deleteProject.fulfilled.match(resultAction)) {
      navigate("/projects");
    }
  };

  return (
    <section className="detail-screen">
      <div className="detail-hero">
        <div>
          <p className="detail-kicker">Project Detail</p>
          <h1>{project.project_name}</h1>
          <p className="detail-subtitle">{project.project_description}</p>
          <div className="pill-row">
            <StatusPill value={project.status} />
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
        <div className="detail-actions">
          <Link className="link-pill" to="/projects">
            Back to projects
          </Link>
          {isAdmin && (
            <>
              <Link className="button" to={`/projects/${project.id}/edit`}>
                Edit
              </Link>
              <button className="button button-danger" type="button" onClick={handleDelete}>
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h2>Project overview</h2>
          <dl className="detail-list">
            <div>
              <dt>Status</dt>
              <dd>
                <StatusPill value={project.status} />
              </dd>
            </div>
            <div>
              <dt>Hours consumed</dt>
              <dd>{project.hours_consumed}</dd>
            </div>
            <div>
              <dt>Start date</dt>
              <dd>{formatDate(project.start_date)}</dd>
            </div>
            <div>
              <dt>End date</dt>
              <dd>{formatDate(project.end_date)}</dd>
            </div>
          </dl>
        </div>
        <div className="detail-card">
          <h2>Project narrative</h2>
          <p className="detail-copy">{project.project_description}</p>
          <div className="timeline">
            <div>
              <span className="timeline-label">Start</span>
              <strong>{formatDate(project.start_date)}</strong>
              <span className="timeline-meta">Kickoff</span>
            </div>
            <div>
              <span className="timeline-label">End</span>
              <strong>{formatDate(project.end_date)}</strong>
              <span className="timeline-meta">Target</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-card">
        <div className="table-header">
          <div>
            <h2>Tasks</h2>
            <p>All work items tied to this project.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Hours</th>
                <th>Assigned</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {(project.tasks || []).map((task) => (
                <tr key={task.id}>
                  <td>
                    <div className="task-title">{task.task_name}</div>
                    <div className="task-subtitle">
                      {task.task_description}
                    </div>
                  </td>
                  <td>
                    <StatusPill value={task.status} />
                  </td>
                  <td>{task.hours_consumed}</td>
                  <td>{task.user_assigned}</td>
                  <td>{formatDate(task.start_date)}</td>
                  <td>{formatDate(task.end_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ProjectDetailScreen;
