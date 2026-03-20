import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CetpvjXh.mjs';
import { manifest } from './manifest_BcnwIJl7.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/arenda-spetstehniki.astro.mjs');
const _page2 = () => import('./pages/kontakty.astro.mjs');
const _page3 = () => import('./pages/o-kompanii.astro.mjs');
const _page4 = () => import('./pages/privacy.astro.mjs');
const _page5 = () => import('./pages/proekty.astro.mjs');
const _page6 = () => import('./pages/studio/_---slug_.astro.mjs');
const _page7 = () => import('./pages/vakansii.astro.mjs');
const _page8 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/.pnpm/astro@5.18.0_@types+node@25_cecce93cb1ba4101977999d9141ded1f/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/arenda-spetstehniki.astro", _page1],
    ["src/pages/kontakty.astro", _page2],
    ["src/pages/o-kompanii.astro", _page3],
    ["src/pages/privacy.astro", _page4],
    ["src/pages/proekty.astro", _page5],
    ["src/pages/studio/[...slug].astro", _page6],
    ["src/pages/vakansii.astro", _page7],
    ["src/pages/index.astro", _page8]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "4973cef6-4179-471d-9e6c-821ac7e51723",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
