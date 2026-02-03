<template>
	<LongReadController ref="longRead" class="c-long-read">
		<template #default="{ data, actions }">
			<nav id="long-read" class="c-long-read__aside hidden >=1280:!block">
				<h2 class="mb-2xs text-onCanvasMedium text-body-lg-strong">
					{{ localize('CONTENT_NAVIGATION', { capitalize: true }) }}
				</h2>
				<ClientOnly>
					<div class="relative">
						<ul class="flex flex-col overflow-x-hidden">
							<li
								v-for="target in data.targets"
								:id="`listTarget-${target.id}`"
								:key="`item-${target.id}`"
								class="c-long-read__aside-item relative py-4xs flex items-center text-caption-lg-regular"
							>
								<Transition name="icon-fade">
									<BaseIcon
										v-if="
											data.activeTarget?.id === target.id
										"
										name="chevron-right"
										class="w-1.25em w-1.25em absolute left-0 translate-y-1/2 top-0 text-interactive"
									/>
								</Transition>
								<a
									:id="target.tocItemId"
									class="pr-md"
									:class="{
										'translate-x-sm':
											data.activeTarget?.id === target.id,
									}"
									:href="`#${target.id}`"
									:aria-current="
										data.activeTarget?.id === target.id
									"
									@click.prevent="
										() =>
											actions.scrollToTarget &&
											actions.scrollToTarget(target)
									"
								>
									<span v-text="target?.title"></span>
								</a>
							</li>
						</ul>
					</div>

					<template #fallback>
						<div role="status">
							{{ localize('LOADING', { capitalize: true }) }}...
						</div>
					</template>
				</ClientOnly>
			</nav>

			<!-- Mobile/tablet -->
			<div
				class="c-long-read__dropdown >=1280:!hidden flex justify-end mt-[calc(var(--theme-layout-margin)-var(--theme-spacing-beforeBlocks))]"
			>
				<BaseButton
					id="long-read-mobile"
					icon="start"
					color="surface"
					aria-controls="c-long-read__dropdown-list"
					:aria-expanded="String(isOpen)"
					class="c-long-read__menu-btn"
					:class="[
						'absolute justify-center px-2xs',
						'text-body-sm-strong text-interactive hover:text-interactiveHover active:text-interactiveActive',
						{
							'min-w-full >=656:min-w-fit': !hasScrolled,
							'min-w-[calc(max(1.25em,1lh)+2*var(--theme-spacing-2xs))] gap-0':
								hasScrolled,
							'c-long-read__menu-btn--scrolled': hasScrolled,
						},
					]"
					@click="isOpen = true"
				>
					<template #icon>
						<BaseIcon name="longread" class="w-full h-full" />
					</template>

					<div
						class="c-long-read__text-wrapper"
						:class="{
							'c-long-read__text-wrapper--is-open': !hasScrolled,
						}"
					>
						<span
							class="c-long-read__text-wrapper-inner whitespace-nowrap"
							:class="{
								'c-long-read__text-wrapper-inner--scrolled':
									hasScrolled,
							}"
						>
							{{
								localize('CONTENT_NAVIGATION', {
									capitalize: true,
								})
							}}
						</span>
					</div>
				</BaseButton>
			</div>

			<!-- Dropdown for mobile -->
			<ClientOnly>
				<Teleport to="#global-overlay">
					<Transition key="long-read" name="t-long-read-fade-down">
						<nav
							v-if="isOpen"
							id="c-long-read__dropdown-list"
							tag="div"
							aria-role="menu"
							class="fixed z-10000 left-0 right-0 top-0 rounded-tl-none rounded-tr-none rounded-bl-modalLg rounded-br-modalLg w-visual-screen"
						>
							<div
								class="c-long-read__dropdown-blur z-1"
								@click="isOpen = false"
							></div>
							<div
								class="relative grid grid-cols-1 max-h-80vh <656:max-h-90vh overflow-hidden p-lg bg-canvas rounded-br-24 rounded-bl-24 z-2"
								style="grid-template-rows: auto auto 1fr"
							>
								<!-- Header -->
								<div
									class="flex justify-between w-full h-fit py-3xs gap-lg"
								>
									<div class="flex flex-col">
										<p class="text-display-lg mb-4xs">
											{{
												localize('CONTENT_NAVIGATION', {
													capitalize: true,
												})
											}}
										</p>
										<p
											class="text-body-md-regular text-onCanvasSubtle"
										>
											{{
												localize(
													'PHRASE_PRESS_A_HEADING_TO_JUMP_TO_CONTENT',
													{ capitalize: true }
												)
											}}
										</p>
									</div>
									<button
										class="flex-shrink-0 h-fit w-fit p-4xs"
										aria-owns="c-long-read__dropdown-list text-onCanvasMedium"
										@click="isOpen = false"
									>
										<BaseIcon
											name="close"
											class="w-24 h-24"
										/>
									</button>
								</div>

								<!-- Seperator -->
								<div
									class="w-full h-1 my-xs"
									style="
										background-color: rgb(
											var(
												--theme-colors-border-subtle-on-X
											)
										);
									"
								></div>

								<!-- Scrollable area -->
								<div class="relative min-h-0 max-h-full">
									<BaseScrollbar
										:id="`mobile-scrollbar-${scrollbarId}`"
										:aria-controls="`mobile-scrollbar-${scrollbarId}`"
										class="h-full overflow-auto"
									>
										<ul
											class="c-long-read_dropdown-list flex flex-col"
										>
											<li
												v-for="(
													target, index
												) in data.targets"
												:id="`item-${index}`"
												:key="`item-${index}`"
												class="bg-canvas px-0 py-3xs list-none"
											>
												<a
													:id="
														target.tocItemId +
														'--mobile'
													"
													class="flex flex-col text-body-lg-strong text-interactive hover:text-interactiveHover active:text-interactiveActive"
													:href="`#${target.id}`"
													:aria-current="
														data.activeTarget.id ===
														target.id
													"
													@click.prevent="
														mobileGoTo(() =>
															actions?.scrollToTarget?.(
																target
															)
														)
													"
												>
													<p
														v-text="target.title"
													></p>
													<Transition
														name="t-long-read-collapse-height"
													>
														<p
															v-if="
																data
																	.activeTarget
																	.id ===
																target.id
															"
															class="text-caption-lg-regular text-onCanvasSubtle"
														>
															{{
																localize(
																	'YOU_ARE_HERE',
																	{
																		capitalize: true,
																	}
																)
															}}
														</p>
													</Transition>
												</a>
											</li>
										</ul>
									</BaseScrollbar>
								</div>
							</div>
						</nav>
					</Transition>
				</Teleport>
			</ClientOnly>
		</template>
	</LongReadController>
</template>

<script setup>
useSingletonActiveState('longRead', true);

const scrollbarId = useState(
	() => `scrollbar-${Math.floor(Math.random() * 1000000).toString()}`
);

const isOpen = ref(false);
const hasScrolled = useState('longReadHasScrolled', () => false);
const longRead = ref(null);
const activeTarget = ref(null);

function mobileGoTo(callback) {
	isOpen.value = false;
	setTimeout(callback, 300);
}

const sortedTargets = computed(() => {
	if (!longRead.value?.dataTargets) return [];

	return longRead.value.dataTargets
		.map((element) => {
			const el = document.getElementById(element.id);
			if (!el) return null;

			const topPosition = Math.floor(
				el.getBoundingClientRect().top + window.scrollY
			);

			return { ...element, top: topPosition };
		})
		.filter(Boolean)
		.sort((a, b) => a.top - b.top);
});

watch(activeTarget, (newTarget) => {
	if (!newTarget) return;

	const el = document.getElementById(newTarget.tocItemId);
	if (!el) return;

	if (sortedTargets.value.length > 0) {
		const lastItemId = sortedTargets.value.at(-1).id;
		if (newTarget.id === lastItemId) return;
	}

	scrollIntoView(
		el.parentNode,
		{
			block: 'nearest',
			inline: 'nearest',
		},
		el.parentNode.closest('#l-content-page-layout__aside-content')
	);
});

useEventListener('scroll', onScroll, { immediate: true });

onMounted(() => {
	if (
		longRead.value &&
		longRead.value.slotBindings &&
		longRead.value.slotBindings.actions &&
		typeof longRead.value.slotBindings.actions.update === 'function'
	) {
		longRead.value.slotBindings.actions.update();
	} else {
		console.warn(
			'[LongRead] Expected slotBindings.actions.update to exist, but it was not found.',
			{ longRead: longRead.value }
		);
	}

	// Initialize activeTarget once targets exist
	nextTick(() => {
		if (longRead.value?.dataActiveTarget) {
			activeTarget.value = longRead.value.dataActiveTarget;
		}
	});
});

onBeforeUnmount(() => {
	isOpen.value = false;
	hasScrolled.value = false;
});

function onScroll() {
	const __nuxt = document.getElementById('__nuxt');
	if (__nuxt && __nuxt.style.overflow === 'hidden') return;

	hasScrolled.value =
		(window.scrollY || document.documentElement.scrollTop) > 200;

	activeTarget.value =
		sortedTargets.value.findLast(
			(target) => target.top < window.scrollY + window.innerHeight
		) ?? sortedTargets.value[0];
}
</script>

<style lang="postcss">
.c-long-read__aside-item a {
	transition-duration: 0.2s;
	transition-property: transform;
	transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
.c-long-read__aside-item a[aria-current='false'] {
	@apply text-medium text-caption-lg-regular hover:(translate-x-5xs text-interactive);
}
.c-long-read__aside-item a[aria-current='true'] {
	@apply text-interactive text-caption-lg-strong;
}

.c-long-read__menu-btn {
	transition: all 0.2s ease-in;
}
.c-long-read__menu-btn--scrolled {
	box-shadow:
		2.6px 5.6px 7.1px 0px rgba(13, 4, 57, 0.04),
		1.4px 2.9px 3.7px 0px rgba(13, 4, 57, 0.02),
		0.7px 1.4px 1.8px 0px rgba(13, 4, 57, 0.02),
		0.3px 0.7px 0.9px 0px rgba(13, 4, 57, 0.02),
		0.1px 0.2px 0.3px 0px rgba(13, 4, 57, 0.02);

	.c-base-button__text {
		@apply px-0;
	}
}

@screen <1280 {
	.c-long-read__text-wrapper {
		display: grid;
		grid-template-columns: 0fr;
		transition: grid-template-columns 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
		overflow: hidden;
	}
	.c-long-read__text-wrapper.c-long-read__text-wrapper--is-open {
		grid-template-columns: 1fr;
	}

	.c-long-read__text-wrapper-inner {
		@apply max-h-22 transition-transform opacity-100 duration-700;
		overflow: hidden;
	}
	.c-long-read__text-wrapper-inner--scrolled {
		transition:
			transform 700ms 200ms,
			opacity 200ms;
		@apply translate-y-50 opacity-0;
	}
}

.c-long-read__dropdown .c-dropdown-option-list .c-dropdown-option {
	@apply bg-canvas;
}

.c-long-read__dropdown-blur {
	@apply fixed;
	transition: opacity 0.2s;
	height: calc(var(--visual-viewport-height) + 100%);
	width: var(--visual-viewport-width);
	background: rgba(20, 20, 31, 0.2);
	backdrop-filter: blur(2px);
	left: 0;
	top: 0;
}

/* icon animation */
.icon-fade-enter-active,
.icon-fade-leave-active {
	@apply translate-x-0;
	transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.icon-fade-enter-from,
.icon-fade-leave-to {
	@apply -translate-x-2xs;
	opacity: 0;
}

/* <=1280 animation for menu  */
.t-long-read-fade-down-enter-active,
.t-long-read-fade-down-leave-active {
	@apply translate-y-0;
	transition: all 0.25s ease-out;
}

.t-long-read-fade-down-enter-from,
.t-long-read-fade-down-leave-to {
	@apply -translate-y-full;

	.c-long-read__dropdown-blur {
		@apply opacity-0;
	}
}

.t-long-read-collapse-height-enter-active,
.t-long-read-collapse-height-leave-active {
	transition:
		max-height 0.2s ease-out,
		opacity 0.2s;
	max-height: 1lh;
}
.t-long-read-collapse-height-enter-from,
.t-long-read-collapse-height-leave-to {
	max-height: 0;
	opacity: 0;
}
</style>
