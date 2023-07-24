<template>
	<a
		v-if="config && url"
		class="c-long-read-target-toc-link"
		:href="url"
		v-bind="attrs"
		@click="onClick"
		v-text="name"
	></a>
</template>

<script>
import * as LongRead from './LongReadController';

export default {
	name: 'LongReadTargetTocLink',

	props: {
		baseId: {
			type: String,
			required: true,
		},

		config: {
			type: [Object, String, Boolean],
			default: false,
		},
	},

	computed: {
		name() {
			if (typeof this.config === 'string') {
				return this.config;
			}
			return (
				this.config.name ||
				'Spring til overskriften i indholdsfortegnelsen'
			);
		},

		url() {
			if (LongRead?.data?.controllers?.length && this.baseId) {
				return this.config?.url || `#${this.baseId}__toc-item`;
			}
			return null;
		},

		setHash() {
			return this.config?.setHash ?? true;
		},

		attrs() {
			return this.config?.attrs || {};
		},
	},

	methods: {
		onClick(e) {
			if (this.setHash) {
				if (this.$route.hash === this.url) {
					const hashChangeEvent = new HashChangeEvent('hashchange', {
						oldURL: window.location.href,
						newURL: window.location.href,
					});
					window.dispatchEvent(hashChangeEvent);
				}
			} else {
				e.preventDefault();
				const { hash } = new URL(this.url, window.location.href);
				const id = hash && hash.substring(1);
				const el = id && document.getElementById(id);
				el?.focus?.();
			}
		},
	},
};
</script>

<style>
:where(.c-long-read-target-toc-link) {
	/* Same as tailwind's sr-only class */
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}
</style>
