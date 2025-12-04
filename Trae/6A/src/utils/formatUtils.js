/**
 * 格式化任务输出
 * @param {Array} todos - TODO列表
 * @returns {string} 格式化后的任务输出
 */
const formatTasks = (todos) => {
  if (todos.length === 0) {
    return '没有找到任务，使用 todo add 命令添加新任务。';
  }

  const today = new Date().toISOString().split('T')[0];
  let output = '';
  
  // 按日期分组任务
  const tasksByDate = {
    today: [],
    upcoming: [],
    completed: []
  };

  todos.forEach(task => {
    if (task.completed) {
      tasksByDate.completed.push(task);
    } else if (task.dueDate === today) {
      tasksByDate.today.push(task);
    } else {
      tasksByDate.upcoming.push(task);
    }
  });

  // 输出今日任务
  if (tasksByDate.today.length > 0) {
    output += '📅 今日任务\n';
    output += '----------------\n';
    tasksByDate.today.forEach(task => {
      output += formatTaskDetail(task);
    });
    output += '\n';
  }

  // 输出即将到来的任务
  if (tasksByDate.upcoming.length > 0) {
    output += '⏰ 即将到来\n';
    output += '----------------\n';
    tasksByDate.upcoming.forEach(task => {
      output += formatTaskDetail(task);
    });
    output += '\n';
  }

  // 输出已完成任务
  if (tasksByDate.completed.length > 0) {
    output += '✅ 已完成任务\n';
    output += '----------------\n';
    tasksByDate.completed.forEach(task => {
      output += formatTaskDetail(task);
    });
  }

  return output.trim();
};

/**
 * 格式化单个任务详情
 * @param {Object} task - 任务对象
 * @returns {string} 格式化后的任务详情
 */
const formatTaskDetail = (task) => {
  const status = task.completed ? '✅' : '🔴';
  const priority = getPrioritySymbol(task.priority);
  const dueDate = task.dueDate ? ` (截止: ${task.dueDate})` : '';
  
  return `${status} ${priority} ${task.id}. ${task.title}${dueDate}\n`;
};

/**
 * 获取优先级符号
 * @param {string} priority - 优先级值 (low/medium/high)
 * @returns {string} 优先级符号
 */
const getPrioritySymbol = (priority) => {
  switch (priority) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
    default:
      return '🟢';
  }
};

module.exports = {
  formatTasks,
  formatTaskDetail,
  getPrioritySymbol
};