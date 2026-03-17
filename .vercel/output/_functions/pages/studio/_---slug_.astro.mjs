import { c as createComponent, g as renderHead, r as renderComponent, b as renderTemplate } from '../../chunks/astro/server_D1eujKSv.mjs';
/* empty css                                     */
export { renderers } from '../../renderers.mjs';

const prerender = false;
const $$ = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="ru" style="margin:0;padding:0;height:100%;" data-astro-cid-awtszqxe> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Рубеж — CMS Studio</title><meta name="robots" content="noindex,nofollow">${renderHead()}</head> <body style="height:100%" data-astro-cid-awtszqxe> ${renderComponent($$result, "SanityStudio", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-awtszqxe": true, "client:component-path": "C:/DEV/2026/RUBEZH/src/components/SanityStudio", "client:component-export": "default" })} </body></html>`;
}, "C:/DEV/2026/RUBEZH/src/pages/studio/[...slug].astro", void 0);

const $$file = "C:/DEV/2026/RUBEZH/src/pages/studio/[...slug].astro";
const $$url = "/studio/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    default: $$,
    file: $$file,
    prerender,
    url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
