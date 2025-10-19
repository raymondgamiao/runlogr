<template>
  <div class="uk-container uk-margin-top">
    <h2 class="uk-heading-line"><span>My Runs</span></h2>

    <RunForm @add-run="handleAddRun" />
    <RunTable :runs="store.runs" @edit="setSelectedRun" @delete="handleDelete" />

    <div id="edit-modal" uk-modal="container: false">
      <div class="uk-modal-dialog uk-modal-body">
        <h2 class="uk-modal-title">Edit Run</h2>
        <RunEditModal :run="selectedRun" @save="handleEditSave" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRunsStore } from '@/stores/runStore'

import RunForm from '@/components/RunForm.vue'
import RunTable from '@/components/RunTable.vue'
import RunEditModal from '@/components/RunEditModal.vue'

const store = useRunsStore()
const selectedRun = ref(null)

onMounted(() => store.initListener())

function handleAddRun(runData) {
  store.addRun({
    ...runData,
    date: runData.date instanceof Date ? runData.date.toISOString() : runData.date,
  })
}

function handleDelete(id) {
  if (confirm('Are you sure you want to delete this run?')) store.deleteRun(id)
}

function setSelectedRun(run) {
  selectedRun.value = { ...run }
}

const handleEditSave = async (updatedRun) => {
  try {
    await store.updateRun(updatedRun.id, updatedRun)
    // Close the modal by clicking the element with uk-modal-close inside it
    const closeBtn = document.querySelector('#edit-modal .uk-modal-close')
    closeBtn.click()

    // clear selection so the form inside modal resets next time
    selectedRun.value = null
  } catch (error) {
    console.error('Error updating run:', error)
  }
}
</script>
