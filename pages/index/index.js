import { connect } from "../../libs/rematch";

//将count注入页面的data
function mapStateToData(state) {
  return {
    count: state.counter.count
  };
}

Page(connect(mapStateToData)({
  data: {},
  onLoad() {
  },
  add() {
    this.dispatch.counter.increment(1);
  },
  addAsync() {
    this.dispatch.counter.incrementAsync(1);
  }
}));
