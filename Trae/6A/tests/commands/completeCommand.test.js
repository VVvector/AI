const completeTodo = require('../../src/commands/completeCommand');

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

describe('completeCommand 模块', () => {
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

  it('应该成功标记任务为已完成', () => {
    const result = completeTodo(1);
    
    expect(result).toBe(true);
    expect(readTodos).toHaveBeenCalled();
    expect(saveTodos).toHaveBeenCalled();
    
    // 检查保存的任务列表
    const savedTasks = saveTodos.mock.calls[0][0];
    expect(savedTasks[0].completed).toBe(true);
    expect(savedTasks[0]).toHaveProperty('completedAt');
    expect(savedTasks[1].completed).toBe(false);
    expect(savedTasks[2].completed).toBe(true);
    
    expect(console.log).toHaveBeenCalledWith('✅ 任务 #1 已标记为完成!');
  });

  it('应该允许重新标记已完成任务', () => {
    const result = completeTodo(3);
    
    expect(result).toBe(true);
    expect(saveTodos).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('✅ 任务 #3 已标记为完成!');
  });

  it('应该提示任务不存在', () => {
    const result = completeTodo(999);
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('错误: 未找到ID为 999 的任务');
    expect(saveTodos).not.toHaveBeenCalled();
  });

  it('应该在保存失败时返回false', () => {
    saveTodos.mockReturnValue(false);
    
    const result = completeTodo(1);
    
    expect(result).toBe(false);
    // 注意：completeCommand.js 在保存失败时不会输出错误消息，只会返回false
    expect(console.error).not.toHaveBeenCalled();
  });

  it('应该在读取任务失败时返回false', () => {
    readTodos.mockImplementation(() => {
      throw new Error('读取失败');
    });
    
    const result = completeTodo(1);
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('完成任务失败:', '读取失败');
  });
});