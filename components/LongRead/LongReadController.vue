<template>
	<div class="c-long-read-controller">
		<slot v-bind="slotBindings"></slot>
	</div>
</template>

<script>
import { reactive, watch } from 'vue';

/** Data */
export const data = reactive({
	_controllers: new Set(),
	_targets: {},
	_activeTarget: null,
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
		return this._activeTarget;
	},

	/* Trigger an update manually */
	update() {
		// Update relation to viewport
		data.targets.forEach((target) => {
			const targetEl = target?.id && document.getElementById(target.id);
			if (targetEl) {
				const targetRect = targetEl.getBoundingClientRect();

				const isIntersecting =
					(targetRect.top >= 0 &&
						targetRect.top < window.innerHeight) ||
					(targetRect.bottom >= 0 &&
						targetRect.bottom < window.innerHeight) ||
					(targetRect.top < 0 &&
						targetRect.bottom >= window.innerHeight);

				if (!isIntersecting) {
					const { bottom = 0 } =
						targetEl.getBoundingClientRect?.() || {};
					target.visibility = 0;
					target.aboveViewport = Math.min(320, bottom < window.innerHeight / 3);
					target.inViewport = false;
				} else {
					const percentage =
						(targetRect.top < 0
							? targetRect.bottom
							: window.innerHeight - targetRect.top) /
						(targetRect.height || 1);
					target.visibility = Math.max(0, Math.min(1, percentage));
					target.aboveViewport = false;
					target.inViewport = true;
				}
			}
		});
	},
});

watch(
	() => data.targets,
	() => {
		// Remove any lingering targets from other pages
		if (data._latest && data.targets.indexOf(data._latest) === -1) {
			data._latest = null;
		}

		let target = [...data.targets].reverse().reduce((acc, target) => {
			return (target?.visibility ?? 0) >= (acc?.visibility ?? 0.00001) &&
				target?.title?.length
				? target
				: acc;
		}, null);

		if (!target) {
			// Find first target above the viewport
			target = [...data.targets].reverse().find((target) => {
				return target?.aboveViewport && target?.title?.length;
			});
		}

		target = target ?? data._latest ?? data.targets[0];
		data._latest = target;

		data._activeTarget = target;
	},
	{ immediate: true, deep: true }
);

/** Component */
export default {
	name: 'LongReadController',

	provide() {
		return {
			longReadController: {
				data,
				actions: {
					scrollToTarget: this.scrollToTarget,
					update: this.update,
				},
			},
		};
	},

	data() {
		return {
			targetElements: [],
			intersectionObserver: null,
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
					update: data.update,
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

		this.onScroll();
		window.addEventListener('scroll', this.onScroll);
		window.addEventListener('resize', this.onScroll);

		data.update();
	},

	beforeUnmount() {
		data._controllers.delete(this);

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

			// Calculate the visible area of the element
			const visibleLeft = Math.max(0, left);
			const visibleTop = Math.max(0, top);
			const visibleRight = Math.min(window.innerWidth, left + width);
			const visibleBottom = Math.min(window.innerHeight, top + height);

			// Calculate visible dimensions
			const visibleWidth = Math.max(0, visibleRight - visibleLeft);
			const visibleHeight = Math.max(0, visibleBottom - visibleTop);

			// Calculate percentage of element that is visible
			const visibleArea = visibleWidth * visibleHeight;
			const totalArea = width * height;

			return totalArea > 0 ? visibleArea / totalArea : 0;
		},
	},
};
</script>
