<template>
  <table class="uk-table uk-table-divider uk-table-hover uk-margin-top">
    <thead>
      <tr>
        <th>Date</th>
        <th>Distance (km)</th>
        <th>Steps</th>
        <th>Duration</th>
        <th>Elevation (m)</th>
        <th>Notes</th>
        <th class="uk-text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="run in runs" :key="run.id">
        <td>{{ formatDate(run.date) }}</td>
        <td>{{ formatDistance(run.distance) }}</td>
        <td>{{ formatSteps(run.steps) }}</td>
        <td>{{ formatDuration(run.duration) }}</td>
        <td>{{ formatElevation(run.elevation) }}</td>
        <td>{{ run.notes }}</td>
        <td class="uk-text-center">
          <button
            class="uk-button uk-button-default uk-button-small"
            uk-toggle="target: #edit-modal"
            @click="$emit('edit', run)"
          >
            Edit
          </button>
          <button
            class="uk-button uk-button-danger uk-button-small uk-margin-small-left"
            @click="$emit('delete', run.id)"
          >
            Delete
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { useRunsStore } from '@/stores/runStore'

defineProps({
  runs: {
    type: Array,
    default: () => [],
  },
})

function formatDate(isoString) {
  try {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return isoString
  }
}
function formatDistance(value) {
  return `${Number(value).toFixed(2)} km`
}

function formatSteps(value) {
  return Number(value).toLocaleString('en-US')
}

function formatDuration(value) {
  // Expecting HH:MM or HH:MM:SS, normalize
  const parts = value.split(':')
  return parts.length >= 2 ? `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}` : value
}

function formatElevation(value) {
  return `${Number(value).toLocaleString('en-US')} m`
}
</script>
