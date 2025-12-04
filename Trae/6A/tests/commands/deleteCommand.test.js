const deleteTodo = require('../../src/commands/deleteCommand');

// 模拟控制台和依赖模块
const originalConsole = console;
global.console = {
  error: jest.fn(),
  log: jest.fn()
};

jest.mock('../../src/utils/fileHandler', () => ({
  readTodos: jest.fn(),
  saveTodos: jest.fn()
}));

const { readTodos, saveTodos } = require('../../src/utils/fileHandler');

describe('deleteCommand 模块', () => {
  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
    
    // 模拟任务数据
    const mockTasks = [
      { id: 1, title: '任务1', completed: false, priority: 'high' },
      { id: 2, title: '任务2', completed: false, priority: 'medium' },
      { id: 3, title: '任务3', completed: true, priority: 'low' }
    ];
    
    readTodos.mockReturnValue(mockTasks);
    saveTodos.mockReturnValue(true);
  });

  it('应该成功删除指定任务', () => {
    const result = deleteTodo(1);
    
    expect(result).toBe(true);
    expect(readTodos).toHaveBeenCalled();
    expect(saveTodos).toHaveBeenCalledWith([
      { id: 2, title: '任务2', completed: false, priority: 'medium' },
      { id: 3, title: '任务3', completed: true, priority: 'low' }
    ]);
    expect(console.log).toHaveBeenCalledWith('🗑️  任务 #1 "任务1" 已删除!');
  });

  it('应该提示任务不存在', () => {
    const result = deleteTodo(999);
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('错误: 未找到ID为 999 的任务');
    expect(saveTodos).not.toHaveBeenCalled();
  });

  it('应该在保存失败时返回false', () => {
    saveTodos.mockReturnValue(false);
    
    const result = deleteTodo(1);
    
    expect(result).toBe(false);
  });

  it('应该在读取任务失败时返回false', () => {
    readTodos.mockImplementation(() => {
      throw new Error('读取失败');
    });
    
    const result = deleteTodo(1);
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('删除任务失败:', '读取失败');
  });
});