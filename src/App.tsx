import React from "react";
import { Provider } from "react-redux";

import store from "./store/store.root";
import Wrapper from "./components/wrapper/wrapper";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
};

export default App;
