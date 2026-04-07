# Limbo Nuxt Long Read

Long-read table of contents components for Nuxt, with automatic active-section tracking and smooth anchor navigation.

## What this package provides

- `LongReadController`: gathers registered targets and exposes reactive TOC data via slot props.
- `LongReadTarget`: registers one content section in the controller.
- `LongReadTargetTocLink`: optional per-section link back to the TOC entry.

## Install

```bash
yarn add @limbo-works/long-read
```

## Nuxt setup

This package is consumed as a Nuxt layer.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
	extends: ['@limbo-works/long-read'],
});
```

After extending the layer, the components are available in templates.

## Quick example

```vue
<template>
	<LongReadController>
		<template #default="{ data, actions }">
			<nav>
				<ul>
					<li v-for="target in data.targets" :key="target.id">
						<a
							:id="target.tocItemId"
							:href="`#${target.id}`"
							:aria-current="data.activeTarget?.id === target.id"
							@click.prevent="actions.scrollToTarget(target)"
						>
							{{ target.title }}
						</a>
					</li>
				</ul>
			</nav>

			<article>
				<section id="intro">
					<LongReadTarget container-id="intro" title="Introduction" />
					<h2>Introduction</h2>
				</section>

				<section id="details">
					<LongReadTarget
						container-id="details"
						title="Details"
						:meta-data="{ difficulty: 'advanced' }"
					/>
					<h2>Details</h2>
				</section>
			</article>
		</template>
	</LongReadController>
</template>
```

## API

### LongReadController

Default slot props:

- `data.targets`: sorted list of registered targets.
- `data.activeTarget`: currently active target.
- `actions.scrollToTarget(target, { setHash = true })`.
- `actions.update()`: recalculates visibility state.
- `actions.setViewThreshold(threshold, { minPx = 0, maxPx = Infinity })`.

Behavior:

- Without `setViewThreshold`, the active target is picked from visibility.
- With `setViewThreshold`, the active target is the last section above the threshold line.

Target shape:

```ts
type LongReadTargetData = {
	id: string;
	tocItemId: string;
	title: string;
	visibility: number;
	inViewport: boolean;
	aboveViewport: boolean;
	metaData: Record<string, unknown>;
	order: number[];
	top?: number;
};
```

### LongReadTarget

Props:

- `containerId` (`container-id` in templates, required): element id for the section.
- `title` (required): TOC label.
- `disabled` (default `false`): skip registration.
- `metaData` (`meta-data`, default `{}`): custom per-target data.
- `linkToToc` (`link-to-toc`, default `false`): render a hidden jump link to the TOC item.

Important:

- `containerId` must match an existing DOM id on the section container.
- Targets with an empty title are ignored when picking active target.

### LongReadTargetTocLink

Used internally by `LongReadTarget` when `link-to-toc` is enabled.

- `config` accepts `boolean | string | object`.
- Object config supports: `name`, `url`, `setHash`, and `attrs`.

## Current status of composables

`composables/_useLongRead.js` is work in progress and not integrated with the component API yet. Treat it as internal/experimental for now.

## Development

```bash
yarn dev
```

This starts the local playground in `.playground`.

## Browser support

- Modern browsers with `IntersectionObserver`.

## License

MIT
