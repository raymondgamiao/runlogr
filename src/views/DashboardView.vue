<template>
  <div class="uk-container uk-margin-top">
    <h2 class="uk-heading-line"><span>Dashboard</span></h2>

    <div class="uk-child-width-1-2@m uk-grid-small uk-grid-match" uk-grid>
      <div>
        <VueDatePicker v-model="dateRangeFilter" range :format="`MMM d, yyyy`" />
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

  <div
    v-if="showAnalysisModal"
    class="uk-flex uk-flex-center uk-flex-middle uk-position-fixed uk-width-1-1 uk-height-1-1"
    style="background: rgba(0, 0, 0, 0.5); top: 0; left: 0; z-index: 1000"
  >
    <div
      class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-text-left"
      style="
        font-family: 'Inter', sans-serif;
        max-height: 80vh;
        overflow-y: auto;
        word-wrap: break-word;
      "
    >
      <h4>AI Analysis</h4>
      <div v-html="formattedAnalysis"></div>
      <button class="uk-button uk-button-primary uk-margin-top" @click="showAnalysisModal = false">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRunsStore } from '@/stores/runStore'
import LineChart from '@/components/LineChart.vue'
import { parseISO, eachDayOfInterval, format, startOfYear, endOfYear } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'
import axios from 'axios'
import { marked } from 'marked'

const store = useRunsStore()

const dateRangeFilter = ref([null, null])
const currentYear = new Date().getFullYear()

const showAnalysisModal = ref(false)
const analysisResult = ref('')

const formattedAnalysis = computed(() => {
  if (!analysisResult.value) return ''
  return marked.parse(analysisResult.value)
})

// Filter runs based on selected date range
const filteredRuns = computed(() => {
  if (!dateRangeFilter.value[0] || !dateRangeFilter.value[1]) return store.runs

  const [start, end] = dateRangeFilter.value
  return store.runs.filter((run) => {
    const runDate = parseISO(run.date)
    return runDate >= start && runDate <= end
  })
})

const runsWithPace = computed(() =>
  filteredRuns.value.map(r => ({
    ...r,
    pace: r.time && r.distance ? (r.time / r.distance).toFixed(2) : null
  }))
)


// Initialize date range filter to span all runs in the current year
const setDateRangeFromRuns = (runs) => {
  const runsThisYear = runs
    .map((r) => parseISO(r.date))
    .filter((d) => d.getFullYear() === currentYear)

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

  const dates = filteredRuns.value.map((r) => parseISO(r.date))
  const minDate = dates.reduce((a, b) => (a < b ? a : b))
  const maxDate = dates.reduce((a, b) => (a > b ? a : b))
  return eachDayOfInterval({ start: minDate, end: maxDate })
})

// Helper: map run data to the full date range
const getChartData = (field) => {
  return dateRange.value.map((date) => {
    const run = filteredRuns.value.find(
      (r) => format(parseISO(r.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
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

const handleAnalyze = async () => {
  if (!runsWithPace.value.length) {
    analysisResult.value = 'No runs in the selected date range.'
    return
  }

  // Prepare runs data string
  const runsData = runsWithPace.value
    .map((r) => {
      const stepsPart = r.steps ? `, ${r.steps} steps` : ''
      return `${format(parseISO(r.date), 'MMM d')}: ${r.distance} km, ${r.time}${stepsPart}`
    })
    .join('\n')

  const prompt = `
    You are an expert running coach. Analyze the user's running sessions and provide:
    1) a concise overall summary
    2) key insights on distance, pace, consistency, and trends
    3) a single clear action plan
    Respond in plain text with headings. User runs:
    ${runsData}
    `

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a running coach. Provide structured advice based on the runs.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    )

    // Groq returns an array of choices
    analysisResult.value = response.data.choices[0].message.content
    showAnalysisModal.value = true
  } catch (err) {
    console.error(err)
    analysisResult.value = 'Failed to fetch analysis. Try again.'
  }
}

onMounted(() => {
  ;(store.initListener(), setDateRangeFromRuns(store.runs))
})

watch(
  () => store.runs,
  (newRuns) => setDateRangeFromRuns(newRuns),
  { deep: true },
)
</script>
