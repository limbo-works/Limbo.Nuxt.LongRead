<template>
	<div>
		<LongReadController>
			<template #default="{ data, actions }">
				<!-- Table of Contents -->
				<div
					class="toc-sidebar"
					style="position: fixed; right: 30px; top: 50px; background: rgb(222, 211, 195); padding: 20px; border-radius: 8px; min-width: 250px; max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
				>
					<h2
						style="margin: 0 0 20px 0; color: rgb(110, 124, 107); font-size: 18px; font-weight: bold; text-transform: uppercase;"
					>
						Table of Contents
					</h2>

					<nav>
						<ul style="list-style: none; padding: 0; margin: 0;">
							<li
								v-for="(target, index) in data.targets"
								:key="`item-${index}`"
								style="margin-bottom: 8px;"
							>
								<a
									:href="`#${target.id}`"
									:style="{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										padding: '10px 12px',
										backgroundColor: data.activeTarget?.id === target.id ? 'rgb(110, 124, 107)' : 'transparent',
										color: data.activeTarget?.id === target.id ? 'white' : 'rgb(110, 124, 107)',
										textDecoration: 'none',
										borderRadius: '4px',
										fontWeight: data.activeTarget?.id === target.id ? 'bold' : 'normal',
										transition: 'all 0.2s ease'
									}"
									@click.prevent="actions.scrollToTarget(target)"
									@mouseover="$event.target.style.backgroundColor = data.activeTarget?.id === target.id ? 'rgb(110, 124, 107)' : 'rgba(110, 124, 107, 0.1)'"
									@mouseout="$event.target.style.backgroundColor = data.activeTarget?.id === target.id ? 'rgb(110, 124, 107)' : 'transparent'"
								>
									<span>{{ target.title }}</span>
									<span
										style="font-size: 12px; opacity: 0.8; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px;"
									>
										{{ Math.round(target.visibility * 100) }}%
									</span>
								</a>
							</li>
						</ul>
					</nav>

					<!-- Debug Info -->
					<details style="margin-top: 20px; font-size: 12px;">
						<summary style="cursor: pointer; color: rgb(110, 124, 107); font-weight: bold;">Debug Info</summary>
						<pre style="margin-top: 10px; padding: 10px; background: rgba(255,255,255,0.3); border-radius: 4px; overflow-x: auto; font-size: 10px;">{{ JSON.stringify(data, null, 2) }}</pre>
					</details>
				</div>
			</template>
		</LongReadController>

		<!-- Content Sections -->
		<div style="max-width: 800px; margin: 0 auto; padding: 20px;">
			<section id="introduction" style="min-height: 10vh; padding: 40px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; margin-bottom: 20px;">
				<LongReadTarget
					container-id="introduction"
					title="Introduction"
					:meta-data="{ difficulty: 'beginner', estimatedTime: '5 minutes' }"
				/>
				<h1 style="font-size: 3rem; margin-bottom: 20px;">Introduction</h1>
				<!-- <p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">
					Welcome to this comprehensive guide. This section introduces the main concepts
					and provides an overview of what you'll learn.
				</p>
				<p style="line-height: 1.6; margin-bottom: 20px;">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
					nostrud exercitation ullamco laboris.
				</p>
				<div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h3>Key Points:</h3>
					<ul>
						<li>Understanding the fundamentals</li>
						<li>Setting up your environment</li>
						<li>Best practices and conventions</li>
					</ul>
				</div> -->
			</section>

			<section id="getting-started" style="min-height: 5vh; padding: 40px 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 8px; margin-bottom: 20px;">
				<LongReadTarget
					container-id="getting-started"
					title="Getting Started"
					:meta-data="{ difficulty: 'beginner', estimatedTime: '10 minutes' }"
				/>
				<!-- <h1 style="font-size: 3rem; margin-bottom: 20px;">Getting Started</h1>
				<p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">
					Now that you understand the basics, let's dive into the practical implementation.
					This section will guide you through the initial setup process.
				</p>
				<h3 style="margin: 30px 0 15px 0;">Installation</h3>
				<div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace;">
					<code>npm install @limbo-works/long-read</code>
				</div>
				<h3 style="margin: 30px 0 15px 0;">Basic Configuration</h3>
				<p style="line-height: 1.6; margin-bottom: 20px;">
					Follow these steps to configure your project. The process is straightforward
					and should take only a few minutes to complete.
				</p> -->
			</section>

			<section id="advanced-features" style="min-height: 50vh; padding: 40px 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border-radius: 8px; margin-bottom: 20px;">
				<LongReadTarget
					container-id="advanced-features"
					title="Advanced Features"
					:meta-data="{ difficulty: 'intermediate', estimatedTime: '15 minutes' }"
				/>
				<h1 style="font-size: 3rem; margin-bottom: 20px;">Advanced Features</h1>
				<p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">
					Explore the more sophisticated capabilities available in this system.
					These features provide enhanced functionality for power users.
				</p>
				<h3 style="margin: 30px 0 15px 0;">Custom Styling</h3>
				<p style="line-height: 1.6; margin-bottom: 20px;">
					You can customize the appearance to match your design requirements.
					The component system is flexible and supports various styling approaches.
				</p>
				<h3 style="margin: 30px 0 15px 0;">Event Handling</h3>
				<p style="line-height: 1.6; margin-bottom: 20px;">
					Advanced event handling allows you to respond to user interactions
					and create dynamic, interactive experiences.
				</p>
			</section>

			<section id="troubleshooting" style="min-height: 100vh; padding: 40px 20px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: #333; border-radius: 8px; margin-bottom: 20px;">
				<LongReadTarget
					container-id="troubleshooting"
					title="Troubleshooting"
					:meta-data="{ difficulty: 'intermediate', estimatedTime: '8 minutes' }"
				/>
				<h1 style="font-size: 3rem; margin-bottom: 20px;">Troubleshooting</h1>
				<p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">
					Common issues and their solutions. This section helps you resolve
					problems you might encounter during implementation.
				</p>
				<div style="background: rgba(255,255,255,0.3); padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h3>Common Issues:</h3>
					<ul>
						<li><strong>Performance:</strong> Optimize scroll event handling</li>
						<li><strong>Compatibility:</strong> Ensure proper Vue 3 setup</li>
						<li><strong>Styling:</strong> Check CSS specificity conflicts</li>
					</ul>
				</div>
			</section>

			<section id="conclusion" style="min-height: 75vh; padding: 40px 20px; background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%); color: #333; border-radius: 8px;">
				<LongReadTarget
					container-id="conclusion"
					title="Conclusion"
					:meta-data="{ difficulty: 'beginner', estimatedTime: '3 minutes' }"
				/>
				<h1 style="font-size: 3rem; margin-bottom: 20px;">Conclusion</h1>
				<p style="font-size: 1.2rem; line-height: 1.6; margin-bottom: 20px;">
					Congratulations! You've completed this comprehensive guide.
					You should now have a solid understanding of all the concepts covered.
				</p>
				<p style="line-height: 1.6; margin-bottom: 20px;">
					The knowledge you've gained here will serve as a foundation for
					more advanced topics and real-world implementations.
				</p>
				<div style="background: rgba(0,0,0,0.1); padding: 20px; border-radius: 8px; margin: 20px 0;">
					<h3>Next Steps:</h3>
					<ul>
						<li>Practice with your own projects</li>
						<li>Explore advanced customization options</li>
						<li>Join the community for support and updates</li>
					</ul>
				</div>
			</section>
		</div>
		<div style="height: 100vh; padding:80px;">this be the undubious doubleuioius footer</div>

	</div>
</template>
