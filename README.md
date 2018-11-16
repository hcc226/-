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
```
function sample(){
    var a={};
    var b={};
    a.prop = b;
    b.prop = a;
}
```
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
```
var btn = document.getElementById(“mybt”); 
btn.onclick = function(){
alert(this.id) //this为btn
}
```
（只会在事件冒泡中运行）

- DOM2级事件处理程序addEventListener() removeEventListener()
```
var btn = document.getElementById(“mybt”);
btn.addEventListener(“click”,function(){
  alert(this.id)
},false);
```
false是冒泡 true是捕获 所有的事件都可以冒泡么    答：不是，blur focus change不可冒泡

- IE事件处理程序 attachEvent(),detachEvent()
```
var btn = document.getElementById(“mybt”);
btn. attachEvent (“onclick”,function(){
  alert(this)//window
});
```
只支持冒泡

#### dom2事件模型与IE事件模型的区别
- 阻止事件传播：stopPropagation() VS IE cancelBubble=true;
- 阻止默认行为：e.preventDefault VS　IE event.returnValue = false;
- 事件来源： e.target VS　IE e.srcElement

#### 事件委托:
在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能。导致这一问题的原因是多方面的。首先，每个函数都是对象，都会占用内存；内存中的对象越多，性能就越差。其次，必须事先指定所有事件处理程序而导致的DOM访问次数，会延迟整个页面的交互就绪时间。
对“事件处理程序过多”问题的解决方案就是事件委托。事件委托利用了事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。例如，click事件会一直冒泡到document层次。也就是说，我们可以为整个页面指定一个onclick事件处理程序，而不必给每个可单击的元素分别添加事件处理程序。
事件委托还有一个好处就是添加进来的元素也能绑定事件

### 跨域的方法

同源策略（Same origin policy）是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，则浏览器的正常功能可能都会受到影响。可以说Web是构建在同源策略基础之上的，浏览器只是针对同源策略的一种实现。
何谓同源：如果两个URL的域名、协议、端口相同，则表示他们同源。

#### jsonp 
使用script标签不受跨域限制，但只适合get请求
```
     <script type="text/javascript">
    // 得到航班信息查询结果后的回调函数
    var flightHandler = function(data){
        alert('你查询的航班结果是：票价 ' + data.price + ' 元，' + '余票 ' + data.tickets + ' 张。');
    };
    // 提供jsonp服务的url地址（不管是什么类型的地址，最终生成的返回值都是一段javascript代码）
    var url = "http://flightQuery.com/jsonp/flightResult.aspx?code=CA1998&callback=flightHandler";
    // 创建script标签，设置其属性
    var script = document.createElement('script');
    script.setAttribute('src', url);
    // 把script标签加入head，此时调用开始
    document.getElementsByTagName('head')[0].appendChild(script); 
    </script>
```
#### CORS（cross-origin resource sharing）

跨源资源共享 使用自定义的HTTP头部让浏览器与服务器沟通，从而决定请求是否成功。
附加一个origin头部，Origin：http://www.nczonline.ne
服务器认为可以接受，就在Access-Control-Allow-Origin头部中回发相同的源信息
Access-Control-Allow-Origin：http://www.nczonline.ne
以上两种造成了不安全，即不安全随便就可以访问
解决方案：生成一个tokon

#### postMessage h5的方法
在jsonp1域名下面获取jsonp2中localStorage的test字段的值，尝试着用postMessage来实现，具体的实现方式如下：
jsonp1.com下面的index.htm如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <div id="test"></div>
    <textarea id="textarea"></textarea>
    <iframe style="width:0px;height:0px" id="f" src="http://www.jsonp2.com/demo.html"></iframe>
    <script type="text/javascript" src="http://cdn.bootcss.com/jquery/3.1.1/jquery.js"></script>
    <script>
        var test1='';
        onmessage=function(e){
          e=e||event;
          // console.log(e);
          // console.log(e.data);
          test1=e.data;
          if(test1=="123"){
              alert("success!");
          }else{
              alert("error");
          }
         $("#test").html("<span style='color:red'>"+test1+"</span>");
        };
    </script>
</body>
</html>
```
jsonp2.com中的demo.html内容：
```
<iframe id="f" src="http://www.jsonp1.com/index.html"></iframe>
<script>
var f=document.getElementById("f");
f.onload=function(){
    window.localStorage.setItem("test","123");
    var value=window.localStorage.getItem("test");
    window.localStorage.clear();
  f.contentWindow.postMessage(value,"http://www.jsonp1.com");
}
</script>
```
#### document.domain 
document.domain的作用是用来获取/设置当前文档的原始域部分 a.gihub.oi,b.github.io若两个源所用协议、端口一致，主域相同而二级域名不同的话，可以借鉴该方法解决跨域请求。
// 在 a.huhu.com 所指的文件下边建立 test.html 代码如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>html</title>
    <script type="text/javascript" src = "jquery-1.12.1.js"></script>
</head>
<body>
    <div>A页面</div>
    <iframe style = "display : none" name = "iframe1" id = "iframe" src="http://huhu.com/1.html" frameborder="0"></iframe>
    <script type="text/javascript">
        $(function(){
            try{
                document.domain = "huhu.com"
            }catch(e){}
            $("#iframe").load(function(){
                var jq = document.getElementById('iframe').contentWindow.$
                jq.get("http://huhu.com/test.json",function(data){
                    console.log(data);
                });
            })
        })
    </script>
</body>
</html>
````
备注：利用 iframe 加载 其他域下的文件（huhu.com/1.html）, 同时 document.domain 设置成 huhu.com ，当 iframe 加载完毕后就可以获取 huhu.com 域下的全局对象，此时尝试着去请求 huhu.com 域名下的 test.json （此时可以请求接口），就会发现数据请求失败了~~ 纳尼！！！！！！！
数据请求失败，目的没有达到，自然是还少一步：
huhu.com 对应的文件夹下边1.html 里边代码为：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>html</title>
    <script type="text/javascript" src = "jquery-1.12.1.js"></script>
    <script type="text/javascript">
        $(function(){
            try{
                document.domain = "huhu.com"
            }catch(e){}
        })
    </script>
</head>
<body>
    <div id = "div1">B页面</div>
</body>
</html>
```
### 原型、原型链
原型是构造函数具有的属性，原型链是变量具有的属性，通过构造函数new出来的实例对象的原型链（__proto__）指向构造函数的原型(prototype)
![proto](/img/proto.png "prototype")
```
console.log(Sup.prototype.__proto__ === Object.prototype)//true
console.log(Sup.prototype.__proto__.__proto__)//null
//constructor，每个原型都有一个 constructor 属性指向关联的构造函数。为了验证这一点，我们可以尝试：
function Person() {
}
console.log(Person === Person.prototype.constructor)
constructor
//首先是 constructor 属性，我们看个例子：
function Person() {
}
var person = new Person();
console.log(person.constructor === Person); // true
//当获取 person.constructor 时，其实 person 中并没有 constructor 属性,当不能读取到constructor 属性时，会从 person 的原型也就是 //Person.prototype 中读取，正好原型中有该属性，所以：
person.constructor === Person.prototype.constructor
//函数的继承 B.prototype = new A();
```
```
function Sup() {}
console.log(Sup.prototype.__proto__===Object.prototype) // true  原型对象就是通过 Object 构造函数生成的，结合之前所讲，实例的 __proto__ 指向构造函数(Object)的 prototype
console.log(Sup.prototype.__proto__.__proto__)//null
function Sub() {}
Sub.prototype = new Sup()
let s = new Sub()
console.log(s.constructor === Sub.prototype.constructor)//true
console.log(s.constructor === Sup.prototype.constructor)//true
console.log(s.__proto__===Sub.prototype) // true
console.log(s.__proto__.__proto__ === Sup.prototype) // true
console.log(s.__proto__.__proto__.__proto__===Object.prototype)//true
console.log(Sub.prototype)// Sup{}
console.log(Sub.prototype.prototype)//undefined
```

### 几种继承方式
#### 简单原型链

这是实现继承最简单的方式了，核心在于用父类实例作为子类原型对象。优点是简单，缺点在于二 - 创建子类实例时，无法向父类构造函数传参；由于来自原型对象的引用属性是所有实例共享的，所以修改原型对象上的属性会在所有子类实例中体现出来；
```
function Super(){
    this.val = 1;
}
function Sub(){
    // ...
}
Sub.prototype = new Super()
let sub1 = new Sub();
```
#### 借用构造函数

借父类的构造函数来增强子类实例，等于是把父类的实例属性复制了一份给子类实例装上了（完全没有用到原型）;缺点在于无法实现函数复用，每个子类实例都持有一个新的 fun 函数，太多了就会影响性能；
```
function Super(val){
    this.val = val;
    this.fun = function(){
        // ...
    }
}
function Sub(val){
    Super.call(this, val);   // 核心
}
let sub1 = new Sub(1);
```
#### 组合继承（最常用）

把实例函数都放在原型对象上，以实现函数复用。同时还要保留借用构造函数方式的优点；子类原型上有一份多余的父类实例属性，因为父类构造函数被调用了两次，生成了两份，而子类实例上的那一份屏蔽了子类原型上的定义，属于内存浪费；
```
function Super(){
    // 只在此处声明基本属性和引用属性
    this.val = 1;
}
//  在此处声明函数
Super.prototype.fun1 = function(){};
function Sub(){
    Super.call(this);   // 核心
    // ...
}
Sub.prototype = new Super();    // 核心
let sub1 = new Sub(1);
```
#### 原型式继承

从已有的对象中衍生出新对象，不需要创建自定义类型；但原型引用属性会被所有实例共享，因为用整个父类对象来充当子类原型对象；无法实现代码复用；
```
function beget(obj){   // 生孩子函数 beget
    let F = function(){};
    F.prototype = obj;
    return new F();
}
function Super(){
    this.val = 1;
    this.arr = [1];
}

// 拿到父类对象
let sup = new Super();
// 生孩子
let sub = beget(sup);
```
#### 寄生式继承

寄生式继承的思路和寄生构造函数和工厂模式相似，即创建一个仅用于封装继承过程的函数，该函数在内部以某种形式来增强对象，最后像真的是它做了所有工作一样返回对象；但是这种形式依然不能复用函数；
```
function beget(obj){   // 生孩子函数
    let F = function(){};
    F.prototype = obj;
    return new F();
}
function Super(){
    this.val = 1;
    this.arr = [1];
}
function getSubObject(obj){
    // 创建新对象
    let clone = beget(obj); // 核心
    // 增强
    clone.attr1 = 1;
    clone.attr2 = 2;

    return clone;
}

var sub = getSubObject(new Super());
```
#### 寄生组合继承（最佳方式）

用 beget(Super.prototype) 切掉了原型对象上多余的那份父类实例属性；
```
function beget(obj){   // 生孩子函数 beget
    let F = function(){};
    F.prototype = obj;
    return new F();
}
function Super(){
    // 只在此处声明基本属性和引用属性
    this.val = 1;
    this.arr = [1];
}
//  在此处声明函数
Super.prototype.fun1 = function(){};
Super.prototype.fun2 = function(){};

function Sub(){
    Super.call(this);   // 核心
    // ...
}
let proto = beget(Super.prototype); // 核心
proto.constructor = Sub;            // 核心
Sub.prototype = proto;              // 核心

let sub = new Sub();
```
### 图片懒加载（延迟加载）


DOM 结构 由一个父容器div#lazy-img，里面是图片标签，父容器是可以滚动的，图片有固定高度。大家可以看到，容器内的img元素没有 src 属性，而有一个 data-src 属性。 这是不想让图片提前加载，所以把图片的链接储存到data-src 内。然后监听scroll事件 替换src
具体代码详见


### es6常问知识点
let 箭头函数 promise 字符串模板 class extend super import export generator async/await
### 判断一个网页是从微信打开还是支付宝打开
userAgent 判断window.navigator.userAgent是否包含alipay/micromessage字符串

### 怎么判断是不是数组    
答：a instanceof Array  Array.isArray(a) 还有 Object.prototype.toString.call() === '[object Array]'

## css基础知识<div id="css"></div>

### 关于浮动
#### 浮动的影响
- 父元素的高度无法被撑开，影响与父元素同级的元素
- 与浮动元素同级的非浮动元素会跟随其后
- 若非第一个元素浮动，则该元素之前的元素也需要浮动，否则会影响页面显示的结构

当容器的高度为auto，且容器的内容中有浮动（float为left或right）的元素，在这种情况下，容器的高度不能自动伸长以适应内容的高度，使得内容溢出到容器外面而影响（甚至破坏）布局的现象。这个现象叫浮动溢出，为了防止这个现象的出现而进行的CSS处理，就叫CSS清除浮动。
浮动虽然可以便于页面布局，但同时会产生一些问题，也就是我们常说的“副作用”。而一个元素设置了浮动（即 float 值为 left, right 或 inherit 并从父元素上继承 left 或 right 值）的常见缺陷是——影响它的兄弟元素的位置和父元素产生高度塌陷，下面对这两个问题展开说明。
- 一个元素设置了浮动后，会影响它的兄弟元素，具体的影响方式较为复杂，这要视乎这些兄弟元素是块级元素还是内联元素，若是块级元素会无视这个浮动的块框，也就是我们平时看到的效果——使到自身尽可能与这个浮动元素处于同一行，导致被浮动元素覆盖，除非这些 div 设置了宽度，并且父元素的宽度不足以包含它们，这样兄弟元素才会被强制换行；若是内联元素，则会尽可能围绕浮动元素。
- 另外，浮动的元素脱离了普通流，这样使得包含它的父元素并不会因为这个浮动元素的存在而自动撑高，这样就会造成高度塌陷。

#### 清除浮动的方法
- 父级div定义伪类：after和zoom
```
<style type="text/css"> 
   .div1{background:#000080;border:1px solid red;}
   .div2{background:#800080;border:1px solid red;height:100px;margin-top:10px}
   
   .left{float:left;width:20%;height:200px;background:#DDD}
   .right{float:right;width:30%;height:80px;background:#DDD}
   
   /*清除浮动代码*/
   .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
   .clearfloat{zoom:1}
   </style> 
<div class="div1 clearfloat"> 
<div class="left">Left</div> 
<div class="right">Right</div> 
</div>
<div class="div2">
   div2
   </div>
```
+ 原理：IE8以上和非IE浏览器才支持:after，原理和方法2有点类似，zoom(IE转有属性)可解决ie6,ie7浮动问题
+ 优点：浏览器支持好，不容易出现怪问题（目前：大型网站都有使用，如：腾迅，网易，新浪等等）
+ 缺点：代码多，不少初学者不理解原理，要两句代码结合使用，才能让主流浏览器都支持
+ 建议：推荐使用，建议定义公共类，以减少CSS代码
+ 评分：★★★★☆

- 在结尾处添加空div标签clear:both
```
<style type="text/css"> 
   .div1{background:#000080;border:1px solid red}
   .div2{background:#800080;border:1px solid red;height:100px;margin-top:10px}
   
   .left{float:left;width:20%;height:200px;background:#DDD}
   .right{float:right;width:30%;height:80px;background:#DDD}
   
   /*清除浮动代码*/
   .clearfloat{clear:both}
   </style> 
<div class="div1"> 
<div class="left">Left</div> 
<div class="right">Right</div>
<div class="clearfloat"></div>
</div>
<div class="div2">
   div2
   </div>
```
+ 原理：添加一个空div，利用css提高的clear:both清除浮动，让父级div能自动获取到高度
+ 优点：简单，代码少，浏览器支持好，不容易出现怪问题
+ 缺点：不少初学者不理解原理；如果页面浮动布局多，就要增加很多空div，让人感觉很不爽
+ 建议：不推荐使用，但此方法是以前主要使用的一种清除浮动方法
+ 评分：★★★☆☆
- 父级div定义overflow:hidden
```
<style type="text/css"> 
   .div1{background:#000080;border:1px solid red;/*解决代码*/width:98%;overflow:hidden}
   .div2{background:#800080;border:1px solid red;height:100px;margin-top:10px;width:98%}
   
   .left{float:left;width:20%;height:200px;background:#DDD}
   .right{float:right;width:30%;height:80px;background:#DDD}
   </style> 
<div class="div1"> 
<div class="left">Left</div> 
<div class="right">Right</div>
</div>
<div class="div2">
   div2
   </div>
```
+ 原理：必须定义width或zoom:1，同时不能定义height，使用overflow:hidden时，浏览器会自动检查浮动区域的高度
+ 优点：简单，代码少，浏览器支持好
+ 缺点：不能和position配合使用，因为超出的尺寸的会被隐藏
+ 建议：只推荐没有使用position或对overflow:hidden理解比较深的朋友使用
+ 评分：★★★☆☆ 

### 垂直水平居中 的几种解决方案
 
#### 方案1 元素已知宽度 
父元素设置为：position: relative; 
子元素设置为：position: absolute; 
距上50%，据左50%，然后减去元素自身宽度的距离就可以实现 
```
<div class="box">
    <div class="content">
    </div>
</div>
.box {
    background-color: #FF8C00;
    width: 300px;
    height: 300px;
    position: relative;
}
.content {
    background-color: #F00;
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -50px 0 0 -50px;
}
```
#### 方案2：元素未知宽度 
如果元素未知宽度，只需将上面例子中的margin: -50px 0 0 -50px;替换为：transform: translate(-50%,-50%); 
```
<div class="box">
    <div class="content">
    </div>
</div>
.box {
    background-color: #FF8C00;
    width: 300px;
    height: 300px;
    position: relative;
}
.content {
    background-color: #F00;
    width: 100px;
    height: 100px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
}
```
#### flex布局 
```
<div class="box">
    <div class="content">
    </div>
</div>

.box {
    background-color: #FF8C00;
    width: 300px;
    height: 300px;
    display: flex;//flex布局
    justify-content: center;//使子项目水平居中
    align-items: center;//使子项目垂直居中
}
.content {
 background-color: #F00;
    width: 100px;
    height: 100px;
}
```

### 盒模型

content + padding + border + mragin
两种和模型：
- 标准盒模型。指定的高度、宽度为content的高度和宽度
- IE盒模型。指定的高度、宽度为content+padding+border的高宽

css3中box-sizing属性可以指定盒模型的类型：border-box or content-box or inherit

### css画三角形
```
#triangle-up { 
width: 0; 
height: 0; 
border-left: 50px solid transparent; 
border-right: 50px solid transparent; 
border-bottom: 100px solid red; 
}
```
效果如图所示
![triangle up](/img/triangle_up.png "triangle up")
```
#triangle-topleft { 
width: 0; 
height: 0; 
border-top: 100px solid red; 
border-right: 100px solid transparent; 
}
```
效果如图所示
![triangle_topleft](/img/triangle_topleft.png "triangle topleft")

### css选择器
1. 通配符 *{}
    1. 元素选择器 div p
    1. class选择器 .class
    1. id选择器 #id 在页面只能出现一次
    1. 后代选择器.div .ul .li
    1. 多元素选择器 div, #box
    1. 子元素选择器（只是直接子代）ul>li
    1. 相邻兄弟选择器 div+.box金姐在div后面的同级元素.box
1. 属性选择器
    1. div[title] 具有title属性的div元素
    1. div[arr=val]属性值为val
    1. div[attr~=val]属性包含val这个词
    1. .div[attr|=val] 属性值以val开头
1. 伪类选择器 LVHA
    1. :link
    1. :hover
    1. :active
    1. :visited
    1. p:first-child 父元素第一个子元素是p的所有p元素
    1. nth-child(n)/only-child（必须为父级元素的唯一一个子元素）
    1. p:first-of-type父元素下的第一个p元素
    1. last-of-type/only-of-type(父元素下面只有一个p元素，其他不能是p)/nth-of-type(n)
1. 伪元素选择器
    1. ::before
    1. ::after
!important > 行内样式 （1000） >ID选择器（100） > 类选择器=伪类选择器（10） > 标签=伪元素（1） > 通配符 > 继承 > 浏览器默认属性 


## 框架（vue/react/angular）<div id="vue"></div>
## 网络、安全方向<div id="net"></div>
### https介绍
HTTPS 可以认为是 HTTP + SSL（传输层加密协议）。主要提供的功能：
- 内容加密。浏览器到百度服务器的内容都是以加密形式传输，中间者无法直接查看原始内容。
- 身份认证。保证用户访问的是百度服务，即使被 DNS 劫持到了第三方站点，也会提醒用户没有访问百度服务，有可能被劫持
- 数据完整性。防止内容被第三方冒充或者篡改。
#### https具体实现 与http的差别 
- https协议需要到CA申请证书，一般免费证书较少，需要一定费用
- http是超文本传输协议，协议是明文传输，https则是具有安全性的ssl加密传输协议
- http和https使用端口不一样 80 和443
#### 浏览器验证证书的过程
- server生成一个公钥和私钥，把公钥发送给第三方认证机构（CA）；
- CA把公钥进行MD5加密，生成数字签名；再把数字签名用CA的私钥进行加密，生成数字证书。CA会把这个数字证书返回给server；
server拿到数字证书之后，就把它传送给浏览器；
- 浏览器会对数字证书进行验证，首先，浏览器本身会内置CA的公钥，会用这个公钥对数字证书解密，验证是否是受信任的CA生成的数字证书；
验证成功后，浏览器会随机生成对称秘钥，用server的公钥加密这个对称秘钥，再把加密的对称秘钥传送给server；
- server收到对称秘钥，会用自己的私钥进行解密，之后，它们之间的通信就用这个对称秘钥进行加密，来维持通信。
![https pipline](/img/image.png "http pipeline")
- 客户端发起https请求
- 服务端配置。服务器必须要有一套数字证书
- 传输证书（公钥）给客户端，包含证书的颁发机构、过期时间等
- 客户端验证公钥是否有效。若有效则声称一个随机值，用证书对该随机值加密
- 传送加密后的随机值(私钥)至服务器
- 服务端解密信息。服务端用私钥解密后，得到客户端传来的随机值（私钥），然后把内同通过该值进行对称加密。
- 传输加密后的信息，可以在客户端被还原
- 客户端用之前声称的私钥解密服务端传过来的信息，获得解密后的内容

接下来，客户端和服务端进入加密通信阶段，该阶段的通信采用普通的 HTTP 协议，只不过双方都采用相同的会话密钥对会话内容进行对称加密和解密。
浏览器和服务器每次新建会话时都使用非对称密钥交换算法协商出对称密钥，使用这些对称密钥完成应用数据的加解密和验证，整个会话过程中的密钥只在内存中生成和保存，而且每个会话的对称密钥都不相同（除非会话复用），中间者无法窃取。

#### 缺点
- 速度慢 cpu消耗很大
- 加密内容长度有限制
#### 证书是如何工作的
- 证书是否是信任的有效证书。所谓信任：浏览器内置了信任的根证书，就是看看web服务器的证书是不是这些信任根发的或者信任根的二级证书机构颁发的。所谓有效，就是看看web服务器证书是否在有效期，是否被吊销了。
- 对方是不是上述证书的合法持有者。简单来说证明对方是否持有证书的对应私钥。验证方法两种，一种是对方签个名，我用证书验证签名；另外一种是用证书做个信封，看对方是否能解开。
- 以上的所有验证，除了验证证书是否吊销需要和CA关联，其他都可以自己完成。验证正式是否吊销可以采用黑名单方式或者OCSP方式。黑名单就是定期从CA下载一个名单列表，里面有吊销的证书序列号，自己在本地比对一下就行。优点是效率高。缺点是不实时。OCSP是实时连接CA去验证，优点是实时，缺点是效率不高。
具体的验证方式为：
- 浏览器从服务器拿到证书。证书上有服务器的公钥和CA机构打上的数字签名。
- 拿到证书后验证其数字签名。具体就是，根据证书上写的CA签发机构，在浏览器内置的根证书里找到对应的公钥，用此公钥解开数字签名，得到摘要（digest,证书内容的hash值），据此验证证书的合法性。

## 简单算法<div id="algrithm"></div>
## 其他（linux,数据库，后端语言等）<div id="others"></div>

