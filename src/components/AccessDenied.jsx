import React from "react";
import { Link } from "react-router-dom";

function AccessDenied({
  title = "Access restricted",
  message = "You do not have permission to view this page.",
}) {
  return (
    <section className="detail-screen">
      <div className="detail-card empty-state">
        <h1>{title}</h1>
        <p>{message}</p>
        <Link className="link-pill" to="/projects">
          Back to projects
        </Link>
      </div>
    </section>
  );
}

export default AccessDenied;
