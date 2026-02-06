import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createProject } from "../features/projects/projectsSlice";
import { isSameDate } from "../utils/date";

const resolveStatus = (startDate) =>
  isSameDate(startDate) ? "IN PROGRESS" : "CREATED";

function ProjectCreateView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { saveStatus, saveError } = useSelector((state) => state.projects);

  const [formState, setFormState] = useState({
    project_name: "",
    project_description: "",
    start_date: "",
    end_date: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      ...formState,
      status: resolveStatus(formState.start_date),
      hours_consumed: 0,
    };

    const resultAction = await dispatch(createProject(payload));
    if (createProject.fulfilled.match(resultAction)) {
      navigate("/projects");
    }
  };

  return (
    <section className="detail-screen">
      <div className="detail-hero">
        <div>
          <p className="detail-kicker">Create Project</p>
          <h1>New project</h1>
          <p className="detail-subtitle">
            Define the timeline and overview details.
          </p>
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
              Create project
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ProjectCreateView;
