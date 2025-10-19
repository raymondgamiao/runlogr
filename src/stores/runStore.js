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
