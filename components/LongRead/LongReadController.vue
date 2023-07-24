<!--
	Last modified: 2023/07/20 11:45:15
-->
<template>
	<div class="c-long-read-controller">
		<slot v-bind="slotBindings"></slot>
	</div>
</template>

<script>
import { reactive } from 'vue';

/** Data */
export const data = reactive({
	_controllers: new Set(),
	_targets: {},
	_latest: null,

	get controllers() {
		return [...this._controllers];
	},

	get targets() {
		const keys = Object.keys(this._targets);
		keys.sort((a, b) => {
			const aOrder = this._targets[a].order;
			const bOrder = this._targets[b].order;

			for (let n = 0; n < Math.min(aOrder?.length, bOrder?.length); n++) {
				if (aOrder[n] !== bOrder[n]) {
					return (aOrder[n] > bOrder[n]) * 2 - 1;
				}
			}

			return 0;
		});

		return keys.map((e) => this._targets[e]);
	},

	get activeTarget() {
		// Remove any lingering targets from other pages
		if (this._latest && this.targets.indexOf(this._latest) === -1) {
			this._latest = null;
		}

		let target = [...this.targets].reverse().reduce((acc, target) => {
			return (target?.visibility ?? 0) >= (acc?.visibility ?? 0.00001) &&
				target?.title?.length
				? target
				: acc;
		}, null);
		if (!target) {
			// Find first target above the viewport
			target = [...this.targets].reverse().find((target) => {
				return target?.aboveViewport && target?.title?.length;
			});
		}

		target = target ?? this._latest ?? this.targets[0];
		this._latest = target;
		return target;
	},
});

/** Component */
export default {
	name: 'LongReadController',

	data() {
		return {
			targetElements: [],
			intersectionObserver: null,
			data: {}
		};
	},

	computed: {
		dataTargets() {
			return data.targets;
		},
		dataActiveTarget() {
			return data.activeTarget;
		},

		slotBindings() {
			return {
				data: {
					targets: this.dataTargets,
					activeTarget: this.dataActiveTarget,
				},

				actions: {
					scrollToTarget: this.scrollToTarget,
				},
			};
		},
	},

	watch: {
		dataTargets(targets) {
			// Create intersection observer if it doesn't exist yet
			this.intersectionObserver =
				this.intersectionObserver ||
				new IntersectionObserver(this.onIntersection, { threshold: 0 });

			// Find target elements
			this.targetElements = [
				...(targets || []).map(({ id }) => document.getElementById(id)),
			];

			// Refresh what's observed
			this.intersectionObserver.disconnect();
			this.targetElements.forEach(
				(target) => target && this.intersectionObserver.observe(target)
			);
		},
	},

	mounted() {
		data._controllers.add(this);
		console.log('data', data);
		this.data._controllers = data._controllers;

		this.onScroll();
		window.addEventListener('scroll', this.onScroll);
		window.addEventListener('resize', this.onScroll);
	},

	beforeUnmount() {
		data._controllers.delete(this);
		this.data._controllers = data._controllers;
		//this.$set(data, '_controllers', data._controllers);

		this.intersectionObserver?.disconnect?.();
		window.removeEventListener('scroll', this.onScroll);
		window.removeEventListener('resize', this.onScroll);
	},

	methods: {
		/** Events */
		onScroll() {
			this.targetElements
				.filter(
					(target) => target && data._targets[target.id]?.inViewport
				)
				.forEach((target) => {
					const percentage = this.percentageInViewport(target);
					Object.assign(data._targets[target.id], {
						visibility: percentage,
					});
					this.$set(data, '_targets', data._targets);
				});
		},

		onIntersection(entries) {
			entries.forEach(({ isIntersecting, target }) => {
				if (data._targets[target.id]) {
					// Is in viewport
					data._targets[target.id].inViewport = isIntersecting;

					// Is outside of viewport
					if (!isIntersecting) {
						const { bottom = 0 } =
							target?.getBoundingClientRect?.() || {};
						data._targets[target.id].aboveViewport =
							bottom < window.innerHeight / 2;
					} else {
						data._targets[target.id].aboveViewport = false;
					}
				}
			});
			this.$set(data, '_targets', data._targets);
		},

		/** Actions */
		scrollToTarget(target, { setHash = true } = {}) {
			setHash && history.replaceState({}, '', `#${target.id}`);
			try {
				document.getElementById(target.id)?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			} catch (e) {
				document.getElementById(target.id)?.scrollIntoView();
			}
		},

		/** Helper functions */
		percentageInViewport(element) {
			if (!element) {
				return 0;
			}

			const { height, width, left, top } =
				element.getBoundingClientRect();

			const l = Math.max(0, left);
			const t = Math.max(0, top);
			const r = Math.min(window.innerWidth, left + width);
			const b = Math.min(window.innerHeight, top + height);

			const ip = ((l - r) * (t - b)) / (width * height);
			return Math.max(Math.min(ip, 1), 0);
		},
	},
};
</script>
