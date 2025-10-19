import { defineStore } from 'pinia'
import { db } from '@/firebase'
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore'
import { useToast } from 'vue-toastification'
const toast = useToast()

export const useRunsStore = defineStore('runs', {
  state: () => ({
    runs: [],
    loading: false,
    unsubscribe: null,
  }),

  actions: {
    initListener() {
      this.loading = true
      const q = query(collection(db, 'runs'), orderBy('date', 'desc'))

      // unsubscribe previous listener if any
      if (this.unsubscribe) this.unsubscribe()

      this.unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          this.runs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          this.loading = false
        },
        (error) => {
          console.error('Error listening to runs:', error)
          this.loading = false
        },
      )
    },

    getDashboardMetrics() {
      if (!this.runs.length) return {}

      const distances = this.runs.map(r => r.distance)
      const durations = this.runs.map(r => {
        const [h, m] = r.duration.split(':').map(Number)
        return h * 60 + m
      })
      const elevations = this.runs.map(r => r.elevation)

      const totalRuns = this.runs.length
      const totalDistance = distances.reduce((a, b) => a + b, 0)
      const totalSteps = this.runs.reduce((a, b) => a + b.steps, 0)
      const avgPace = (distances.reduce((a, d, i) => a + (durations[i] / d), 0) / totalRuns).toFixed(2) // min/km
      const totalElevation = elevations.reduce((a, b) => a + b, 0)

      // optional 4th metric: longest distance
      const longestDistance = Math.max(...distances)

      return {
        totalRuns,
        totalDistance,
        totalSteps,
        avgPace,
        totalElevation,
        longestDistance
      }
    },

    getDistanceChartData() {
      const sortedRuns = [...this.runs].sort((a, b) => new Date(a.date) - new Date(b.date))
      return {
        labels: sortedRuns.map(r => new Date(r.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Distance (km)',
            data: sortedRuns.map(r => r.distance),
            borderColor: '#4CAF50',
            fill: false
          }
        ]
      }
    },

    getStepsChartData() {
      const sortedRuns = [...this.runs].sort((a, b) => new Date(a.date) - new Date(b.date))
      return {
        labels: sortedRuns.map(r => new Date(r.date).toLocaleDateString()),
        datasets: [
          {
            label: 'Steps',
            data: sortedRuns.map(r => r.steps),
            borderColor: '#2196F3',
            fill: false
          }
        ]
      }
    },

    async addRun(newRun) {
      const toast = useToast()
      try {
        await addDoc(collection(db, 'runs'), newRun)
        toast.success('Run added successfully!')
      } catch (error) {
        console.error('Error adding run:', error)
        toast.error('Failed to add run.')
      }
    },

    async updateRun(id, updatedData) {
      const toast = useToast()
      try {
        const runRef = doc(db, 'runs', id)
        await updateDoc(runRef, updatedData)
        toast.success('Run updated successfully!')
      } catch (err) {
        console.error(err)
        toast.error('Error updating run')
      }
    },

    async deleteRun(id) {
      const toast = useToast()
      try {
        await deleteDoc(doc(db, 'runs', id))
        toast.success('Run deleted successfully!')
      } catch (err) {
        console.error(err)
        toast.error('Error deleting run')
      }
    },

    stopListener() {
      if (this.unsubscribe) this.unsubscribe()
    },
  },
})
