#  前端面试总结
在经历了春招、秋招二十余家企业面试过程中，本人总结了一系列前端面试经验。目前为止收获了网易、京东、滴滴、小米、华为、搜狗、58、商汤、宜信等公司offer.（没有bat是最大的遗憾）
现将面试经验总结如下，仅供大家参考。
前端面试知识点主要包括以下部分
- [js](#js)
- [css](#css)
- [框架（vue\react\angular）](#vue)
- [网络、安全](#net)
- [算法](#algrithm)
- [其他](#others)

## js基础知识<div id="js"></div>

### 闭包
由于在JS中，变量的作用域属于函数作用域，在函数执行后作用域就会被清理、内存也随之回收，但是由于闭包是建立在一个函数内部的子函数，由于其可访问上级作用域的原因，即使上级函数执行完，作用域也不会随之销毁，这时的子函数——也就是闭包，便拥有了访问上级作用域中的变量的权限，即使上级函数执行完后作用域内的值也不会被销毁。闭包随处可见，一个Ajax请求的成功回调，一个事件绑定的回调方法，一个setTimeout的延时回调，或者一个函数内部返回另一个匿名函数，这些都是闭包。简而言之，无论使用何种方式对函数类型的值进行传递，当函数在别处被调用时都有闭包的身影。
在函数内部定义了其他函数时，就创建了闭包。闭包有权访问包含他的函数内部的所有变量。原理如下：

#### 闭包的作用
可以用于变量缓存、计数，模仿块级作用域(function(){})()、对象中创建私有变量等

#### 闭包的缺点及如何避免
占用大量内存
如何避免闭包：let 或者 将返回的闭包函数置为null

### 垃圾回收机制
- 参考链接：https://blog.csdn.net/oliver_web/article/details/53957021 
- 清除时机： 一定周期内定时清除
- 回收机制：
- 标记清除（主流方法，离开某个执行环境进行标记）
当变量进入执行环境是，就标记这个变量为“进入环境”。从逻辑上讲，永远不能释放进入环境的变量所占用的内存，因为只要执行流进入相应的环境，就可能会用到他们。当变量离开环境时(函数结束后)，则将其标记为“离开环境”。垃圾收集器在运行的时候会给存储在内存中的所有变量都加上标记。然后，它会去掉环境中的变量以及被环境中的变量引用的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后。垃圾收集器完成内存清除工作，销毁那些带标记的值，并回收他们所占用的内存空间。
- 引用计数(存在循环引用的问题)
这种方式常常会引起内存泄漏，低版本的IE使用这种方式。机制就是跟踪一个值的引用次数，当声明一个变量并将一个引用类型赋值给该变量时该值引用次数加1，当这个变量指向其他一个时该值的引用次数便减一。当该值引用次数为0时就会被回收。
该方式会引起内存泄漏的原因是它不能解决循环引用的问题：
(```)
function sample(){
    var a={};
    var b={};
    a.prop = b;
    b.prop = a;
}
(```)
这种情况下每次调用sample()函数，a和b的引用计数都是2，会使这部分内存永远不会被释放，即内存泄漏。
此类问题经常存在于js对象和dom对象之间，例如dom对象的事件绑定等等
解决：手工断开js对象和DOM之间的链接

### 事件流模型
- 事件冒泡 从下至上
- 事件捕获 从上至下
- dom2级事件 规定的事件流包括三个阶段 事件捕获、处于目标阶段、事件冒泡
- IE只支持事件冒泡
#### 事件处理程序

- DOM0级事件处理程序,被认为是元素的方法
(```)
var btn = document.getElementById(“mybt”); 
btn.onclick = function(){
alert(this.id) //this为btn
}
(```)
（只会在事件冒泡中运行）

- DOM2级事件处理程序addEventListener() removeEventListener()
(```)
var btn = document.getElementById(“mybt”);
btn.addEventListener(“click”,function(){
  alert(this.id)
},false);
(```)
false是冒泡 true是捕获 所有的事件都可以冒泡么    答：不是，blur focus change不可冒泡

- IE事件处理程序 attachEvent(),detachEvent()
(```)
var btn = document.getElementById(“mybt”);
btn. attachEvent (“onclick”,function(){
  alert(this)//window
});
(```)
只支持冒泡

#### dom2事件模型与IE事件模型的区别
- 阻止事件传播：stopPropagation() VS IE cancelBubble=true;
- 阻止默认行为：e.preventDefault VS　IE event.returnValue = false;
- 事件来源： e.target VS　IE e.srcElement

#### 事件委托:
在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能。导致这一问题的原因是多方面的。首先，每个函数都是对象，都会占用内存；内存中的对象越多，性能就越差。其次，必须事先指定所有事件处理程序而导致的DOM访问次数，会延迟整个页面的交互就绪时间。
对“事件处理程序过多”问题的解决方案就是事件委托。事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。例如，click事件会一直冒泡到document层次。也就是说，我们可以为整个页面指定一个onclick事件处理程序，而不必给每个可单击的元素分别添加事件处理程序。
事件委托还有一个好处就是添加进来的元素也能绑定事件

### 判断一个网页是从微信打开还是支付宝打开
userAgent 判断window.navigator.userAgent是否包含alipay/micromessage字符串

### 怎么判断是不是数组    
答：a instanceof Array  Array.isArray(a) 还有 Object.prototype.toString.call() === '[object Array]'

## css基础知识<div id="css"></div>
## 框架（vue/react/angular）<div id="vue"></div>
## 网络、安全方向<div id="net"></div>
## 简单算法<div id="algrithm"></div>
## 其他（linux,数据库，后端语言等）<div id="others"></div>

