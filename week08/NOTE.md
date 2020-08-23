学习笔记

## DOM
主要分为四个系列：

- traversal系列，访问DOM树节点的自动迭代工具（废弃）
- 节点api
    - Element
    - 导航类操作 针对Node，常用针对Element。根据元素的父子关系和临近关系在DOM树上自由移动查找元素。
    
    ```
    Node
    • parentNode 
    • childNodes 
    • firstChild
    • lastChild
    • nextSibling
    • previousSibling
    Element
    • parentElement
    • children
    • firstElementChild
    • lastElementChild
    • nextElementSibling
    • previousElementSibling
    ```
    
    - 修改操作，最小化API的原则。appendChild，insertBefore、removeChild、replaceChild
- 高级API
    - compareDocumentPosition 是一个用于比较两个节点中关系的函数。
    - contains 检查一个节点是否包含另一个节点的函数
    - isEqualNode 检查两个节点是否完全相同。
    - isSameNode 检查两个节点是否是同一个节点，实际上在
JavaScript 中可以用“===”。
    - cloneNode 复制一个节点，如果传入参数 true，则会连同子元素 做深拷贝。
    - cloneNode，复制，可以指定深拷贝。

- 事件api(事件先从外到内捕获后从内到外冒泡；在目标阶段上按照注册先后调用，不区分先捕获后冒泡，也就是说既注册了冒泡事件，也注册了捕获事件，则按照注册顺序执行。)
    - addEventListener api
    参数：
        - type
        - listener
        - option
            1. true / false
            2. passive / once / capture 
            
            - capture : 控制冒泡模式 还是 捕获模式
            - once : 表示这个事件不是只响应一次
            - passive : 表示这个事件是否是一个不会产生副作用的事件（例如： onScroll这类高频次的事件我们传入passive参数往往可以达到提升性能的作用）
