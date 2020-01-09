import deepClone from 'deep-clone';
import diff from 'object-diff';

const defaultMapStateToData = () => ({});
const setData = (_this, data) => {
  if (Object.keys(data).length) {
    _this.setData(data);
  }
};

function connect(mapStateToData = defaultMapStateToData) {
  const store = getApp().store;
  return function (pageConfig) {
    if (!pageConfig.data) {
      pageConfig.data = {};
    }
    // 页面生命周期覆盖
    const _onShow = pageConfig.onShow;
    const _onHide = pageConfig.onHide;

    function onShow(options) {
      // 只能通过onShow来获取真正的this
      pageConfig.triggerChange = (data) => {
        setData(this, data);

      };
      // 每次页面显示就setData
      const data = mapStateToData(store.getState());
      // 获取有区别的数据，防止setData数据量过大
      const diffData = diff(this.data, data);
      setData(this, diffData);
      _onShow && _onShow.call(this, options);
    }

    function onHide() {
      delete pageConfig.triggerChange;
      _onHide && _onHide.call(this);
    }

    Object.assign(pageConfig, { onShow, onHide });

    // 组件生命周期覆盖
    const _didMount = pageConfig.didMount;
    const _didUnmount = pageConfig.didUnmount;

    function didMount(options) {
      pageConfig.triggerChange = (data) => {
        setData(this, data);

      };
      const data = mapStateToData(store.getState());
      const diffData = diff(this.data, data);
      setData(this, diffData);
      _didMount && _didMount.call(this, options);
    }

    function didUnmount() {
      delete pageConfig.triggerChange;
      _didUnmount && _didUnmount.call(this);
    }

    Object.assign(pageConfig, { didMount, didUnmount });


    const data = deepClone(mapStateToData(store.getState()));
    store.views.push({ view: pageConfig, mapStateToData });
    Object.assign(pageConfig.data, data);
    pageConfig.dispatch = store.dispatch;
    if (pageConfig.methods) {
      pageConfig.methods.dispatch = store.dispatch;
    }
    return pageConfig;
  };
}

export default connect;
