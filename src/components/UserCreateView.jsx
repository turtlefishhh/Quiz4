import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../features/users/usersSlice";

const ROLE_OPTIONS = ["admin", "manager", "user"];

function UserCreateView() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { createStatus, createError } = useSelector((state) => state.users);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    role: "user",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resultAction = await dispatch(createUser(formState));
    if (createUser.fulfilled.match(resultAction)) {
      navigate("/projects");
    }
  };

  return (
    <section className="detail-screen">
      <div className="detail-hero">
        <div>
          <p className="detail-kicker">Create User</p>
          <h1>New user</h1>
          <p className="detail-subtitle">Add a new team member.</p>
        </div>
      </div>

      <div className="detail-card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formState.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formState.role}
                onChange={handleChange}
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
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
              Create user
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default UserCreateView;
