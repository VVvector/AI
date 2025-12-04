const { readTodos, saveTodos } = require('../utils/fileHandler');

/**
 * 标记任务为已完成
 * @param {number} taskId - 任务ID
 * @returns {boolean} 操作是否成功
 */
const completeTodo = (taskId) => {
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
    
    // 标记为已完成
    todos[todoIndex].completed = true;
    todos[todoIndex].completedAt = new Date().toISOString();
    
    // 保存更新后的任务列表
    if (saveTodos(todos)) {
      console.log(`✅ 任务 #${taskId} 已标记为完成!`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('完成任务失败:', error.message);
    return false;
  }
};

module.exports = completeTodo;