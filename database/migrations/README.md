# 数据库迁移说明

## 目录结构
```
database/
├── migrations/
│   ├── 0001_initial_schema.sql
│   └── ...
└── schema.sql
```

## 迁移文件命名规范
- 文件名格式：`000X_description.sql`
- X 为迁移序号，从 0001 开始
- description 为简短描述，使用小写字母和下划线

## 迁移文件内容规范
1. 每个迁移文件应包含完整的事务
2. 包含必要的回滚语句
3. 添加注释说明
4. 避免硬编码值

## 执行迁移
```bash
# 创建数据库
createdb campus_gis

# 执行迁移
psql -f migrations/0001_initial_schema.sql campus_gis
```

## 回滚迁移
```sql
-- 在迁移文件中添加回滚语句
BEGIN;

-- 回滚语句
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS facilities CASCADE;
DROP TABLE IF EXISTS paths CASCADE;
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS voice_commands CASCADE;

ROLLBACK;
```

## 注意事项
1. 每次迁移前备份数据库
2. 测试迁移脚本
3. 保持迁移文件的原子性
4. 避免并发执行迁移
5. 记录迁移历史
