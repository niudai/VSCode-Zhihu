[![](https://vsmarketplacebadge.apphb.com/version-short/niudai.zhihu.svg)](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
[![](https://vsmarketplacebadge.apphb.com/downloads-short/niudai.zhihu.svg)](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
[![](https://vsmarketplacebadge.apphb.com/rating-short/niudai.zhihu.svg)](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

<p align="center">
  <br />
  <a title="Learn more about GitLens" href="https://gitlens.amod.io"><img src="res/media/extension.png" alt="GitLens Logo" width="200px" /></a>
</p>


# Zhihu On VSCode

基于 VSCode 的知乎客户端提供包括阅读，搜索，创作，发布等一站式服务，内容加载速度比 Web 端更快，创新的 Markdown-Latex 混合语法让内容创作者更方便地创作优质内容。

## Preview

![Image](https://niudai.oss-cn-beijing.aliyuncs.com/401abc7e0456af1048f9bf7ecfcddbcb.gif)

## Features

- 支持二维码和账号密码两种登录方式。
- 搜索全站知乎内容。
- 浏览实时热榜内容。
- 浏览知乎全站内容，包括答案，问题，文章。
- 一键上传粘贴板中的图片至知乎图床。
- 使用 Markdown-Latex 扩展语法写答案/文章。
- 在 VSCode 内部发布答案/文章。
- 登陆后获取个性推荐内容。
- 基于本地的收藏夹，收藏知乎内容。

## 登录

进入主页面，左侧最上方栏为个人中心，点击登录图标，或使用 `Ctrl + Shift + P` 打开命令面板，搜索并执行 `Zhihu: Login` 命令。

选择登录方式：


### 二维码

选择二维码登陆后，会弹出二维码页面，打开知乎 APP，扫码后点击确认登录，弹出如下信息，说明登录成功：


### 账号密码

视情况，插件会加载并显示验证码，提示你输入验证码：


输入后，再依次根据提示输入手机号和密码即可。

## 个性推荐

登陆成功后，个性推荐板块会自动刷新，提供你的个性推荐内容：


## 搜索

点击搜索按钮，或搜索命令 `Zhihu: Search Items`，使用搜索功能：

![Image](https://niudai.oss-cn-beijing.aliyuncs.com/1f3d3e73d7743a0fc5cef23193b91610.gif)

## 内容创作



新建一个后缀名为`.md`的文件，若不需要数学公式，只需要按照你最熟悉的 Markdown 语法写即可，右键点击 `Zhihu: Preview` 可预览答案:

![Image](https://niudai.oss-cn-beijing.aliyuncs.com/be8211ee311bed56800ebc3c57fa0027.gif)

若你想在特定的问题下回答，或想修改自己的某个原有回答，就将问题/答案链接以 `#! https://...` 的格式放置于答案的第一行，发布时，插件会自动扫描识别，发布至相应的问题下，或修改原有的答案。

比如，你想在 [轻功是否真的存在，其在科学上可以解释吗？](https://www.zhihu.com/question/19602618) 该问题下回答问题:

![](images/2020-02-07-21-16-10.png)


只需将 `#! https://www.zhihu.com/question/19602618` 粘贴至文件的最顶部即可:

![](images/2020-02-07-21-17-19.png)

若是你已经创作过的答案, 则将形如 `https://www.zhihu.com/question/355223335/answer/1003461264` 的链接复制即可。

知乎插件会自动分析扫描，将你写好的答案转换成知乎端可解析的 html，然后发布至相应的问题/答案下。

若没有在文件首行发现链接，则会弹出对话选择框：

![](images/2020-02-07-21-54-57.png)

