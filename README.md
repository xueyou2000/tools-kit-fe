# 项目模板

> 注意 `lint-staged` 只会检查 git 暂存区(staged)的文件，而不是所有文件。如果历史文件有lint错误，请手动执行`npm run lint`
> 并且 `lint-staged` 会自动尝试修复代码, 比如格式化

当你要发布新版本时，创建并推送一个新的 tag：

```bash
git tag v1.0.0
git push origin v1.0.0
```

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

```toml
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

## 证书

1. 生成私钥

```bash
openssl genrsa -out mykey.key 2048
```

2. 创建证书签名请求 (CSR)：使用私钥创建一个 CSR 文件

```bash
openssl req -new -key mykey.key -out mycert.csr
```

3. 创建证书签名请求 (CSR)：使用私钥创建一个 CSR 文件。

在这一步中，系统会询问你一些信息，如国家、省份、城市、组织名称等。请根据需要填写这些信息，特别是“Common Name”字段，通常设置为你的域名或者应用名。

- 国家：CN
- 省份：Beijing
- 城市：Beijing
- 组织名称：xueyou
- 组织名称：xueyou
- 常用名称：MyApp
- Email Address 可选，直接回车
- A challenge password 可选，直接回车

```bash
openssl req -new -key mykey.key -out mycert.csr
```

4. 生成自签名证书：使用 CSR 和私钥创建一个自签名证书。

```bash
openssl x509 -req -days 365 -in mycert.csr -signkey mykey.key -out mycert.crt
```

5. 转换证书格式：Tauri 和 macOS 可能更倾向于 .p12 格式的证书文件，因此可以将上述生成的 .crt 和 .key 文件合并并转换为 .p12 文件。

> 系统会要求你为这个 .p12 文件设置一个导出密码，请记住这个密码，因为后续配置时可能会用到。

```bash
openssl pkcs12 -export -out mycert.p12 -inkey mykey.key -in mycert.crt
```

6. 导入证书：双击生成的 .p12 文件以将其添加到系统的钥匙串（Keychain Access）中。选择“登录”钥匙串，并确保它被标记为“始终信任”。

Tauri 开发开的ap ，打包后，如果不进行验证，每次安装后打开，都会提示 App已经损坏，虽然可以通过命令（ xattr -c /Applications/appname.app）解决，但是体验不好

在 macOS 上，App 公正 分两种:
一种是 在App Store 中的，
一种是在App Store 外的

> App 公正(notarize) 前要签名, 第二种方式我们用 Developer ID Application 签名

查看signingIdentity,

```bash
security find-identity -v -p codesigning
```

将 `A03FAxxx...` 替换为你的 signingIdentity

此时在运行编译，会只有一个警告

> Warn skipping app notarization, no APPLE_ID & APPLE_PASSWORD & APPLE_TEAM_ID or APPLE_API_KEY & APPLE_API_ISSUER & APPLE_API_KEY_PATH environment variables found

然后需要设置环境变量用于公证 Notarizing

```bash
export APPLE_ID=your_apple_id
export APPLE_PASSWORD=your_apple_password
export APPLE_TEAM_ID=your_apple_team_id
```

你可以通过以下命令将 .p12 证书文件转换为 base64 编码字符串：

```bash
base64 -i your-certificate.p12 -o certificate-base64.txt
```
