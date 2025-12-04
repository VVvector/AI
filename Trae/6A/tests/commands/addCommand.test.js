const fs = require('fs');
const path = require('path');
const addTodo = require('../../src/commands/addCommand');

// 模拟控制台
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

describe('addCommand 模块', () => {
  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
    
    // 模拟 readTodos 返回空数组
    readTodos.mockReturnValue([]);
    
    // 模拟 saveTodos 成功
    saveTodos.mockReturnValue(true);
  });

  it('应该成功添加新任务', () => {
    const mockTasks = [];
    const mockNewTaskOptions = {
      title: '测试任务',
      priority: 'high',
      dueDate: '2025-12-31'
    };
    
    readTodos.mockReturnValue(mockTasks);
    
    const result = addTodo(mockNewTaskOptions);
    
    // 验证函数返回true
    expect(result).toBe(true);
    
    // 验证 readTodos 被调用
    expect(readTodos).toHaveBeenCalled();
    
    // 验证 saveTodos 被调用，且包含新任务
    expect(saveTodos).toHaveBeenCalled();
    const savedTasks = saveTodos.mock.calls[0][0];
    expect(savedTasks).toHaveLength(1);
    expect(savedTasks[0].title).toBe(mockNewTaskOptions.title);
    expect(savedTasks[0].priority).toBe(mockNewTaskOptions.priority);
    expect(savedTasks[0].dueDate).toBe(mockNewTaskOptions.dueDate);
    expect(savedTasks[0].completed).toBe(false);
  });

  it('应该为新任务分配正确的ID', () => {
    const mockTasks = [
      { id: 1, title: '已有任务1' },
      { id: 2, title: '已有任务2' }
    ];
    
    readTodos.mockReturnValue(mockTasks);
    
    addTodo({ title: '新任务', priority: 'medium' });
    
    // 验证新任务ID为3
    const savedTasks = saveTodos.mock.calls[0][0];
    expect(savedTasks).toHaveLength(3);
    expect(savedTasks[2].id).toBe(3);
  });

  it('应该在保存失败时返回false', () => {
    // 模拟 saveTodos 失败
    saveTodos.mockReturnValue(false);
    
    const result = addTodo({ title: '测试任务', priority: 'low' });
    
    expect(result).toBe(false);
  });

  it('应该拒绝空标题', () => {
    const result = addTodo({ title: '', priority: 'medium' });
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('错误: 任务标题不能为空');
    expect(readTodos).not.toHaveBeenCalled();
  });

  it('应该拒绝无效的优先级', () => {
    const result = addTodo({ title: '测试任务', priority: 'invalid' });
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('错误: 优先级必须是 low、medium 或 high');
    expect(readTodos).not.toHaveBeenCalled();
  });

  it('应该拒绝无效的日期格式', () => {
    const result = addTodo({ title: '测试任务', priority: 'medium', dueDate: 'invalid-date' });
    
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('错误: 日期格式必须是 YYYY-MM-DD');
    expect(readTodos).not.toHaveBeenCalled();
  });
});