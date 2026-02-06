import React from "react";

function ActivityView() {
  return (
    <section className="detail-screen">
      <div className="detail-hero">
        <div>
          <p className="detail-kicker">Activity</p>
          <h1>Team activity</h1>
          <p className="detail-subtitle">
            This page is a placeholder for recent updates and audit logs.
          </p>
        </div>
      </div>
      <div className="detail-card">
        <h2>Coming soon</h2>
        <p className="detail-copy">
          Add task updates, status changes, and assignment history here.
        </p>
      </div>
    </section>
  );
}

export default ActivityView;
