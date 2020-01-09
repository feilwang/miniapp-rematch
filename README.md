
# 小程序的状态管理工具示例

## 介绍

针对原生小程序的状态管理工具，之所以叫rematch只是因为用法和rematch一样。
`libs/rematch`中为本项目核心代码，以rematch语法风格管理小程序状态

## 用法


### 定义models

models/counter.js
```javascript
const counter = {
  state: {
    count: 0
  },
  //处理直接修改state的事件
  reducers: {
    increment: (state, payload) => {
      return Object.assign(state, { count: state.count + payload });
    },
  },
  //处理事件
  effects: (dispatch) => ({
    async incrementAsync(payload, rootState) {
      console.log('rootState', rootState);
      my.showLoading();
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch.counter.increment(payload);
      my.hideLoading();
    }
  })
};
export default counter;
```

### 生成store

store/index.js
```javascript
import { createStore } from '../libs/rematch';
import counter from '../models/counter';

const store = createStore({
  models: {
    counter
  }
});
export default store;

```

### app.js

```
  const { Provider } = require("wechat-rematch")
  const store = require('./store')
  App(
    Provider(store)({
      onLaunch: function () {
      }
    })
  )
```

### Page

```javascript
import { connect } from "../../libs/rematch";

//将count注入页面的data
function mapStateToData(state) {
  return {
    count: state.counter.count
  };
}

Page(connect(mapStateToData)({
  data: {},
  onLoad: function () {
  },
  add: function () {
    this.dispatch.counter.increment(1);
  },
  addAsync: function () {
    this.dispatch.counter.incrementAsync(1);
  }
}));

```

### Component

```javascript
import { connect } from "../../libs/rematch";

//将count注入组件的data
function mapStateToData(state) {
  return {
    count: state.counter.count
  };
}

Component(connect(mapStateToData)({
  mixins: [],
  data: {},
  props: {},
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    add(){
      this.dispatch.counter.increment(1)
    },
    addAsync(){
      this.dispatch.counter.incrementAsync(1)
    }
  },
}));

```

### 原理

主要提供Provider,connect,createStore三个方法。

#### Provider

provider用来改造app.js，它只做了一件事，就是给app增加一个store属性，好让所有页面可以通过`getApp().store`来访问到store。

#### connect

connect做三件事

* 将mapStateToData方法返回的数据绑定到page或者component上，当这些数据发生改变时，connect内部调用小程序原生的setDate去促使页面重渲染，因为小程序的setData是线程间的通信，官方文档介绍是尽量不要给setData传递大量数据，所以在connect内部还做了前后数据diff的比较，保证每次触发setData的数据是最小必须数据。

* 当页面或组件不在当前视口中时注销事件监听，避免不必要的setData;当页面或组件回到视口时发起一次setData以保证他们渲染正确的数据

* 将store.dispatch绑定到page或者component上，这样就可以在内部使用`this.dispatch.XXmodel.xxReducer`去触发action


#### createStore

createStore主要完成三件事

* 解析所有注册的models，收集他们的state,挂载到rootState上

* 遍历models的reducers和effects方法，给这些方法传递state作为参数，并注入setData方法

* 将reducers和effects方法全部绑定到store.dispatch上。
