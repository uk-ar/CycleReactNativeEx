import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@kadira/react-native-storybook';

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUI = getStorybookUI({port: 7007, host: '10.0.3.2'});
AppRegistry.registerComponent('CycleReactNativeEx', () => StorybookUI);
