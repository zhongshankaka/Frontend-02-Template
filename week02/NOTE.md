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

# JS 类型

## Atom
- Grammar(字面值）
Literal
Variable
Keywords
Whitespace
Line Terminator(行终止符)

- Runtime(运行时)
Context
Types
    - Number
    - String
    - Boolean
    - Object
    - Null
    - Undefined
    - Symbol

## Number

IEEE 754 double float （双精度）
64位bit
- Sign (1)： 符号位（正负）
- Exponent(11) 指数位 （范围）
- Fraction(52) 精度位 （精度）

```
公式：V = (-1)^S * x^(E-1023) * (M+1)

如10进制的4.5转换成2进制：
// 1.转成二进制
100.1
// 2.转成二进制科学计数
1.001*2^2
// 则
S = 0
E = 2 + 1023 = 2015
M = 001 // 整数1未隐藏位
```

### 语法：
- decimalLiteral
0
0.
.2
1e3
- binaryIntegerLiteral
0b111
- OctalIntegerLiteral
0o10
- HexIntegerLiteral
0xFF


## String

### 字符集
ASCII: 127个常用字符，英文
Unicode：基于两个字节的编码：0000-FFFF，汇集了全世界的各种字符的编码方式
UCS
GB
- GB2312
- GBK(GB13000)
- GB18030

ISO-8859
BIG5

### Encoding
UTF-8: 默认使用1个字节， 八位二进制数表示一个字符。
UTF-16: 默认使用两个字节， 两个八位二进制数表示一个字符

### 语法：

"abc"
'abc'
\`abc`

## Null & Undefined
null 有值，为空，关键字
undefined 未定义，全局变量（可用 void 0 代替）

## Object
- 状态
- 定义
- 行为

### Class
- 分类（单继承，有基类）
- 归类（多继承）

### Prototype
- 属于分类思想
- 原型不试图做严谨的分类， 而是采用相似的方法去描述一个对象，任何对象只需要描述自己与原型的区别即可

##### 对象设计，遵循行为改变状态的原则
```
// 狗咬人设计
Class 动物 {
  constructor(options) {
    this.名字 = options.名字
  }
}

Class 人 extends 动物 {
  constructor(options) {
     super(options);
     this.血量 = options.血量 || 100
     this.受伤程度 = options.受伤程度 || {
       '狗咬': 30
     }
     
  }

  被外界影响(外界影响) {
    if (外界影响 === '狗咬') {
      this.受伤害(外界影响)
    }
  }

  受伤害(伤害类型) {
    if (伤害类型 === '狗咬') {
      this.血量 = this.血量 - this.受伤程度[伤害类型]
    }
  }
}

Class 狗 extends 动物 {
  constructor(options) {
     super(options);
  }

  咬(对象) {
    对象.被外界影响('狗咬')
  }

}

const 一只狗 = new 狗('一只狗')
const 一个人 = new 人('一个人')

一只狗.咬(一个人)
```

## Javascript 中的对象

两个要素

- property
- prototype

### 属性

- 数据属性
[[value]]
writable
enumerable
configurable
- 访问器属性
get
set
enumerable
configurable

### 原型链
- 当访问属性的时候，如果当前对象没有，则沿着原型的对象找原型的对象， 而原型的原型上的原型还是可能存在原型
- 顶级之下的原型只需要描述与原型链上的区别即可

- API & Grammar
    提供基本对象机制:
    {}, [], Object.defineProperty
    基于原型:
    Object.create
    setPrototypeOf
    getPrototypeOf
    基于分类的方式去描述对象:
    new/class/extends 
    历史包袱，模拟类:
    new/function/prototype
