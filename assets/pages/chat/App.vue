<script setup>
import { ref } from 'vue'

defineProps({
  state: { type: Object, required: true },
})

const clicks = ref(0)
</script>

<template>
  <div class="min-h-screen bg-slate-900 p-8 text-slate-100">
    <div class="mx-auto max-w-xl space-y-4">
      <div class="rounded-lg bg-emerald-500 px-4 py-3 font-semibold text-emerald-950">
        Vue mounted, Tailwind compiled.
      </div>

      <pre class="overflow-x-auto rounded-lg bg-slate-800 p-4 text-sm">{{ state }}</pre>

      <button
        class="rounded-md bg-slate-700 px-4 py-2 text-sm hover:bg-slate-600"
        @click="clicks++"
      >
        clicked {{ clicks }}
      </button>
    </div>
  </div>
</template>
