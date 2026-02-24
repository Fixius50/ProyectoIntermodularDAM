import { AppRegistry } from 'react-native';
// AVISO CRÍTICO: La extensión .tsx es OBLIGATORIA aquí.
// Si se pone solo './App', Vite podría resolver 'app.json' de forma incorrecta
// dependiendo de la configuración del resolver, inyectando un objeto JSON puro en React.
import App from './App.tsx';
import appConfig from './app.json';

const appName = appConfig.name;

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
    initialProps: {},
    rootTag: document.getElementById('root'),
});
