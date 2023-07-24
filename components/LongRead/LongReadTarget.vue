<!--
	Last modified: 2023/07/20 12:00:05
-->
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
	data() {
		return {
			LongRead: {
				data: {
					_targets: {}
				}
			}
		};
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
				this.LongRead.data._targets[this.containerId]['metaData'] = this.metaData || {};
				/* this.$set(
					LongRead.data._targets[this.containerId],
					'metaData',
					this.metaData || {}
				); */
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
			const order = [];
			let prevNode = this;
			while (prevNode.$parent._) {
				console.log('prevNode.$parent', prevNode.$parent);
				const { children } = prevNode.$parent._.vnode;

				!children?.length && order.push(0);
				children?.length &&
					children?.forEach((child, index) => {
						child.componentInstance?._uid === prevNode._uid &&
							order.push(index);
					});

				prevNode = prevNode.$parent;
			}

			order.reverse();

			this.LongRead.data._targets[this.containerId] = {
				id: this.containerId,
				tocItemId: `${this.containerId}__toc-item`,
				title: this.title,
				visibility: 0,
				inViewport: false,
				aboveViewport: false,
				metaData: this.metaData || {},
				order,
			};
			console.log('this.LongRead.data', LongRead.data);

			/* this.$set(LongRead.data?._targets, this.containerId, {
				id: this.containerId,
				tocItemId: `${this.containerId}__toc-item`,
				title: this.title,
				visibility: 0,
				inViewport: false,
				aboveViewport: false,
				metaData: this.metaData || {},
				order,
			}); */
		},

		removeTarget(id = this.containerId) {
			delete LongRead.data._targets[id];

			this.LongRead.data._targets = { ...LongRead.data._targets };
			//this.$set(LongRead.data, '_targets', { ...LongRead.data._targets }); // We need this for it to be reactive
		},
	},
};
</script>
