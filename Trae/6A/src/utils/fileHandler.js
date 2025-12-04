const fs = require('fs');
const path = require('path');

// 默认数据存储文件路径
const DEFAULT_DATA_FILE = path.join(process.cwd(), 'data', 'todos.json');

/**
 * 确保数据目录存在
 * @param {string} dirPath - 目录路径
 */
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * 读取TODO数据
 * @param {string} [filePath=DEFAULT_DATA_FILE] - 数据文件路径
 * @returns {Array} TODO列表
 */
const readTodos = (filePath = DEFAULT_DATA_FILE) => {
  try {
    if (!fs.existsSync(filePath)) {
      // 如果文件不存在，返回空数组
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取TODO数据失败:', error.message);
    return [];
  }
};

/**
 * 保存TODO数据
 * @param {Array} todos - TODO列表
 * @param {string} [filePath=DEFAULT_DATA_FILE] - 数据文件路径
 * @returns {boolean} 保存是否成功
 */
const saveTodos = (todos, filePath = DEFAULT_DATA_FILE) => {
  try {
    // 确保数据目录存在
    ensureDirectoryExists(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(todos, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('保存TODO数据失败:', error.message);
    return false;
  }
};

module.exports = {
  readTodos,
  saveTodos,
  DEFAULT_DATA_FILE
};