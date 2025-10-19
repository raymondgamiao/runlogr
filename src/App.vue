<script setup>
import { db } from './firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

const testFirebase = async () => {
  const runsRef = collection(db, 'runs')
  await addDoc(runsRef, {
    date: '2025-10-19',
    distance: 4.12,
    steps: 5084,
    duration: '46:33',
    notes: 'Firebase test entry',
  })

  const snapshot = await getDocs(runsRef)
  snapshot.forEach((doc) => console.log(doc.id, doc.data()))
}

testFirebase()
</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
