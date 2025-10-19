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
      </tr>
    </tbody>
  </table>
</template>

<script setup>
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
