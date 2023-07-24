# Long Read

## Usage
Setting up the long read menu
```html
<LongReadController>
	<template #default="{ data, actions }">
		<ul>
			<li
				v-for="(target, index) in data.targets"
				:key="`item-${index}`"
			>
				<a
					:href="`#${target.id}`"
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
	</template>
</LongReadController>
```

Setting Up the Scroll Targets.
```html
<div id="title1" >
	<LongReadTarget
		container-id="title1"
		title="title 1"
	/>
</div>
```
