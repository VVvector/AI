const { readTodos, saveTodos } = require('../utils/fileHandler');

/**
 * 删除任务
 * @param {number} taskId - 任务ID
 * @returns {boolean} 操作是否成功
 */
const deleteTodo = (taskId) => {
  try {
    if (!taskId || isNaN(taskId)) {
      console.error('错误: 请提供有效的任务ID');
      return false;
    }

    // 读取现有任务
    const todos = readTodos();
    
    // 查找任务
    const todoIndex = todos.findIndex(todo => todo.id === parseInt(taskId));
    
    if (todoIndex === -1) {
      console.error(`错误: 未找到ID为 ${taskId} 的任务`);
      return false;
    }
    
    // 删除任务
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    
    // 保存更新后的任务列表
    if (saveTodos(todos)) {
      console.log(`🗑️  任务 #${taskId} "${deletedTodo.title}" 已删除!`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('删除任务失败:', error.message);
    return false;
  }
};

module.exports = deleteTodo;