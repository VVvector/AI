#!/usr/bin/env node
const { Command } = require('commander');
const addTodo = require('./commands/addCommand');
const listTodos = require('./commands/listCommand');
const completeTodo = require('./commands/completeCommand');
const deleteTodo = require('./commands/deleteCommand');

// 创建命令行应用
const program = new Command();

// 设置版本信息
program
  .version('1.0.0')
  .description('一个简单的每日TODO List CLI工具');

// 添加任务命令
program
  .command('add')
  .alias('a')
  .description('添加新任务')
  .option('-t, --title <title>', '任务标题', (value) => value.trim(), '')
  .option('-d, --dueDate <date>', '截止日期 (YYYY-MM-DD)')
  .option('-p, --priority <priority>', '优先级 (low/medium/high)', 'medium')
  .action((options) => {
    addTodo(options);
  });

// 列出任务命令
program
  .command('list')
  .alias('l')
  .description('列出所有任务')
  .option('-s, --status <status>', '任务状态过滤 (all/completed/pending)', 'all')
  .option('-p, --priority <priority>', '优先级过滤 (low/medium/high)')
  .action((options) => {
    listTodos(options);
  });

// 完成任务命令
program
  .command('complete <id>')
  .alias('c')
  .description('标记任务为已完成')
  .action((id) => {
    completeTodo(id);
  });

// 删除任务命令
program
  .command('delete <id>')
  .alias('d')
  .description('删除任务')
  .action((id) => {
    deleteTodo(id);
  });

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供命令，显示帮助信息
if (!program.args.length) {
  program.help();
}