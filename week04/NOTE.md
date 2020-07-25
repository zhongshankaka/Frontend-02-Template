# week04 学习笔记

## 浏览器工作原理

把一个 URL 变成一个屏幕上显示的网页。这个过程是这样的：
1. 浏览器首先使用 HTTP 协议或者 HTTPS 协议，向服务端请求页面；
2. 把请求回来的 HTML 代码经过解析，构建成 DOM 树；
3. 计算 DOM 树上的 CSS 属性；最后根据 CSS 属性对元素逐个进行渲染，得到内存中的位图；
4. 一个可选的步骤是对位图进行合成，这会极大地增加后续绘制的速度；
5. 合成之后，再绘制到界面上。

## 有限状态机
- 每一个状态都是一个机器
    - 在每一个机器里，我们可以做计算、存储、输出......
    - 所有的这些机器接受的输入是一致的
    - 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应
该是纯函数(无副作用)
- 每一个机器知道下一个状态
- 每个机器都有确定的下一个状态(Moore)
- 每个机器根据输入决定下一个状态(Mealy)

###  JS中的有限状态机(Mealy)
```Javascript
//每个函数是一个状态
function state(input) //函数参数就是输入
{
    //在函数中，可以自由地编写代码，处理每个状态的逻辑
    return next;//返回值作为下一个状态 
}
/////////以下是调用////////// 
while(input) {
    //获取输入
    state = state(input); //把状态机的返回值作为下一个状态 
}
```

### 状态机匹配字符串
- Trap

```Javascript
function end(c) {
	return end; // 匹配到完整的字符串之后，让 end 函数返回自身，不再进行状态变更
}
```

- re consume 
把自己已经消费掉的输入还原，给下个状态处理函数使用

## HTTP

- request

```
GET / HTTP/1.1  // 第一行被称作 Request Line，它分为三个部分，HTTP Method，也就是请求的“方法”，请求的路径和请求的协议和版本。
Host: time.geekbang.org // Request Header

field1=aaa&code=x%3D1 // Body
```

- response

```

HTTP/1.1 301 Moved Permanently // 第一行被称作 Status Line，它也分为三个部分，协议和版本、状态码和状态文本。
// Response Header
Date: Fri, 25 Jan 2019 13:28:12 GMT
Content-Type: text/html
Content-Length: 182
Connection: keep-alive
Location: https://time.geekbang.org/
Strict-Transport-Security: max-age=15768000

// Body
26
<html>
<head><title>301 Moved Permanently</title></head>
<body bgcolor="white">
<center><h1>301 Moved Permanently</h1></center>
<hr><center>openresty</center>
</body>
</html>
0
```