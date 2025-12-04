const fs = require('fs');
const path = require('path');
const { readTodos, saveTodos, DEFAULT_DATA_FILE } = require('../../src/utils/fileHandler');

// 测试用数据文件路径（放在临时目录中）
const TEST_DATA_DIR = path.join(__dirname, 'temp');
const TEST_DATA_FILE = path.join(TEST_DATA_DIR, 'test_todos.json');

// 测试前清理
beforeEach(() => {
  if (fs.existsSync(TEST_DATA_FILE)) {
    fs.unlinkSync(TEST_DATA_FILE);
  }
});

// 测试后清理
afterAll(() => {
  if (fs.existsSync(TEST_DATA_FILE)) {
    fs.unlinkSync(TEST_DATA_FILE);
  }
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmdirSync(TEST_DATA_DIR);
  }
});

describe('fileHandler 模块', () => {
  describe('readTodos 函数', () => {
    it('应该返回空数组当文件不存在时', () => {
      const todos = readTodos(TEST_DATA_FILE);
      expect(todos).toEqual([]);
    });

    it('应该正确读取已存在的任务数据', () => {
      // 先创建测试文件
      const testTodos = [{ id: 1, title: '测试任务', completed: false }];
      fs.mkdirSync(path.dirname(TEST_DATA_FILE), { recursive: true });
      fs.writeFileSync(TEST_DATA_FILE, JSON.stringify(testTodos), 'utf8');
      
      // 读取并验证
      const todos = readTodos(TEST_DATA_FILE);
      expect(todos).toEqual(testTodos);
    });
  });

  describe('saveTodos 函数', () => {
    it('应该正确保存任务数据到文件', () => {
      const testTodos = [{ id: 1, title: '测试任务', completed: false }];
      
      // 保存数据
      const result = saveTodos(testTodos, TEST_DATA_FILE);
      expect(result).toBe(true);
      
      // 验证文件存在且内容正确
      expect(fs.existsSync(TEST_DATA_FILE)).toBe(true);
      const savedData = JSON.parse(fs.readFileSync(TEST_DATA_FILE, 'utf8'));
      expect(savedData).toEqual(testTodos);
    });

    it('应该自动创建不存在的目录', () => {
      const testTodos = [{ id: 1, title: '测试任务', completed: false }];
      const nestedDataFile = path.join(__dirname, 'nested', 'test_todos.json');
      
      // 保存数据到不存在的目录
      const result = saveTodos(testTodos, nestedDataFile);
      expect(result).toBe(true);
      
      // 验证目录和文件存在
      expect(fs.existsSync(path.dirname(nestedDataFile))).toBe(true);
      expect(fs.existsSync(nestedDataFile)).toBe(true);
      
      // 清理
      fs.unlinkSync(nestedDataFile);
      fs.rmdirSync(path.dirname(nestedDataFile));
    });
  });
});