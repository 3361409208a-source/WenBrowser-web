# 🌊 MoyuBrowser (摸鱼浏览器) 项目实训报告及工程导览

![MoyuBrowser Logo](assets/logo.png)

> **为高效办公而生，让灵感在隐秘中自由流淌。**
> **工程定位**：面向专业办公环境的隐匿增强型网页浏览器。
> **技术栈**：.NET 8.0, WinForms, Microsoft WebView2 (Chromium Engine), Win32 API Interop (P/Invoke).

---

## 1. 📂 项目架构与模块化设计

本项目采用基于 **.NET 8.0** 的高性能桌面框架开发，结构清晰，职责分离：
- **MoyuBrowser.Core**：核心逻辑层。管理字体配置 (`FontManager`)、全局设置存储 (`SettingsManager`) 以及基于动态色彩代理的主题引擎 (`ThemeManager`)。
- **MoyuBrowser.UI**：用户交互层。
    - `Forms`: 包含主窗体以及自定义的隐匿基类 `MoyuBaseForm`（实现了无边框窗口拖拽与边缘缩放）。
    - `Controls`: 容纳自定义组件。
- **WebView2 适配层**：负责高性能网页渲染与跨域资源的虚拟映射。

## 2. 🛡️ 核心隐秘技术 (The Stealth Engine)

本项实训的核心在于针对办公环境深度优化的“三段式”防御体系：

- **🚀 全局老板键 (Boss Key)**：
  - **实现逻辑**：利用 Win32 `RegisterHotKey` 注册全局热键（`Alt + B` / `Alt + Space`）。
  - **效果**：瞬间剥离任务栏图标并将窗口完全隐藏，进入进程级静默状态，仅保留极其隐蔽的系统托盘钩子。
- **🌓 智能焦点淡化 (Focus-Stealth)**：
  - **逻辑**：监控 `GetForegroundWindow` 与鼠标位置。
  - **效果**：当检测到用户切换到其他办公软件或鼠标移出时，浏览器会自动进入“影子模式”，将透明度瞬间平滑调节至 `0.15`。
- **📜 身份伪装 (Title Spoofing)**：
  - **功能**：一键将窗口标题由“浏览器”切换为“财务审计报告草案.docx”或“代码重构计划.json”，通过视觉错觉降低敏感度。

## 3. 🎨 动态视觉引擎 (The Theme Hub)

我们构建了一套可扩展的主题代理系统，解决了 WinForms 控件样式碎片化的问题：

- **五大预设主题**：经典黑、VS Code 暗色、Office 简约白、极简透明、以及实训新增的**樱花粉 (Sakura Pink)**。
- **统一配色令牌 (Theme Tokens)**：引入了 `InputBg`, `HoverColor`, `TabActive` 等高级属性，实现了从地址栏到按钮悬停反馈的全链路动态适配。
- **冷静模式 (Global Greyscale)**：通过向 WebView2 注入 `html { filter: grayscale(100%) }` 的 CSS 脚本，实现网页内容的全局黑白化，降低浏览内容在周边视野中的识别度。

## 4. 🌐 现代化浏览体验

- **Chromium 内核驱动**：采用业界领先的 WebView2 核心，提供 100% 的现代网页标准支持。
- **标签页强控系统**：自主实现多标签 UI 逻辑，强制拦截所有外部弹出窗口并归档至内嵌标签页，确保办公桌面的纯净度。
- **虚拟资源映射**：通过 `SetVirtualHostNameToFolderMapping` 解决自载字体在 WebView2 防沙箱机制下的应用难题。

## 5. ⌨️ 专家级快捷键参考

| 功能 | 键位 | 说明 |
| :--- | :--- | :--- |
| **瞬间隐身 (Boss)** | `Alt + B` / `Alt + Space` | 瞬间隐藏主窗体及其任务栏标识 |
| **自选透明度** | `Alt + ↑` / `Alt + ↓` | 动态增加/减少窗口透明度 (10%-100%) |
| **极速建签** | `Alt + T` | 毫秒级打开新标签页 |
| **快速关签** | `Alt + W` | 快速销毁当前活跃标签 |
| **快速最小化** | `Alt + Q` | 最小化至系统通知区域 |

## 6. ⚙️ 构建与分发 (Deployment)

- **📦 便携化部署**：支持 `Single-file` 发布，已将所有 .NET 运行时依赖整合为单一 `MoyuBrowser.exe`。
- **🛠️ 自动化安装**：内置 `Install.ps1` 脚本，可快速实现 LocalAppData 部署与桌面快捷方式自动生成。
- **📜 专业级脚本**：提供 `MoyuBrowser.iss` 脚本，配合 Inno Setup 可一键生成带有品牌图标的正式安装程序。

---

> **实训总结**：
> 本次实训不仅仅是开发一款浏览器，更是对 **Win32 低级 API 调用**、**WebView2 高级特性应用** 以及 **极致 UI 状态管理** 的深度实践。MoyuBrowser 展示了如何通过软件工程手段，在办公效率与个人隐私空间之间寻找完美的平衡。

---

> "Work hard, Moyu harder." 🌊
