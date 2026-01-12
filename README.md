# Smart To-Do App - AI Coding Guidelines

## Project Overview
This is an **advanced smart-to-do application** that helps users manage complex tasks with intelligent features like prioritization, reminders, categorization, subtasks, dependencies, time tracking, and analytics. The app aims to provide a comprehensive task management experience with AI-assisted suggestions and advanced data structures.

## Architecture
- **Frontend**: React web application with TypeScript, featuring tabbed navigation (Tasks, Analytics, Search)
- **Backend**: Express.js API server with TypeScript handling business logic and data persistence
- **Database**: In-memory storage (can be extended to persistent storage)
- **Advanced Data Structures**: PriorityQueue, HashTable, CircularQueue, Graph, Trie for complex operations
- **AI Integration**: Machine learning models for task prioritization, search, and suggestions (planned)

## Key Advanced Features
- **Subtasks**: Break down complex tasks into manageable components with progress tracking
- **Task Dependencies**: Create dependency relationships between tasks with cycle detection
- **Time Tracking**: Track estimated vs actual time spent on tasks
- **Task Templates**: Pre-built templates for common task types (meetings, development, reviews)
- **Advanced Search**: Fuzzy search with filters by category, priority, tags, and completion status
- **Analytics Dashboard**: Comprehensive insights including completion rates, time efficiency, and priority distribution
- **Dependency Resolution**: Topological sorting for task execution order
- **Blocked Tasks**: Identify tasks waiting on dependencies

## Key Patterns
- Use RESTful API design for backend endpoints
- Implement MVC pattern for backend (Models, Views/Controllers, Services)
- Use React hooks for frontend state management
- Utilize custom data structures from `src/data-structures/` for efficient task management (e.g., PriorityQueue for task prioritization, HashTable for fast lookups, CircularQueue for recent tasks)

## Development Workflows
- Run `npm install` to set up dependencies
- Use `npm run dev` to start both frontend and backend servers simultaneously
- Use `npm run server` to start the backend API server (port 3001)
- Use `npm run client` to start the frontend development server (port 5173+)
- Execute `npm test` for running test suite
- Build production version with `npm run build`

## Code Conventions
- Use TypeScript for type safety
- Follow ESLint configuration for code style
- Write unit tests for all utility functions
- Use descriptive commit messages following conventional commits

## API Integration
- **Backend**: Express.js server with RESTful API endpoints
- **Endpoints**:
  - `GET /api/tasks` - Get all tasks
  - `GET /api/tasks/:id` - Get task by ID
  - `POST /api/tasks` - Create new task
  - `PUT /api/tasks/:id` - Update task
  - `DELETE /api/tasks/:id` - Delete task
  - `POST /api/tasks/template` - Create task from template
  - `POST /api/tasks/:id/subtasks` - Add subtask
  - `PUT /api/tasks/:id/subtasks/:subtaskId` - Update subtask
  - `POST /api/tasks/:id/dependencies` - Add dependency
  - `POST /api/tasks/:id/time/start` - Start time tracking
  - `PUT /api/tasks/:id/time/:timeEntryId/stop` - Stop time tracking
  - `GET /api/tasks/search` - Advanced search with filters
  - `GET /api/tasks/analytics` - Task analytics and insights
  - `GET /api/tasks/dependency-order` - Tasks by dependency order
  - `GET /api/tasks/blocked` - Get blocked tasks
  - `GET /api/tasks/priority/sorted` - Get tasks sorted by priority
  - `GET /api/tasks/recent` - Get recent tasks
  - `GET /api/tasks/status/completed` - Get completed tasks
  - `GET /api/tasks/status/pending` - Get pending tasks
  - `GET /health` - Health check

## Common Tasks
- Adding new task types: Extend the Task model in `src/shared/Task.ts`
- Implementing new AI features: Integrate in `src/server/services/TaskService.ts`
- UI components: Place in `src/client/components/` directory following atomic design
- Styling components: Create corresponding `.css` files and import them in components
- Include hover effects, transitions, and rainbow animations for interactive elements
- Optimizing task operations: Use PriorityQueue for sorting tasks by priority, HashTable for fast lookups, CircularQueue for undo/redo functionality, Graph for dependencies, Trie for search
- Adding API endpoints: Add routes in `src/server/routes/`, controllers in `src/server/controllers/`, and services in `src/server/services/`
- Implementing advanced features: Use Graph for dependency management, Trie for fuzzy search, add subtasks and time tracking to TaskService

## File Structure
- `src/client/`: React frontend application
  - `components/`: Reusable React components (TaskList, AddTaskForm, TaskDetails, Analytics, Search)
    - `AddTaskForm.css`: Styles for the task creation form
    - `TaskList.css`: Styles for the task list and items
    - `TaskDetails.css`: Styles for the detailed task view with subtasks and time tracking
    - `Analytics.css`: Styles for the analytics dashboard
    - `Search.css`: Styles for the advanced search interface
  - `App.tsx`: Main React application component with tabbed navigation
  - `App.css`: Main application styles with tabbed layout
  - `index.tsx`: React application entry point
  - `index.css`: Global styles and utility classes
- `src/server/`: Express.js backend API
  - `controllers/`: Request handlers (TaskController with advanced endpoints)
  - `models/`: Data models (Task with advanced fields)
  - `routes/`: API route definitions with advanced endpoints
  - `services/`: Business logic layer (TaskService with advanced features)
  - `server.ts`: Express server setup
- `src/shared/`: Shared types and interfaces (Task with advanced fields)
- `src/data-structures/`: Custom implementations of advanced data structures (PriorityQueue, HashTable, CircularQueue, Graph, Trie)
- `index.html`: Frontend HTML entry point
- `vite.config.ts`: Vite bundler configuration
- `tsconfig.json`: TypeScript configuration
- `tsconfig.server.json`: Server-specific TypeScript configuration
- `package.json`: Node.js dependencies and scripts