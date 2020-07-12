学习笔记

# 泛用语言分类方法
- 非形式语言
较为自由，没有严格的语法定义：如中文/英文
- 形式语言（乔姆斯基谱系）
	0型 无限制文法
	1型 上下文相关文法
	2型 上下文无关文法
	3型 正则文法
	
# 产生式（BNF）
- 用尖括号括起来的名称来表示语法结构名
- 语法结构分成基础结构和需要用其他语法结构定义的复合机构
	- 基础结构称终结符
	- 复合结构称非终结符
- 引号和中间的字符表示终结符
  - 可以有括号
  - * 表示重复多次
  - | 表示或
  - + 表示至少一次

BNF 规定是推导规则(产生式)的集合，写为：
```
<符号> ::= <使用符号的表达式>
```
这里的 <符号> 是非终结符，而表达式由一个符号序列，或用指示选择的竖杠 '|' 分隔的多个符号序列构成，每个符号序列整体都是左端的符号的一种可能的替代。从未在左端出现的符号叫做终结符。

例子：

```
<MO>::="*"|"/"
<AO>::="+"|"-"

<ME>::=<Number>|<ME><MO><Number>
<AE>::=<ME>|<AE><AO><ME>
<PE>::="("<AE>")"|"("<AE>")"<MO><Number>|"("<AE>")"<MO>"("<AE>")"|"("<AE>")"<MO><ME>

// 一个带括号的四则运算表达式是：
   - 一个加法表达式加上括号
   - 一个带括号的加法表达式乘以数字
   - 一个带括号的加法表达式乘以另一个带括号的加法表达式
   - 一个带括号的加法表示式乘以乘法表达式
```

# 语言分类

```
// 数据描述语言
const dataDescLang = ["XML", "JSON", "CSS", "SQL"]

// 编程语言
const programmingLang = ["Javascript", "Java", "C", "C++", "C#", "Go", "Lisp", "Python", "Clojure", "Haskell"]

// 声明式语言
const declarativeLang = ["Lisp", "Clojure", "Haskell", "XML", "CSS", "JSON", "SQL"]

// 命令式语言
const imperativeLang = ["Javascript", "Java", "C", "C++", "C#", "Go", "Python"]
```
# 编程语言的性质

图灵完备性（所有可计算的问题都可用来描述）

- 命令式-图灵机
1.goto
2.if 和 while
- 声明式
递归


动态
- 在用户的设备/在线服务器上运行
- 产品实际运行时
- Runtime

静态
- 在程序员的设备上
- 在产品开发阶段
- CompileTime

类型系统（ts）

- 动态类型，运行时存在的类型信息
- 静态类型，编写代码的类型信息，编译后不存在
- 强类型和弱类型（隐式转换）
- 复合类型
结构体： 例如go的struct
函数签名: 例如(T1, T2) => T3
- 子类型
- 泛型
逆变/协变
凡是能用Function\<Child>的地方， 都能用Function\<Parent>
凡是能用Array\<Parent>的地方， 都能用Array\<Child>

# 一般命令式编程语言的设计方式
- Atom
Identifier
Literal

- Expression
Atom
Operator
Punctuator
- Statement
Expression
Keyword
Punctuator

- Structure
Function
Class
Process
Namespace

- Program
Program
Module
Package
Library