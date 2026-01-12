import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../services/TaskService';
import { TaskModel } from '../models/Task';

const router = Router();
const taskModel = new TaskModel();
const taskService = new TaskService(taskModel);
const taskController = new TaskController(taskService);

// GET /api/tasks - Get all tasks
router.get('/', (req, res) => taskController.getAllTasks(req, res));

// Advanced Features Routes - Specific routes before parameterized ones

// GET /api/tasks/search - Search tasks
router.get('/search', (req, res) => taskController.searchTasks(req, res));

// GET /api/tasks/analytics - Get task analytics
router.get('/analytics', (req, res) => taskController.getTaskAnalytics(req, res));

// GET /api/tasks/dependency-order - Get tasks by dependency order
router.get('/dependency-order', (req, res) => taskController.getTasksByDependencyOrder(req, res));

// GET /api/tasks/blocked - Get blocked tasks
router.get('/blocked', (req, res) => taskController.getBlockedTasks(req, res));

// GET /api/tasks/priority/sorted - Get tasks sorted by priority
router.get('/priority/sorted', (req, res) => taskController.getTasksByPriority(req, res));

// GET /api/tasks/recent - Get recent tasks
router.get('/recent', (req, res) => taskController.getRecentTasks(req, res));

// GET /api/tasks/status/completed - Get completed tasks
router.get('/status/completed', (req, res) => taskController.getCompletedTasks(req, res));

// GET /api/tasks/status/pending - Get pending tasks
router.get('/status/pending', (req, res) => taskController.getPendingTasks(req, res));

// POST /api/tasks/template - Create task from template
router.post('/template', (req, res) => taskController.createTaskFromTemplate(req, res));

// Parameterized routes - These should come last

// GET /api/tasks/:id - Get task by ID
router.get('/:id', (req, res) => taskController.getTaskById(req, res));

// POST /api/tasks - Create new task
router.post('/', (req, res) => taskController.createTask(req, res));

// PUT /api/tasks/:id - Update task
router.put('/:id', (req, res) => taskController.updateTask(req, res));

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req, res) => taskController.deleteTask(req, res));

// POST /api/tasks/:id/subtasks - Add subtask
router.post('/:id/subtasks', (req, res) => taskController.addSubtask(req, res));

// PUT /api/tasks/:id/subtasks/:subtaskId - Update subtask
router.put('/:id/subtasks/:subtaskId', (req, res) => taskController.updateSubtask(req, res));

// POST /api/tasks/:id/dependencies - Add dependency
router.post('/:id/dependencies', (req, res) => taskController.addDependency(req, res));

// POST /api/tasks/:id/time/start - Start time tracking
router.post('/:id/time/start', (req, res) => taskController.startTimeTracking(req, res));

// PUT /api/tasks/:id/time/:timeEntryId/stop - Stop time tracking
router.put('/:id/time/:timeEntryId/stop', (req, res) => taskController.stopTimeTracking(req, res));

export default router;