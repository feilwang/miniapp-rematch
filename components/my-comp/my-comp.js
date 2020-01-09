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

