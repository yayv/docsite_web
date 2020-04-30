设计思路

1. 每个账号可以创建 1 个或多个项目
2. 每个项目包含的 API 项目文件为 1 个，对应 API 文档，还会有测试文档, bug 记录
	1. project.md
	2. test.md
	3. discuss.md
	4. config.md
	5. data_dict.md
	6. usecase.md
	7. mock.md
3. 可以考虑用 minio 的 oss 存储引擎来存储这些文件
4. 需要用数据库吗？可以用，测试相关的功能需要用。用户账号也使用数据库。


