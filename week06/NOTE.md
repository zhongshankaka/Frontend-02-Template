# week06 学习笔记

## 思考题
为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

first-letter 宽度固定，可设置float。
first-line 宽度不固定，且已占据整行行宽。
 
## at-rules

- @charset : https://www.w3.org/TR/css-syntax-3/
- @import :https://www.w3.org/TR/css-cascade-4/
- @media :https://www.w3.org/TR/css3-conditional/


- @page : https://www.w3.org/TR/css-page-3/
- @counter-style :https://www.w3.org/TR/css-counter-styles-3
- @keyframes :https://www.w3.org/TR/css-animations-1/

    ```css
    定义动画序列
    
    @keyframes slidein {
      from {
        margin-left: 100%;
        width: 300%; 
      }
    
      to {
        margin-left: 0%;
        width: 100%;
      }
    }
    
    p {
      animation-duration: 3s;
      // 指定keyframes
      animation-name: slidein;
    }
    ```

    ### animation属性    
    animation-delay
    设置延时，即从元素加载完成之后到动画序列开始执行的这段时间。
    animation-direction = normal | reverse | alternate | alternate-reverse
    设置动画在每次运行完后是反向运行还是重新回到开始位置重复运行。
    animation-duration
    设置动画一个周期的时长。
    animation-iteration-count
    设置动画重复次数， 可以指定infinite无限次重复动画
    animation-name
    指定由@keyframes描述的关键帧名称。
    animation-play-state = running | paused
    允许暂停和恢复动画。
    animation-timing-function = linear | ease | ease-in ...
    设置动画速度， 即通过建立加速度曲线，设置动画在关键帧之间是如何变化。
    animation-fill-mode
        - none: delay and finished 都是元素默认状态
        - forwards: finished 为最后一帧状态
        - backwards: delay 为第一帧状态
        - both: delay 为第一帧状态，finished 为最后一帧状态
    指定动画执行前后如何为目标元素应用样式。

- @fontface :https://www.w3.org/TR/css-fonts-3/
    ```css
    // 本质是变量
    @font-face {
      font-family: BASE;
      src: local("HelveticaNeue-Light"), local("Helvetica Neue Light"),  local("PingFang SC"), local("Microsoft YaHei"), local(sans-serif);
    }
    .font {
      font-family: BASE;
    }
    ```
- @supports :https://www.w3.org/TR/css3-conditional/
- @namespace :https://www.w3.org/TR/css-namespaces-3/

## rule

- Selector https://www.w3.org/TR/selectors-3/ • https://www.w3.org/TR/selectors-4/
    1. selector_group
    2. selector
       - >
       - 空格
       - + 直接后继选择器
       - ~ 后继选择器
    3. simple_selector
       - type
       - *
       - . 
       - # 
       - : 链接/行为 
        :any-link 
        `代表一个有链接锚点的元素，而不管它是否被访问过，也就是说，它会匹配每一个有 href 属性的 <a>、<area> 或 <link> 元素。因此，它会匹配到所有的 :link 或 :visited`
        :link :visited 
        :hover
        :active
        :focus
        :target
        
        ```html
        代表一个唯一的页面元素(目标元素)，其id 与当前URL片段匹配
    
        如：http://www.example.com/index.html#section2
        若当前URL等于上面的URL，下面的元素可以通过 :target选择器被选中： 
        <style>
        :target {
          border: 2px solid black;
        }
        </style>
        <section id="section2">Example</section>
    
        

        <style>
        p:target {
          background-color: gold;
        }
        
        /* 在目标元素中增加一个伪元素*/
        p:target::before {
          font: 70% sans-serif;
          content: "►";
          color: limegreen;
          margin-right: .25em;
        }
        
        /*在目标元素中使用italic样式*/
        p:target i {
          color: red;
        }
        </style>
        <h3>Table of Contents</h3>
        <ol>
         <li><a href="#p1">Jump to the first paragraph!</a></li>
         <li><a href="#p2">Jump to the second paragraph!</a></li>
         <li><a href="#nowhere">This link goes nowhere,
           because the target doesn't exist.</a></li>
        </ol>
        
        <h3>My Fun Article</h3>
        <p id="p1">You can target <i>this paragraph</i> using a
          URL fragment. Click on the link above to try out!</p>
        <p id="p2">This is <i>another paragraph</i>, also accessible
          from the links above. Isn't that delightful?</p>
        ```
            
       - ::
        ::before
        ::after
        ::first-line 伪元素只能在块容器中
        ::first-letter
       - :not
       - [att=val]
       
    ### 选择器优先级
    ```html
    // 优先级匹配
    // 优先级高的先比较，匹配较高优先级的规则
    // 如下当有id = #id 的元素同时被下面两条规则匹配，则优先匹配到第二条，因为class优先级比tag高
    // 1.div div #id
    // [0,    1, 0,    2]
    // 2.div .cls #id
    // [0,    1, 1,    1]
    // inline id class tag
    S1 = 0 * N^3+ 1 * N^2+ 0 * N^1+ 2
    S2 = 0 * N^3+ 1 * N^2+ 1 * N^1+ 1
    取 N = 1000000
    S1 = 1000000000002
    S2 = 1000001000001
    S2 > S1
    ```
- Key
    - Properties
    - Variables: https://www.w3.org/TR/css-variables/
    
        ```css
        :root {
          --primary-color: red;
          --logo-text: var(--primary-color);
        }
        .logo {
          color: var(--logo-text);
        }
        ```
    
- Value https://www.w3.org/TR/css-values-4/
