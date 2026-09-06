# mahim.work

Source for [mahim.work](https://mahim.work), Mahim Gupta's site. Astro, markdown, one stylesheet, no client JavaScript.

## Development

```sh
pnpm install
pnpm dev
pnpm astro check
pnpm build
```

Case studies live in `src/content/work` and posts in `src/content/writing`. Entries marked `draft: true` render in `pnpm dev` and are left out of `pnpm build`; set `SHOW_DRAFTS=1` to include them in a preview build.
