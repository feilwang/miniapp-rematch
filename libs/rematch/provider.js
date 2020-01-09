export default function Provider(store) {
  return (appObj) => {
    appObj.store = store;
    return appObj;
  };
}
