# 项目模板

> 注意 `lint-staged` 只会检查 git 暂存区(staged)的文件，而不是所有文件。如果历史文件有lint错误，请手动执行`npm run lint`
> 并且 `lint-staged` 会自动尝试修复代码, 比如格式化

## 项目结构

- application: 应用
- framework: 框架
  - lint-set: 代码规范

## 参照

- UI参照： https://www.radix-ui.com/
- 功能参照： https://www.wetools.com/development?page=1

## rust加速

使用 Rust 国内镜像源

在 ~/.cargo/config 或 %USERPROFILE%\.cargo\config.toml 文件(没有后缀名)中添加以下配置：

```txt
[source.crates-io]
replace-with = 'rsproxy'

[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"

[registries.rsproxy]
index = "https://rsproxy.cn/crates.io-index"

[net]
git-fetch-with-cli = true
```

设置环境变量

```bash
# Windows PowerShell
$env:RUSTUP_DIST_SERVER="https://rsproxy.cn"
$env:RUSTUP_UPDATE_ROOT="https://rsproxy.cn/rustup"

# 或者在 Windows CMD
set RUSTUP_DIST_SERVER=https://rsproxy.cn
set RUSTUP_UPDATE_ROOT=https://rsproxy.cn/rustup
```

清理缓存后重试

```bash
cargo clean
rm -rf %USERPROFILE%\.cargo\.package-cache
```
