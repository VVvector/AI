const { readTodos, saveTodos } = require('../utils/fileHandler');

/**
 * 添加新任务
 * @param {Object} options - 任务选项
 * @param {string} options.title - 任务标题
 * @param {string} [options.dueDate] - 截止日期 (YYYY-MM-DD)
 * @param {string} [options.priority='medium'] - 优先级 (low/medium/high)
 * @returns {boolean} 添加是否成功
 */
const addTodo = (options) => {
  try {
    const { title, dueDate, priority = 'medium' } = options;
    
    if (!title) {
      console.error('错误: 任务标题不能为空');
      return false;
    }

    // 验证优先级
    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      console.error('错误: 优先级必须是 low、medium 或 high');
      return false;
    }

    // 验证日期格式
    if (dueDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        console.error('错误: 日期格式必须是 YYYY-MM-DD');
        return false;
      }
      
      // 验证日期是否有效
      const date = new Date(dueDate);
      if (isNaN(date.getTime())) {
        console.error('错误: 无效的日期');
        return false;
      }
    }

    // 读取现有任务
    const todos = readTodos();
    
    // 生成新任务ID
    const newId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
    
    // 创建新任务
    const newTodo = {
      id: newId,
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      dueDate
    };
    
    // 添加到任务列表
    todos.push(newTodo);
    
    // 保存更新后的任务列表
    if (saveTodos(todos)) {
      console.log('✅ 任务添加成功!');
      console.log(`ID: ${newTodo.id}`);
      console.log(`标题: ${newTodo.title}`);
      console.log(`优先级: ${newTodo.priority}`);
      if (newTodo.dueDate) {
        console.log(`截止日期: ${newTodo.dueDate}`);
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('添加任务失败:', error.message);
    return false;
  }
};

module.exports = addTodo;