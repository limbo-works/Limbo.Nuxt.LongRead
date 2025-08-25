# Limbo Nuxt Long Read

A Vue 3/Nuxt 3 component for creating table of contents with automatic scroll tracking and smooth navigation for long-form content.

## Features

- 🎯 **Automatic Active Section Detection** - Tracks which section is currently most visible
- 📍 **Smooth Scroll Navigation** - Click table of contents items to smoothly scroll to sections
- 👁️ **Visibility Tracking** - Calculates how much of each section is visible in the viewport
- 🔄 **Reactive Updates** - Real-time updates as users scroll through content
- ⚙️ **Configurable** - Supports custom metadata and flexible configuration

## Installation

```bash
npm install @limbo-works/long-read
```

## Basic Usage

### 1. Set up the Long Read Controller

The `LongReadController` provides the table of contents functionality:

```vue
<template>
  <LongReadController>
    <template #default="{ data, actions }">
      <nav class="table-of-contents">
        <h2>Table of Contents</h2>
        <ul>
          <li
            v-for="(target, index) in data.targets"
            :key="`toc-item-${index}`"
          >
            <a
              :href="`#${target.id}`"
              :class="{
                'active': data.activeTarget?.id === target.id
              }"
              @click.prevent="actions.scrollToTarget(target)"
            >
              {{ target.title }}
              <span class="visibility">{{ Math.round(target.visibility * 100) }}%</span>
            </a>
          </li>
        </ul>
      </nav>
    </template>
  </LongReadController>
</template>
```

### 2. Mark Content Sections

Use `LongReadTarget` to mark sections that should appear in the table of contents:

```vue
<template>
  <div>
    <!-- Section 1 -->
    <section id="introduction">
      <LongReadTarget
        container-id="introduction"
        title="Introduction"
      />
      <h1>Introduction</h1>
      <p>Your content here...</p>
    </section>

    <!-- Section 2 -->
    <section id="getting-started">
      <LongReadTarget
        container-id="getting-started"
        title="Getting Started"
        :meta-data="{ difficulty: 'beginner' }"
      />
      <h1>Getting Started</h1>
      <p>Your content here...</p>
    </section>

    <!-- Section 3 -->
    <section id="advanced-topics">
      <LongReadTarget
        container-id="advanced-topics"
        title="Advanced Topics"
        :meta-data="{ difficulty: 'advanced' }"
      />
      <h1>Advanced Topics</h1>
      <p>Your content here...</p>
    </section>
  </div>
</template>
```

## Component API

### LongReadController

The main controller component that provides table of contents data and actions.

#### Slot Props

| Property | Type | Description |
|----------|------|-------------|
| `data` | Object | Contains `targets` array and `activeTarget` object |
| `actions` | Object | Contains `scrollToTarget` function and `update` function |

#### Data Properties

- **`data.targets`** - Array of all registered target sections
- **`data.activeTarget`** - Currently active target (most visible section)

Each target object contains:
```typescript
{
  id: string;           // The container ID
  tocItemId: string;    // Generated TOC item ID
  title: string;        // Display title
  visibility: number;   // Percentage visible (0-1)
  inViewport: boolean;  // Whether any part is visible
  aboveViewport: boolean; // Whether completely above viewport
  metaData: object;     // Custom metadata
  order: number[];      // DOM order for sorting
}
```

#### Actions

- **`actions.scrollToTarget(target, options?)`** - Smooth scroll to a target section
  - `target`: Target object from the targets array
  - `options.setHash`: Whether to update URL hash (default: true)

- **`actions.update()`** - Manually trigger visibility calculations

### LongReadTarget

Marks a content section to be included in the table of contents.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `container-id` | String | Yes | - | Unique ID for the section (should match the element's ID) |
| `title` | String | Yes | - | Display title for the table of contents |
| `disabled` | Boolean | No | `false` | Whether to exclude this target from tracking |
| `link-to-toc` | Boolean/String/Object | No | `false` | Add a "skip to TOC" link |
| `meta-data` | Object | No | `{}` | Additional data to store with the target |

## Advanced Examples

### With Custom Styling

```vue
<template>
  <LongReadController>
    <template #default="{ data, actions }">
      <aside class="toc-sidebar">
        <nav class="toc-nav">
          <h2 class="toc-title">Contents</h2>
          <ul class="toc-list">
            <li 
              v-for="(target, index) in data.targets"
              :key="`toc-${target.id}`"
              class="toc-item"
            >
              <a
                :href="`#${target.id}`"
                :class="[
                  'toc-link',
                  {
                    'toc-link--active': data.activeTarget?.id === target.id,
                    'toc-link--difficulty-advanced': target.metaData?.difficulty === 'advanced'
                  }
                ]"
                @click.prevent="actions.scrollToTarget(target)"
              >
                <span class="toc-link__title">{{ target.title }}</span>
                <span class="toc-link__progress">
                  {{ Math.round(target.visibility * 100) }}%
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </template>
  </LongReadController>
</template>

<style scoped>
.toc-sidebar {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  max-height: 80vh;
  overflow-y: auto;
}

.toc-link {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.toc-link--active {
  background-color: #3b82f6;
  color: white;
  font-weight: 600;
}

.toc-link--difficulty-advanced {
  border-left: 3px solid #ef4444;
}
</style>
```

### With Section Filtering

```vue
<script setup>
import { computed } from 'vue';

const filterDifficulty = ref('all');

const filteredTargets = computed((data) => {
  if (filterDifficulty.value === 'all') {
    return data.targets;
  }
  return data.targets.filter(target => 
    target.metaData?.difficulty === filterDifficulty.value
  );
});
</script>

<template>
  <LongReadController>
    <template #default="{ data, actions }">
      <nav class="filtered-toc">
        <!-- Filter Controls -->
        <div class="toc-filters">
          <button 
            @click="filterDifficulty = 'all'"
            :class="{ active: filterDifficulty === 'all' }"
          >
            All Sections
          </button>
          <button 
            @click="filterDifficulty = 'beginner'"
            :class="{ active: filterDifficulty === 'beginner' }"
          >
            Beginner
          </button>
          <button 
            @click="filterDifficulty = 'advanced'"
            :class="{ active: filterDifficulty === 'advanced' }"
          >
            Advanced
          </button>
        </div>

        <!-- Filtered TOC -->
        <ul class="toc-list">
          <li v-for="target in filteredTargets(data)" :key="target.id">
            <a
              :href="`#${target.id}`"
              :class="{ active: data.activeTarget?.id === target.id }"
              @click.prevent="actions.scrollToTarget(target)"
            >
              {{ target.title }}
            </a>
          </li>
        </ul>
      </nav>
    </template>
  </LongReadController>
</template>
```

## Browser Support

- Vue 3.x
- Nuxt 3.x
- Modern browsers with Intersection Observer support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
