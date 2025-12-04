const listTodos = require('../../src/commands/listCommand');

// 模拟控制台和依赖模块
const originalConsole = console;
global.console = {
  error: jest.fn(),
  log: jest.fn()
};

jest.mock('../../src/utils/fileHandler', () => ({
  readTodos: jest.fn()
}));

jest.mock('../../src/utils/formatUtils', () => ({
  formatTasks: jest.fn()
}));

const { readTodos } = require('../../src/utils/fileHandler');
const { formatTasks } = require('../../src/utils/formatUtils');

describe('listCommand 模块', () => {
  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
    
    // 模拟任务数据
    const mockTasks = [
      { id: 1, title: '任务1', completed: false, priority: 'high' },
      { id: 2, title: '任务2', completed: true, priority: 'medium' },
      { id: 3, title: '任务3', completed: false, priority: 'low' }
    ];
    
    readTodos.mockReturnValue(mockTasks);
    formatTasks.mockReturnValue('格式化的任务列表');
  });

  it('应该列出所有任务', () => {
    const result = listTodos({});
    
    expect(result).toBe(true);
    expect(readTodos).toHaveBeenCalled();
    expect(formatTasks).toHaveBeenCalledWith([
      { id: 1, title: '任务1', completed: false, priority: 'high' },
      { id: 2, title: '任务2', completed: true, priority: 'medium' },
      { id: 3, title: '任务3', completed: false, priority: 'low' }
    ]);
    expect(console.log).toHaveBeenCalledWith('格式化的任务列表');
  });

  it('应该按状态过滤任务 - 已完成', () => {
    const result = listTodos({ status: 'completed' });
    
    expect(result).toBe(true);
    expect(formatTasks).toHaveBeenCalledWith([
      { id: 2, title: '任务2', completed: true, priority: 'medium' }
    ]);
  });

  it('应该按状态过滤任务 - 未完成', () => {
    const result = listTodos({ status: 'pending' });
    
    expect(result).toBe(true);
    expect(formatTasks).toHaveBeenCalledWith([
      { id: 1, title: '任务1', completed: false, priority: 'high' },
      { id: 3, title: '任务3', completed: false, priority: 'low' }
    ]);
  });

  it('应该按优先级过滤任务', () => {
    const result = listTodos({ priority: 'high' });
    
    expect(result).toBe(true);
    expect(formatTasks).toHaveBeenCalledWith([
      { id: 1, title: '任务1', completed: false, priority: 'high' }
    ]);
  });

  it('应该组合过滤任务 - 未完成且高优先级', () => {
    const result = listTodos({ status: 'pending', priority: 'high' });
    
    expect(result).toBe(true);
    expect(formatTasks).toHaveBeenCalledWith([
      { id: 1, title: '任务1', completed: false, priority: 'high' }
    ]);
  });

  it('应该处理没有任务的情况', () => {
    readTodos.mockReturnValue([]);
    formatTasks.mockReturnValue('没有找到任务');
    
    const result = listTodos({});
    
    expect(result).toBe(true);
    expect(formatTasks).toHaveBeenCalledWith([]);
    expect(console.log).toHaveBeenCalledWith('没有找到任务');
  });

  it('应该在出错时返回false', () => {
    readTodos.mockImplementation(() => {
      throw new Error('读取失败');
    });
    
    const result = listTodos({});
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('列出任务失败:', '读取失败');
  });
});