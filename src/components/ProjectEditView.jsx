import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProjects, updateProject } from "../features/projects/projectsSlice";

const STATUS_OPTIONS = ["CREATED", "IN PROGRESS", "OVERDUE", "COMPLETED"];

function ProjectEditView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { items, status, saveStatus, saveError } = useSelector(
    (state) => state.projects,
  );

  const project = items.find((item) => item.id === projectId);
  const [formState, setFormState] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (project) {
      setFormState({
        project_name: project.project_name || "",
        project_description: project.project_description || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        status: project.status || "CREATED",
      });
    }
  }, [project]);

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

  if (!formState) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resultAction = await dispatch(
      updateProject({ projectId, updates: formState }),
    );
    if (updateProject.fulfilled.match(resultAction)) {
      navigate(`/projects/${projectId}`);
    }
  };

  return (
    <section className="detail-screen">
      <div className="detail-hero">
        <div>
          <p className="detail-kicker">Edit Project</p>
          <h1>{project.project_name}</h1>
          <p className="detail-subtitle">Update project details.</p>
        </div>
      </div>

      <div className="detail-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="project_name">Project name</label>
              <input
                id="project_name"
                name="project_name"
                type="text"
                value={formState.project_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="start_date">Start date</label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formState.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="end_date">End date</label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formState.end_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formState.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field form-span">
              <label htmlFor="project_description">Description</label>
              <textarea
                id="project_description"
                name="project_description"
                value={formState.project_description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {saveError && <p className="helper-text">{saveError}</p>}

          <div className="form-actions">
            <Link className="button button-ghost" to="/projects">
              Cancel
            </Link>
            <button
              className="button button-primary"
              type="submit"
              disabled={saveStatus === "loading"}
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ProjectEditView;
