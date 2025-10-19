<template>
  <div>
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend } from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Tooltip, Legend)

const props = defineProps({
  chartData: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    default: () => ({
      responsive: true,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: false,
          text: 'Chart'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    })
  }
})

const canvas = ref(null)
let chartInstance = null

onMounted(() => {
  if (canvas.value) {
    chartInstance = new Chart(canvas.value.getContext('2d'), {
      type: 'line',
      data: props.chartData,
      options: props.options
    })
  }
})

// update chart when data changes
watch(
  () => props.chartData,
  (newData) => {
    if (chartInstance) {
      chartInstance.data = newData
      chartInstance.update()
    }
  },
  { deep: true }
)
</script>
