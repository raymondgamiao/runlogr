<template>
  <div>
    <!-- The internal UI: show a friendly message when no run is selected -->
    <div v-if="!editedRun">
      <p class="uk-text-center uk-text-muted">Select a run to edit</p>
    </div>

    <form v-else @submit.prevent="handleUpdate">
      <div class="uk-margin">
        <label class="uk-form-label">Date</label>
        <!-- use datetime-local for quick editing; convert on save -->
        <input type="datetime-local" v-model="localDate" class="uk-input" required />
      </div>

      <div class="uk-grid-small" uk-grid>
        <div class="uk-width-1-2@s">
          <label class="uk-form-label">Distance (km)</label>
          <input
            v-model.number="editedRun.distance"
            type="number"
            step="0.01"
            class="uk-input"
            required
          />
        </div>

        <div class="uk-width-1-2@s">
          <label class="uk-form-label">Steps</label>
          <input v-model.number="editedRun.steps" type="number" class="uk-input" />
        </div>
      </div>

      <div class="uk-grid-small uk-margin-small-top" uk-grid>
        <div class="uk-width-1-2@s uk-flex uk-flex-between">
          <div>
            <label>Hours</label>
            <input
              type="number"
              v-model.number="editedRun.hours"
              min="0"
              max="23"
              class="uk-input"
            />
          </div>
          <div>
            <label>Minutes</label>
            <input
              type="number"
              v-model.number="editedRun.minutes"
              min="0"
              max="59"
              class="uk-input"
            />
          </div>
        </div>

        <div class="uk-width-1-2@s">
          <label class="uk-form-label">Elevation (m)</label>
          <input v-model.number="editedRun.elevation" type="number" class="uk-input" />
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label">Notes</label>
        <textarea v-model="editedRun.notes" class="uk-textarea" rows="2"></textarea>
      </div>

      <div class="uk-flex uk-flex-between uk-margin-top">
        <button type="button" class="uk-button uk-button-default uk-modal-close">Cancel</button>
        <button type="submit" class="uk-button uk-button-primary">Save Changes</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  run: {
    type: Object,
    default: null,
  },
})
const emit = defineEmits(['save'])

const editedRun = ref(null)
const localDate = ref('')

// When the prop changes, copy it into local state
watch(
  () => props.run,
  (newRun) => {
    if (!newRun) {
      editedRun.value = null
      localDate.value = ''
      return
    }
    // copy to avoid mutating parent object before save
    editedRun.value = { ...newRun }
    // convert ISO date (or timestamp) into datetime-local format (YYYY-MM-DDTHH:mm)
    try {
      const d = new Date(editedRun.value.date)
      localDate.value = d.toISOString().slice(0, 16) // "YYYY-MM-DDTHH:mm"
    } catch (e) {
      localDate.value = ''
    }

    // Split duration into hours/minutes
    if (editedRun.value.duration) {
      const [h, m] = editedRun.value.duration.split(':').map((n) => Number(n))
      editedRun.value.hours = h || 0
      editedRun.value.minutes = m || 0
    } else {
      editedRun.value.hours = 0
      editedRun.value.minutes = 0
    }
  },
  { immediate: true },
)

const handleUpdate = () => {
  if (!editedRun.value) return

  if (localDate.value) {
    editedRun.value.date = new Date(localDate.value).toISOString()
  }

  // Combine hours and minutes back into duration
  const hrs = editedRun.value.hours || 0
  const mins = editedRun.value.minutes || 0
  editedRun.value.duration = `${hrs}:${mins.toString().padStart(2, '0')}`

  emit('save', { ...editedRun.value })
}
</script>
