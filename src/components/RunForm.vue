<template>
  <form @submit.prevent="handleSubmit" class="uk-form-stacked uk-margin">
    <div class="uk-grid-small" uk-grid>
      <div class="uk-width-1-5@s">
        <label class="uk-form-label">Date</label>
        <VueDatePicker v-model="form.date" :is-24="false" />
      </div>

      <div class="uk-width-1-5@s">
        <label class="uk-form-label">Distance (km)</label>
        <input
          v-model.number="form.distance"
          type="number"
          step="0.01"
          min="0"
          placeholder="Distance (km)"
          class="uk-input"
          required
        />
      </div>

      <div class="uk-width-1-5@s">
        <label class="uk-form-label">Steps</label>
        <input
          v-model.number="form.steps"
          type="number"
          min="0"
          step="1"
          placeholder="Steps"
          class="uk-input"
          required
        />
      </div>

      <div class="uk-width-1-5@s uk-flex uk-flex-between">
        <div>
          <label>Hours</label>
          <input type="number" v-model.number="form.hours" min="0" max="23" class="uk-input" />
        </div>
        <div>
          <label>Minutes</label>
          <input type="number" v-model.number="form.minutes" min="0" max="59" class="uk-input" />
        </div>
      </div>

      <div class="uk-width-1-5@s">
        <label class="uk-form-label">Elevation (m)</label>
        <input
          v-model.number="form.elevation"
          type="number"
          min="0"
          step="1"
          placeholder="Elevation (m)"
          class="uk-input"
          required
        />
      </div>

      <div class="uk-width-1-1">
        <label class="uk-form-label">Notes</label>
        <textarea v-model="form.notes" class="uk-textarea" rows="2"></textarea>
      </div>

      <div class="uk-width-1-1 uk-margin-small-top">
        <button class="uk-button uk-button-primary">Add Run</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'

const emit = defineEmits(['add-run'])

const form = ref({
  date: new Date(),
  distance: '',
  steps: '',
  hours: 0,
  minutes: 0,
  duration: '', // optional, if you still need a combined value later
  elevation: '',
  notes: '',
})

const handleSubmit = () => {
  form.value.duration = duration.value
  emit('add-run', { ...form.value })

  form.value = {
    date: new Date(),
    distance: '',
    duration: '',
    steps: '',
    elevation: '',
    notes: '',
    hours: 0,
    minutes: 0,
  }
}

const duration = computed(() => {
  const hrs = form.value.hours || 0
  const mins = form.value.minutes || 0
  return `${hrs}:${mins.toString().padStart(2, '0')}`
})
</script>
