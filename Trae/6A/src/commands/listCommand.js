const { readTodos } = require('../utils/fileHandler');
const { formatTasks } = require('../utils/formatUtils');

/**
 * 列出所有任务
 * @param {Object} options - 过滤选项
 * @param {string} [options.status] - 任务状态过滤 (all/completed/pending)
 * @param {string} [options.priority] - 优先级过滤 (low/medium/high)
 * @returns {boolean} 操作是否成功
 */
const listTodos = (options) => {
  try {
    const { status, priority } = options;
    
    // 读取所有任务
    let todos = readTodos();
    
    // 按状态过滤
    if (status && status !== 'all') {
      const isCompleted = status === 'completed';
      todos = todos.filter(todo => todo.completed === isCompleted);
    }
    
    // 按优先级过滤
    if (priority) {
      todos = todos.filter(todo => todo.priority === priority);
    }
    
    // 格式化输出
    const formattedOutput = formatTasks(todos);
    console.log(formattedOutput);
    
    return true;
  } catch (error) {
    console.error('列出任务失败:', error.message);
    return false;
  }
};

module.exports = listTodos;