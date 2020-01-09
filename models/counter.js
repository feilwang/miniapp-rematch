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
      my.showLoading();
      await new Promise(resolve => setTimeout(resolve, 1000));
      dispatch.counter.increment(payload);
      my.hideLoading();
    }
  })
};
export default counter;
