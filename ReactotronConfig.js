import Reactotron from "reactotron-react-native";

Reactotron.configure() // controls connection & communication settings
  .configure({ host: '10.0.0.143' })
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!