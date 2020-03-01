[![](https://vsmarketplacebadge.apphb.com/version-short/niudai.vscode-zhihu.svg)](https://marketplace.visualstudio.com/items?itemName=niudai.vscode-zhihu)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/niudai.vscode-zhihu.svg)](https://marketplace.visualstudio.com/items?itemName=niudai.vscode-zhihu)
[![](https://vsmarketplacebadge.apphb.com/rating-short/niudai.vscode-zhihu.svg)](https://marketplace.visualstudio.com/items?itemName=niudai.vscode-zhihu)


<p align="center">
  <img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/vscode-zhihu.png" alt="vscode-zhihu logo" width="200px" /></a>
</p>
 
<p align="center">
<a href="https://github.com/niudai/VSCode-Zhihu">打一颗 ⭐，世界更亮。</a>
</p> 


# 👽 Zhihu On VSCode

基于 VSCode 的知乎客户端提供包括阅读，搜索，创作，发布等一站式服务，内容加载速度比 Web 端更快，创新的 Markdown-Latex 混合语法让内容创作者更方便地插入代码块，数学公式，并一键发布至知乎平台。项目由 [牛岱](https://www.zhihu.com/people/niu-dai-68-44) 独立设计开发，喜欢的话请献出你的 [⭐](https://github.com/niudai/VSCode-Zhihu '给一个Star')。

## ⚡ Features

- 登录
  - [二维码/账密登录](#🔑-登录 )
- 创作
  - [内容创作](#🖍-内容创作)
  - [内容发布](#📩-内容发布)
  - [一键上传图片](#📊-上传图片)
  - [定时发布](#🕐-定时发布)
- 浏览  
  - [个性推荐](#🎭-个性推荐)
  - [实时热榜](#hot-story)
  - [搜索全站](#🔎-搜索 )
  - [收藏夹](#🎫-收藏夹)


## 📃 Reference

- [图标按钮](#😀-图标按钮)
- [快捷键](#⌨-快捷键)
- [配置项](#⚙-配置项)

---

## 🔑 登录 


<a name = "login"></a>

进入主页面，左侧最上方栏为个人中心，点击登录图标，或使用 `Ctrl + Shift + P` 打开命令面板，搜索并执行 `Zhihu: Login` 命令。

选择登录方式：

### 二维码

选择二维码登陆后，会弹出二维码页面，打开知乎 APP，扫码后点击确认登录：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-28-08.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

### 账号密码

视情况，插件会加载并显示验证码，提示你输入验证码，输入后，再依次根据提示输入手机号和密码即可。

登录成功后会有问候语，推荐栏会自动刷新出你的个性签名和头像：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-30-17.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-32-09.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

    

---

## 🎭 个性推荐

登陆成功后，个性推荐板块会自动刷新，提供你的个性推荐内容：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-30-27.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

内容可能为答案，问题，或文章，点击条目，就会打开VSCode知乎页面：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-21-02-30.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

___

## 💥 热榜

在左侧的中间位置，你会看到热榜栏，内部有六个分类，内容与知乎Web端、移动端同步，助你掌控实时资讯：

<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-10-11-01-37.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

---

## 🔎 搜索 

<a name = "search"></a>
点击搜索按钮，或搜索命令 `Zhihu: Search Items`，搜索全站知乎内容：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/search.gif" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

---

## 🖍 内容创作
<a name = "write"></a>

新建一个后缀名为`.md`的文件，若不需要数学公式，只需要按照你最熟悉的 Markdown 语法写即可，右键点击 `Zhihu: Preview` 可预览答案:

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/preview.gif" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

### Latex 语法支持

为了更好地支持数学公式的写作，知乎定制的 Markdown 转换器提供了 Latex 语法拓展，语法示例：

```
$$
  |\vec{A}|=\sqrt{A_x^2 + A_y^2 + A_z^2}.
$$
```

用 `$$` 包围的部分会被当做 latex 语言进行解析，生成知乎的数学公式，比如上方的数学公式发布至知乎会生成如下公式:

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-22-42-21.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

行内 latex 也同样支持，语法举例：`$\sqrt6$`，一个dollar符号包裹公式即可。

代码块：

记得声明语言标签, 这样发布至知乎的答案才能获得正确的语法高亮，示例如下：

    ```java
    public class Apple {
      public Apple() {}
    }
    ```

发布后会提供 java 的语法高亮:

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-22-47-18.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

>由于知乎服务端的限制，表格暂不支持，答案中的表格会被服务端过滤。

## 📩 内容发布
<a name = "publish"></a>

### 链接扫描 😊

若你想在特定的问题下回答，或想修改自己的某个原有回答，就将问题/答案链接以 `#! https://...` 的格式放置于答案的第一行，发布时，插件会自动扫描识别，发布至相应的问题下，或修改原有的答案。

比如，你想在 [轻功是否真的存在，其在科学上可以解释吗？](https://www.zhihu.com/question/19602618) 该问题下回答问题, 只需将

```
#! https://www.zhihu.com/question/19602618
```

若是你已经创作过的答案, 则将答案的链接, 形如:

```
#! https://www.zhihu.com/question/355223335/answer/1003461264
```

的链接复制至文件顶部即可。

若是你已经创作过的文章，则将文章的链接，形如：

```
#! https://zhuanlan.zhihu.com/p/107810342
```

若插件没有在首行扫描到链接，则会询问创作者接下来的操作，你可以选择发布新文章，或从收藏夹中选取相应问题，发布至相应问题下：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-47-45.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

### 发布文章

选择发布文章后，会继续提示你输入文章标题，输入完成后，按下回车，当前的文档就会以文章的形式发布至你的账号。

#### 文章标题智能识别

文章标题无需手动输入，插件会自动检测文本的第一个一级头标签：

```
# 这是一个标题（必须只是一个#）
```

然后将其作为标题，改行的内容也不会进入到正文中，如果没有检测到，还需用户手动输入。

#### 背景图片智能识别

插件会自动扫描文本第一个一级头标签之前的内容，将第一个发现的图片链接作为背景图片：

```
![Image](https://pic4.zhimg.com/80/v2-157583e100e9e181191d285355332ebf.png)

# 标题在这, 上面的链接会变成背景图片, 不会进入正文
```

### Html 支持

可以在正常的 Markdown 文本中插入 html 文本, 扩展了写作能力。

>绝大多数 html 标签为非法标签，包括 table 在内，会被服务端过滤掉，只有 \<p\>, \<div>, \<img> 等合法标签才会被服务端存储，具体使用时小伙伴们可以自己尝试。

### 从收藏夹中选取

>关于如何管理收藏夹，请移至 [收藏夹](#collect)。

插件会提示选择你收藏过的问题：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-51-43.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

选择后，答案就会发布至相应的答案下（若已在该答案下发布过问题，请用顶部链接的方式来发布！)。

---

## 🕐 定时发布

所有的答案，文章发布时，均会多一次询问，用户须选择是稍后发布还是马上发布，如果选择稍后发布，需要输入发布的时间，比如 “5:30 pm”，"9:45 am" 等，目前仅支持当天的时间选择，输入后，你就会在个人中心的“安排”处看到你将发布的答案和发布的时间（需要手动点击刷新）：

![](https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-16-11-20-14.png)

定时发布采用 prelog 技术，中途关闭 VSCode，关机不影响定时发布，只需保证发布时间 VSCode 处于打开状态 && 知乎插件激活状态即可。

时间到了之后，你会收到答案发布的通知，该事件也会从“安排”中移除。

如果想取消发布，则点击 ❌ 按钮即可：

![](https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-16-15-56-31.png)

>发布事件采用 md5 完整性校验，不允许用户同时预发两篇内容一摸一样的答案或文章。
---

## 🎫 收藏夹
<a name = "collect"></a>

### ➕ 添加收藏

不管是文章，答案，还是问题，在知乎页面顶栏的右侧，都会看到一个粉色的星状图标：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-56-42.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

### ➖ 查看收藏

收藏的内容会在左侧下方显示，插件会自动分类：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-57-40.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

### ✖ 删除收藏

鼠标移至相应的行，会出现叉状图标，点击即可删除：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-59-32.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

---

## 📊 上传图片

一篇优质的答案，离不开图片，知乎插件提供了三种非常便携的图片上传方式，支持上传 `.gif`, `.png`, `.jpg` 格式，且在图片上传的时候自动在当前 Markdown 光标所在行自动生成图片链接，无需创作者手动管理，Windows，MacOS，Linux 全平台支持。

### 从粘贴板上传图片

调用 `Zhihu: PasteImage` 命令，自动将系统粘贴板中的图片上传至知乎图床，并生成相应链接。

快捷键为 `ctrl+alt+p`，也可以通过打开命令行面板搜索命令。

---

### 工作区中右键上传

在当前VSCode打开的文件夹内部，将鼠标放在你想上传的图片上，右键单击即可上传+生成链接：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-09-17-33-26.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

可以看到，可以将文件的路径复制至剪贴板，再调用 `Zhihu: PasteImageFromPath` 命令，插件会自动将该路径的文件上传至知乎图床，生成链接。

### 打开文件浏览器选择图片

在正在编辑的 Markdown 文档下右键，可以看到菜单项 `Zhihu: Upload Image From Explorer`，点击即可打开文件管理器，选择一张图片点击确定即可。

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-09-17-38-39.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

--- 

## 😀 图标按钮

<a name = "icons"></a>

点击左侧活动栏的知乎按钮，进入知乎插件页面，在推荐的上方可以看到三个按钮，对应的命令分别为 `Zhihu: Login`（登录），`Zhihu: Refresh`（刷新）, `Zhihu: Search`（搜素）。

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-19-53-17.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

最右侧的更多栏点开，可以看到 `Zhihu: Logout` (注销) 命令按钮:

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-00-48.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

在 Markdown 页面内，可以在编辑窗口的右上角看到两个按钮：

<p align="center">
<img src="https://raw.githubusercontent.com/niudai/ImageHost/master/zhihu/2020-02-08-20-02-37.png" style="box-shadow: 2px 2px 8px 0px #5dd8fd;border-radius: 6px;"/></p>

左侧的为 `Zhihu: Publish`（发布答案），右侧的为 `Zhihu: Preview` (预览答案)。

## ⌨ 快捷键

>表格中未涉及的命令没有默认快捷键，用户可以根据自己需要进行设置，注意快捷键的下按方式是先按住 ctrl+z，松开 ctrl，再按下一个按键。

| 命令        | Windows           | Mac   |
| :-------------: |:-------------:| :-----:|
| Zhihu: Paste Image From Clipboard | ctrl+alt+p | cmd+alt+p |
|Zhihu: Upload Image From Path     | ctrl+alt+q     |   cmd+alt+q 
| Zhihu: Upload Image From Explorer | ctrl+alt+f     |  cmd+alt+f 

## ⚙ 配置项


| 配置        | 效果           | 
| :-------------: |:-------------:| 
| Zhihu: Use VSTheme  | 打勾开启知乎默认主题样式 |
|Zhihu: Is Title Image Full Screen    | 打勾开让文章背景图片变成全屏    | 

