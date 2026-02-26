import './style.css'
import { Router } from './router'
import { renderHome } from './screens/home'
import { renderArena } from './screens/arena'
import { renderExpedition } from './screens/expedition'
import { renderAlbum } from './screens/album'
import { renderWorkshop } from './screens/workshop'
import { renderSocial } from './screens/social'
import { renderStore } from './screens/store'
import { renderLogin } from './screens/auth'
import { renderProfile } from './screens/profile'
import { initNotificationSystem } from './components/Notifications';

const appContainer = document.querySelector<HTMLDivElement>('#app')!
initNotificationSystem();

const router = new Router('app');
(window as any).router = router;

router.register('home', async () => {
    renderHome(appContainer);
});

router.register('login', async () => {
    renderLogin(appContainer);
});

// Register other screens
router.register('expedition', async () => {
    renderExpedition(appContainer);
});
router.register('arena', async () => {
    renderArena(appContainer);
});
router.register('album', async () => {
    renderAlbum(appContainer);
});
router.register('workshop', async () => {
    renderWorkshop(appContainer);
});
router.register('social', async () => {
    renderSocial(appContainer);
});
router.register('store', async () => {
    renderStore(appContainer);
});
router.register('profile', async () => {
    renderProfile(appContainer);
});

router.init();

