<template>
  <div class="uk-container uk-margin-top">
    <h2 class="uk-heading-line"><span>Dashboard</span></h2>

    <div class="uk-child-width-1-2@m uk-grid-small uk-grid-match" uk-grid>
      <div>
        <VueDatePicker
          v-model="dateRangeFilter"
          range
          :format="`MMM d, yyyy`"
        />
      </div>
      <div>
        <button class="uk-button uk-button-primary uk-margin-left" @click="handleAnalyze">
        Analyze
      </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="uk-child-width-1-4@m uk-grid-small uk-grid-match" uk-grid>
      <div>
        <div class="uk-card uk-card-default uk-card-body uk-text-center">
          <h3 class="uk-card-title">Total Runs</h3>
          <p>{{ metrics.totalRuns || 0 }}</p>
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-default uk-card-body uk-text-center">
          <h3 class="uk-card-title">Total Distance</h3>
          <p>{{ metrics.totalDistance?.toFixed(2) || 0 }} km</p>
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-default uk-card-body uk-text-center">
          <h3 class="uk-card-title">Total Steps</h3>
          <p>{{ metrics.totalSteps?.toLocaleString() || 0 }}</p>
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-default uk-card-body uk-text-center">
          <h3 class="uk-card-title">Longest Run</h3>
          <p>{{ metrics.longestDistance?.toFixed(2) || 0 }} km</p>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="uk-grid-match uk-child-width-1-2@m uk-margin-large-top" uk-grid>
      <div>
        <div class="uk-card uk-card-default uk-card-body">
          <h4>Distance Over Time</h4>
          <line-chart :chart-data="distanceChart" />
        </div>
      </div>
      <div>
        <div class="uk-card uk-card-default uk-card-body">
          <h4>Steps Over Time</h4>
          <line-chart :chart-data="stepsChart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRunsStore } from '@/stores/runStore'
import LineChart from '@/components/LineChart.vue'
import { parseISO, eachDayOfInterval, format, startOfYear, endOfYear } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'


const store = useRunsStore()

const dateRangeFilter = ref([null, null])
const currentYear = new Date().getFullYear()

// Filter runs based on selected date range
const filteredRuns = computed(() => {
  if (!dateRangeFilter.value[0] || !dateRangeFilter.value[1]) return store.runs

  const [start, end] = dateRangeFilter.value
  return store.runs.filter((run) => {
    const runDate = parseISO(run.date)
    return runDate >= start && runDate <= end
  })
})

// Initialize date range filter to span all runs in the current year
const setDateRangeFromRuns = (runs) => {
  const runsThisYear = runs
    .map(r => parseISO(r.date))
    .filter(d => d.getFullYear() === currentYear)

  if (runsThisYear.length) {
    const minDate = runsThisYear.reduce((a, b) => (a < b ? a : b))
    const maxDate = runsThisYear.reduce((a, b) => (a > b ? a : b))
    dateRangeFilter.value = [minDate, maxDate]
  } else {
    dateRangeFilter.value = [startOfYear(new Date()), endOfYear(new Date())]
  }
}


// Metrics
const metrics = computed(() => {
  const runs = filteredRuns.value
  const totalRuns = runs.length
  const totalDistance = runs.reduce((acc, r) => acc + Number(r.distance || 0), 0)
  const totalSteps = runs.reduce((acc, r) => acc + Number(r.steps || 0), 0)
  const longestDistance = runs.reduce((max, r) => Math.max(max, Number(r.distance || 0)), 0)
  return { totalRuns, totalDistance, totalSteps, longestDistance }
})

// Generate continuous date labels
const dateRange = computed(() => {
  if (!filteredRuns.value.length) return []

  const dates = filteredRuns.value.map(r => parseISO(r.date))
  const minDate = dates.reduce((a, b) => (a < b ? a : b))
  const maxDate = dates.reduce((a, b) => (a > b ? a : b))
  return eachDayOfInterval({ start: minDate, end: maxDate })
})

// Helper: map run data to the full date range
const getChartData = (field) => {
  return dateRange.value.map((date) => {
    const run = filteredRuns.value.find(
      (r) => format(parseISO(r.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )
    return run ? Number(run[field] || 0) : 0
  })
}

const distanceChart = computed(() => ({
  labels: dateRange.value.map((d) => format(d, 'MMM d')),
  datasets: [
    {
      label: 'Distance (km)',
      data: getChartData('distance'),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
}))

const stepsChart = computed(() => ({
  labels: dateRange.value.map((d) => format(d, 'MMM d')),
  datasets: [
    {
      label: 'Steps',
      data: getChartData('steps'),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.2)',
      fill: true,
      tension: 0.3,
    },
  ],
}))


const handleAnalyze = () => {
  console.log('Analyze runs from', dateRangeFilter.value[0], 'to', dateRangeFilter.value[1])
  // Later: call ChatGPT API with filtered runs
}
onMounted(() => {
  store.initListener(),
  setDateRangeFromRuns(store.runs)
})

watch(
  () => store.runs,
  (newRuns) => setDateRangeFromRuns(newRuns),
  { deep: true }
)

</script>
