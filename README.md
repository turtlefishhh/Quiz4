# Quiz 4

React app for project tracking with role-based views and backend-ready CRUD.

## Features
- Project list and detail views with role filtering
- Create, edit, delete projects (admin)
- Create tasks (admin/manager) and create users (admin)
- Reports and Activity placeholder screens
- Role gating via localStorage for quick testing
- Backend-ready API calls with clear error messaging

## Setup
- `npm install`
- `npm start`

## Tutorial
1. Clone on another device:
  - `git clone <your-repo-url>`
  - `cd frontend-template`
2. Install and run:
  - `npm install`
  - `npm start`
3. (Optional) Point to your backend:
  - Set `REACT_APP_API_BASE` in your environment
4. Try roles locally (admin/manager/user):
```js
localStorage.setItem("role", "admin");
localStorage.setItem("userName", "Alex Admin");
localStorage.setItem("userId", "u-1");
location.reload();
```
5. Use the Manage menu to create projects, tasks, and users.

## Backend
- Set `REACT_APP_API_BASE` to your API base URL.
- Required endpoints:
  - `GET /api/v1/projects`
  - `POST /api/v1/projects`
  - `PUT /api/v1/projects/:id`
  - `DELETE /api/v1/projects/:id`
  - `POST /api/v1/tasks`
  - `POST /api/v1/users`
  - ## Backend Repo
https://github.com/turtlefishhh/Quiz4


## Roles (local test)
```js
localStorage.setItem("role", "admin");
localStorage.setItem("userName", "Alex Admin");
localStorage.setItem("userId", "u-1");
location.reload();
```
