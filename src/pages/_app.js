import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../app/globals.css";
import firebaseApp from "../firebaseConfig"; 
// firebaseApp needs to be imported here to be able to initialize firebase before being called anywhere else

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
