import { auth } from '../middleware/Auth.mjs';

export let tasks = [
    {
        "id": 1,
        "title": "숙제하기",
        "completed": false,
        "userId": 2
    },
    {
        "id": 2,
        "title": "코코넛 까기",
        "completed": false,
        "userId": 2
    },
    {
        "id": 3,
        "title": "이어폰 사기",
        "completed": false,
        "userId": 1
    }

];

export const taskCRUD = (app) => {

    // 사용자별 모든 작업 조회
    app.get('/tasks', auth, (req, res) => {
        console.log(req.user);
        const userId = req.user.id;

        // Filter tasks for the current user
        const userTasks = tasks.filter(task => task.userId === userId);
        return res.status(200).json({
            code: 200,
            message: '성공적으로 작업 조회가 처리되었습니다.',
            data: {
                tasks: userTasks,
            }
        })
    });

    // 특정 작업 조회
    app.get('/tasks/:id', auth, (req, res) => {
        const userId = req.user.id; // Authenticated user's ID
        const taskId = parseInt(req.params.id, 10); // Task ID from the URL

        // 특정 사용자의 특정 작업 조회
        const task = tasks.find(task => task.id === taskId && task.userId === userId);

        if (!task) {
            return res.status(404).json({
                code: 404,
                message: '작업을 찾을 수 없습니다.', // Task not found
            });
        }

        return res.status(200).json({
            code: 200,
            message: '작업 조회 성공.',
            data: {
                task,
            },
        });
    });

    // 사용자별 작업 추가
    app.post('/tasks', auth, (req, res) => {
        const userId = req.user.id;

        // req.body 로 들어온 json 으로부터 새로운 task 객체 생성
        const newTask = {
            id: tasks.length + 1, // Generate a new unique ID based on the array length
            title: req.body.title,
            completed: req.body.completed || false,
            userId: userId, // Associate the task with the authenticated user
        };
        tasks.push(newTask);

        return res.status(200).json({
            code: 201,
            message: '성공적으로 작업 처리가 되었습니다.',
            data: {
                tasks: newTask,
            }
        })
    });

    // 사용자별 작업 수정
    app.put('/tasks/:id', auth, (req, res) => {
        const userId = req.user.id;
        const taskId = parseInt(req.params.id, 10);

        // Find the task by ID and user ID
        const task = tasks.find(task => task.id === taskId && task.userId === userId);

        if (!task) {
            return res.status(404).json({
                code: 404,
                message: '작업을 찾을 수 없습니다.',
            });
        }

        // Update the task properties
        task.title = req.body.title !== undefined ? req.body.title : task.title;
        task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

        return res.status(200).json({
            code: 200,
            message: '성공적으로 작업이 업데이트되었습니다.',
            data: {
                task,
            },
        });
    });

    // 사용자별 작업 삭제
    app.delete('/tasks/:id', auth, (req, res) => {
        const userId = req.user.id;
        const taskId = parseInt(req.params.id, 10);

        // Find the index of the task
        const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === userId);

        if (taskIndex === -1) {
            return res.status(404).json({
                code: 404,
                message: '작업을 찾을 수 없습니다.',
            });
        }

        // Remove the task from the array
        tasks.splice(taskIndex, 1);

        return res.status(200).json({
            code: 200,
            message: '성공적으로 작업이 삭제되었습니다.',
        });
    });
}