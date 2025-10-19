<template>
  <div class="uk-container uk-margin-top">
    <h2 class="uk-heading-line"><span>My Runs</span></h2>

    <RunForm @add-run="handleAddRun" />

    <RunTable :runs="store.runs" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRunsStore } from '@/stores/runStore'

import RunForm from '@/components/RunForm.vue'
import RunTable from '@/components/RunTable.vue'

const store = useRunsStore()

function handleAddRun(runData) {
  store.addRun({
    ...runData,
    date: runData.date instanceof Date ? runData.date.toISOString() : runData.date,
  })
}

onMounted(() => {
  store.initListener()
})
</script>
