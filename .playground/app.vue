<template>
	<div>
		<LongReadController>
			<template #default="{ data, actions }">
				<!-- Desktop -->
				<div
					:class="[
						'c-long-read__desktop',
						'hidden pointer-events-auto',
						'>=1024:grid gap-y-lg',
					]"
				>
					<h2
						:class="[
							'sticky top-0',
							'text-aside-title uppercase',
							'font-darker-grotesque font-extrabold',
						]"
						v-text="'Sidens indhold'"
					></h2>

					<div class="relative">
						<div
							ref="desktopList"
							:class="[
								'c-long-read__desktop-inner',
								'overflow-y-scroll max-h-full',
								'pl-26 -ml-26 pb-4',
							]"
						>
							<ul ref="desktopListInner" class="space-y-md">
								<li
									v-for="(target, index) in data.targets"
									:key="`item-${index}`"
								>
									<a
										:href="`#${target.id}`"
										:class="[
											'c-long-read__target relative',
											'font-darker-grotesque font-medium text-aside',
											'block pr-8',

											{
												'c-long-read__target--active font-bold pr-0':
													data.activeTarget.id ===
													target.id,
											},
										]"
										:aria-current="
											data.activeTarget.id === target.id
										"
										@click.prevent="
											() =>
												actions.scrollToTarget &&
												actions.scrollToTarget(target)
										"
										v-text="target.title"
									></a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</template>
		</LongReadController>

		<div>
			<div id="title1" style="height:100vh">
				heheh
				<LongReadTarget
					container-id="title1"
					title="title 1 "
				/>
			</div>
			<div id="title2" style="height:100vh">
				heuu
				<LongReadTarget
					container-id="title2"
					title="title 2"

				/>
			</div>
		</div>
	</div>
</template>
