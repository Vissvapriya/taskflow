# Taskflow Server - Backend Setup

## Project Structure

```
server/
├── src/
│   ├── app.js                  # Express app configuration
│   ├── index.js                # Server entry point
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Project.js          # Project schema
│   │   ├── Task.js             # Task schema
│   │   └── Team.js             # Team schema
│   ├── routes/
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── projectRoutes.js    # Project routes
│   │   ├── taskRoutes.js       # Task routes
│   │   ├── teamRoutes.js       # Team routes
│   │   └── userRoutes.js       # User routes
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── projectController.js # Project logic
│   │   ├── taskController.js   # Task logic
│   │   ├── teamController.js   # Team logic
│   │   └── userController.js   # User logic
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   └── errorHandler.js     # Error handling middleware
│   └── utils/
│       └── validators.js       # Input validation utilities
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── package.json                 # Dependencies and scripts
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update values with your configuration

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Start Production Server**
   ```bash
   npm start
   ```

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **dotenv** - Environment variable management
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation/verification
- **cors** - Cross-Origin Resource Sharing
- **validator** - Input validation
- **nodemon** - Auto-reload during development

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add comment
- `PUT /api/tasks/:id/status` - Update task status

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add member
- `DELETE /api/teams/:id/members/:userId` - Remove member

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/:id/projects` - Get user's projects
- `GET /api/users/:id/tasks` - Get user's tasks

## Database Models

### User
- name (String)
- email (String, unique)
- password (String, hashed)
- role (Admin, Manager, Member)
- teams (Array of Team IDs)
- bio (String, optional)
- profilePicture (String, optional)
- timestamps

### Project
- title (String)
- description (String, optional)
- teamMembers (Array of User IDs)
- status (Not Started, In Progress, Completed)
- deadline (Date, optional)
- owner (User ID)
- tasks (Array of Task IDs)
- timestamps

### Task
- title (String)
- description (String, optional)
- project (Project ID)
- assignedTo (User ID, optional)
- status (To Do, In Progress, Done)
- priority (Low, Medium, High)
- dueDate (Date, optional)
- comments (Array of comment objects)
- createdBy (User ID)
- timestamps

### Team
- name (String)
- description (String, optional)
- members (Array of User IDs)
- owner (User ID)
- projects (Array of Project IDs)
- timestamps

## Implementation TODO List

- [ ] Complete auth controller (register, login, password hashing, JWT)
- [ ] Complete project controller (CRUD, member management)
- [ ] Complete task controller (CRUD, comments, status updates)
- [ ] Complete team controller (CRUD, member management)
- [ ] Complete user controller (profile, projects, tasks)
- [ ] Implement auth middleware (token verification)
- [ ] Implement error handler middleware
- [ ] Add input validation
- [ ] Add MongoDB connection error handling
- [ ] Add API logging
- [ ] Add rate limiting
- [ ] Add request validation middleware
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Deploy to production

## Notes

- All passwords are hashed using bcryptjs before storage
- JWT tokens should be included in Authorization header: `Bearer <token>`
- Database connection string should be set in `.env` file
- CORS is configured to accept requests from the frontend URL
