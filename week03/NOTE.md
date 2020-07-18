# week03 学习笔记

## 表达式运算符(优先级降序)

### Member
- a.b
- a[b]
- foo\`string`
- super.b
- super['b']
- new.target
- new Foo()
例如：new a()(), new a() 优先级更高

### New
- new Foo 
例如：new new a(), new a() 优先级更高

### Call
- foo()
- super()
- foo()['b']
- foo().b
- foo()\`abc` 
例如：new a()['b'], new a() 优先级更高
    
### Left Handside
- a.b = c

### Right Handside
- Update
    - c = a + b
    - a ++ 
    - a --
    - -- a
    - ++ a
    
### Unary
- delete a.b
- typeof a 
- +a -a !a
- await a

### Exponental（乘方）
- **

### Multiplicative & Additive && Shift && Relationship(< > <= >= instanceof in)

### Equality
### Bitwise( & ^ | )

### Logical( && || )
### Conditional( ?: )

## 类型转换

1. 拆箱转换
Object转基本类型
    - 首先查找是否有显式指定[Symbol.toPrimitive]
    - object * 2, 先valueOf再toString
    - String(object), 先toString再valueOf
    - 拆箱转换失败抛出TypeError

1. 装箱转换
    - 基本类型转Object

## 语句

### Completion Record （语句完成状态的记录）
[[type]] normal,break,continue,return,throw
[[value]] 基本类型（返回值）
[[label]] label（语句前加标识符）

```Javascript
// label 用例
var i, j;

loop1:
for (i = 0; i < 3; i++) {      //The first for statement is labeled "loop1"
   loop2:
   for (j = 0; j < 3; j++) {   //The second for statement is labeled "loop2"
      if (i === 1 && j === 1) {
         continue loop1;
      }
      console.log('i = ' + i + ', j = ' + j);
   }
}

// Output is:
//   "i = 0, j = 0"
//   "i = 0, j = 1"
//   "i = 0, j = 2"
//   "i = 1, j = 0"
//   "i = 2, j = 0"
//   "i = 2, j = 1"
//   "i = 2, j = 2"
// Notice how it skips both "i = 1, j = 1" and "i = 1, j = 2"
```

### 简单语句
Expression
Empty
Debugger
Throw
Continue
Break
Return

### 复合语句
Block
- [[type]] normal
- [[value]] --
- [[label]] --

With

If

Switch
Iteration
Labelled
Continue
Break
- [[type]] break continue
- [[value]] --
- [[label]] label

Try
- [[type]] return
- [[value]] --
- [[label]] label

## 声明
Function
Generator
AsyncFunction
AsyncGenerator
Variable
Class
Lexical (let const)

### 声明前可使用
function
function *
async function
async function *
var
 
### 声明后使用

class
let
const 

### 预处理

```Javascript
var a = 2;
void function() {
    a = 1;
    return;
    var a;
}()
console.log(a); // 2

var a = 2;
void function() {
    a = 1;
    return;
    const a;
}()
console.log(a); // Uncaught SyntaxError: Missing initializer in const declaration
```

### 作用域
```Javascript
var a = 2;
void function() {
    a = 1;
    {
        var a;  // 作用在整个函数体
    }
}()
console.log(a); // 2

var a = 2;
void function() {
    a = 1;
    {
        const a;  // 作用在外层block语句
    }
}()
console.log(a); // Uncaught SyntaxError: Missing initializer in const declaration
```

## 结构化

### 宏任务 微任务

- 宿主发起的任务称为宏观任务（如setTimeout），把 JavaScript 引擎发起的任务称为微观任务(如Promise)。
- 在宏观任务中，JavaScript 如 Promise 会产生异步代码，JavaScript 必须保证这些异步代码在一个宏观任务中完成，因此，每个宏观任务中又包含了一个微观任务队列
- 微任务总会在下一个宏任务之前执行，在本身所属的宏任务结束后立即执行
``` Javascript

    setTimeout(()=>console.log("d"), 0) // 入宏任务队列
    var r = new Promise(function(resolve, reject){
        resolve()
    });
    r.then(() => { 
        var begin = Date.now();
        while(Date.now() - begin < 1000);
        console.log("c1") // 入微任务队列
        new Promise(function(resolve, reject){
            resolve()
        }).then(() => console.log("c2")) // 入微任务队列
    });
    
    // 1. 按代码执行顺序，setTimeout的回调函数 `()=>console.log("d")` 入宏任务队列
    // 2. Promise r 的回调函数`r.then(() => {... console.log("c1") ... })`入微任务队列
    // 3. Promise r 中创建的匿名Promise的回调函数`() => console.log("c2")` 入微任务队列
    // 4.代码片段执行完毕，微任务出栈，log顺序为: c1->c2
    // 5.微任务队列为空，宏任务出栈，最后log: d
```

### 闭包

- 每一个函数都是包含一个闭包
- 闭包包含代码部分和环境部分

```Javascript
var y = 2;
function foo() {
    console.log(y)
}
export foo;

// Environment Record: y: 2
// Code: console.log(y);
```

```Javascript
var y = 2;
function foo2() {
    var z = 3;
    return () => {
        console.log(y, z, this) 
    }
}

var foo3 = foo2()
export foo3;

// Environment Record: 
// 1, z: 3, this: global (箭头函数保存父级this)
// 2, y: 2
// Code: console.log(y, z, this);
```