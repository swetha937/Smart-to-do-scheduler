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

## Development Workflows
- Run `npm install` to set up dependencies
- Use `npm run dev` to start both frontend and backend servers simultaneously
- Use `npm run server` to start the backend API server (port 3001)
- Use `npm run client` to start the frontend development server (port 5173+)
- Execute `npm test` for running test suite
- Build production version with `npm run build`

## Common Tasks
- Adding new task types: Extend the Task model in `src/shared/Task.ts`
- Implementing new AI features: Integrate in `src/server/services/TaskService.ts`
- UI components: Place in `src/client/components/` directory following atomic design
- Styling components: Create corresponding `.css` files and import them in components
- Include hover effects, transitions, and rainbow animations for interactive elements
- Optimizing task operations: Use PriorityQueue for sorting tasks by priority, HashTable for fast lookups, CircularQueue for undo/redo functionality, Graph for dependencies, Trie for search
- Adding API endpoints: Add routes in `src/server/routes/`, controllers in `src/server/controllers/`, and services in `src/server/services/`
- Implementing advanced features: Use Graph for dependency management, Trie for fuzzy search, add subtasks and time tracking to TaskService
