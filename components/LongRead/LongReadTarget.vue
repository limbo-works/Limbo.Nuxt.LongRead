<template>
	<div
		v-if="
			$slots.default || Object.entries($attrs).length || linkToToc
		"
		class="c-long-read-target"
	>
		<LongReadTargetTocLink
			v-if="linkToToc && !disabled"
			:base-id="containerId"
			:config="linkToToc"
		/>

		<slot></slot>
	</div>
</template>

<script>
import * as LongRead from './LongReadController';
import LongReadTargetTocLink from './LongReadTargetTocLink';

export default {
	name: 'LongReadTarget',

	components: { LongReadTargetTocLink },

	props: {
		containerId: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		linkToToc: {
			type: [Object, String, Boolean],
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},

		// If you need to pass on extra data the toc should know
		metaData: {
			type: Object,
			default: () => ({}),
		},
	},
	watch: {
		disabled(value) {
			this[value ? 'removeTarget' : 'addTarget']();
		},
		containerId(_, id) {
			this.removeTarget(id);
			this.addTarget();
		},
		metaData() {
			if (LongRead.data._targets[this.containerId]) {
				LongRead.data._targets[this.containerId]['metaData'] = this.metaData || {};
			}
		},
	},

	mounted() {
		!this.disabled && this.addTarget();
	},

	beforeUnmount() {
		this.removeTarget();
	},

	methods: {
		addTarget() {
			// In Vue 3, we'll use a simpler approach for ordering
			// by using the creation time and DOM position
			const order = [];
			
			// Try to find the position based on DOM order
			const allTargets = document.querySelectorAll('.c-long-read-target');
			const thisElement = this.$el;
			
			if (thisElement && allTargets.length > 0) {
				// Find the index of this element among all targets
				const index = Array.from(allTargets).indexOf(thisElement);
				order.push(index >= 0 ? index : Object.keys(LongRead.data._targets).length);
			} else {
				// Fallback: use the number of existing targets as order
				order.push(Object.keys(LongRead.data._targets).length);
			}

			LongRead.data._targets[this.containerId] = {
				id: this.containerId,
				tocItemId: `${this.containerId}__toc-item`,
				title: this.title,
				visibility: 0,
				inViewport: false,
				aboveViewport: false,
				metaData: this.metaData || {},
				order,
			};
		},

		removeTarget(id = this.containerId) {
			delete LongRead.data._targets[id];
			LongRead.data._targets = { ...LongRead.data._targets }; // Still needed? We need this for it to be reactive
		},
	},
};
</script>
