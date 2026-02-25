import './style.css'
import { Router } from './router'
import { renderHome } from './screens/home'
import { renderArena } from './screens/arena'
import { renderExpedition } from './screens/expedition'
import { renderAlbum } from './screens/album'
import { renderWorkshop } from './screens/workshop'
import { renderSocial } from './screens/social'

const appContainer = document.querySelector<HTMLDivElement>('#app')!

const router = new Router('app');
(window as any).router = router;

router.register('home', async () => {
    renderHome(appContainer);
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

router.init();

