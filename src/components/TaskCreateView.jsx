import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProjects } from "../features/projects/projectsSlice";
import { createTask } from "../features/tasks/tasksSlice";
import { isSameDate } from "../utils/date";

const resolveStatus = (startDate) =>
  isSameDate(startDate) ? "IN PROGRESS" : "CREATED";

function TaskCreateView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status } = useSelector((state) => state.projects);
  const { createStatus, createError } = useSelector((state) => state.tasks);

  const [formState, setFormState] = useState({
    project_id: "",
    task_name: "",
    task_description: "",
    user_assigned: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProjects());
    }
  }, [dispatch, status]);

  const projects = useMemo(() => items || [], [items]);

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
    const resultAction = await dispatch(createTask(payload));
    if (createTask.fulfilled.match(resultAction)) {
      navigate("/projects");
    }
  };

  return (
    <section className="detail-screen">
      <div className="detail-hero">
        <div>
          <p className="detail-kicker">Create Task</p>
          <h1>New task</h1>
          <p className="detail-subtitle">
            Assign tasks to projects and users.
          </p>
        </div>
      </div>

      <div className="detail-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="project_id">Project</label>
              <select
                id="project_id"
                name="project_id"
                value={formState.project_id}
                onChange={handleChange}
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="task_name">Task name</label>
              <input
                id="task_name"
                name="task_name"
                type="text"
                value={formState.task_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="user_assigned">Assign to</label>
              <input
                id="user_assigned"
                name="user_assigned"
                type="text"
                value={formState.user_assigned}
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
              <label htmlFor="task_description">Description</label>
              <textarea
                id="task_description"
                name="task_description"
                value={formState.task_description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {createError && <p className="helper-text">{createError}</p>}

          <div className="form-actions">
            <Link className="button button-ghost" to="/projects">
              Cancel
            </Link>
            <button
              className="button button-primary"
              type="submit"
              disabled={createStatus === "loading"}
            >
              Create task
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TaskCreateView;
