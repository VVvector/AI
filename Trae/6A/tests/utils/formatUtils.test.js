const { formatTasks, formatTaskDetail, getPrioritySymbol } = require('../../src/utils/formatUtils');

describe('formatUtils 模块', () => {
  describe('getPrioritySymbol 函数', () => {
    it('应该返回正确的优先级符号 - high', () => {
      expect(getPrioritySymbol('high')).toBe('🔴');
    });

    it('应该返回正确的优先级符号 - medium', () => {
      expect(getPrioritySymbol('medium')).toBe('🟡');
    });

    it('应该返回正确的优先级符号 - low', () => {
      expect(getPrioritySymbol('low')).toBe('🟢');
    });

    it('应该对未知优先级返回默认符号', () => {
      expect(getPrioritySymbol('unknown')).toBe('🟢');
    });
  });

  describe('formatTaskDetail 函数', () => {
    it('应该正确格式化任务详情 - 未完成', () => {
      const task = { id: 1, title: '测试任务', completed: false, priority: 'high' };
      const result = formatTaskDetail(task);
      expect(result).toContain('🔴');
      expect(result).toContain('🔴 1. 测试任务');
    });

    it('应该正确格式化任务详情 - 已完成', () => {
      const task = { id: 1, title: '测试任务', completed: true, priority: 'medium' };
      const result = formatTaskDetail(task);
      expect(result).toContain('✅');
      expect(result).toContain('🟡 1. 测试任务');
    });

    it('应该正确格式化包含截止日期的任务', () => {
      const task = { id: 1, title: '测试任务', completed: false, priority: 'low', dueDate: '2025-12-31' };
      const result = formatTaskDetail(task);
      expect(result).toContain('(截止: 2025-12-31)');
    });
  });

  describe('formatTasks 函数', () => {
    it('应该在没有任务时返回提示信息', () => {
      const result = formatTasks([]);
      expect(result).toBe('没有找到任务，使用 todo add 命令添加新任务。');
    });

    it('应该正确格式化任务列表', () => {
      const today = new Date().toISOString().split('T')[0];
      const tasks = [
        { id: 1, title: '今日任务', completed: false, priority: 'high', dueDate: today },
        { id: 2, title: '即将到来', completed: false, priority: 'medium', dueDate: '2025-12-31' },
        { id: 3, title: '已完成任务', completed: true, priority: 'low' }
      ];

      const result = formatTasks(tasks);
      
      expect(result).toContain('📅 今日任务');
      expect(result).toContain('⏰ 即将到来');
      expect(result).toContain('✅ 已完成任务');
      expect(result).toContain('今日任务');
      expect(result).toContain('即将到来');
      expect(result).toContain('已完成任务');
    });
  });
});