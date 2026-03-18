<script setup>
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { X, ImageIcon } from 'lucide-vue-next'

const emit = defineEmits(['scanned', 'cancel'])

const scanning = ref(false)
const error = ref(null)
const dragging = ref(false)
const fileInputRef = ref(null)

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    error.value = 'Välj en bildfil (JPG, PNG eller HEIC)'
    return
  }

  scanning.value = true
  error.value = null

  try {
    const base64 = await toBase64(file)

    const { data, error: fnError } = await supabase.functions.invoke('scan-receipt', {
      body: JSON.stringify({ image: base64, mimeType: file.type }),
      headers: { 'Content-Type': 'application/json' },
    })

    if (fnError) {
      let msg = fnError.message
      try {
        const body = await fnError.context.json()
        console.error('scan-receipt error body:', body)
        msg = body?.error || msg
      } catch {}
      throw new Error(msg)
    }
    if (data?.error) throw new Error(data.error)

    emit('scanned', {
      amount: data.amount ? String(Math.round(data.amount)) : '',
      date: data.date ?? '',
      note: data.note ?? '',
    })
  } catch (err) {
    error.value = err.message || 'Något gick fel vid scanning'
  } finally {
    scanning.value = false
  }
}

function onFileInput(e) {
  const file = e.target.files?.[0]
  if (file) handleFile(file)
}

function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) handleFile(file)
}

function openFilePicker() {
  fileInputRef.value?.click()
}
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('cancel')" role="dialog" aria-modal="true" aria-label="Skanna kvitto">
      <div class="modal">
        <div class="modal__header">
          <h2 class="modal__title">Skanna kvitto</h2>
          <button class="modal__close" @click="emit('cancel')" aria-label="Stäng">
            <X :size="20" :stroke-width="2.5" />
          </button>
        </div>

        <div class="modal__body">
          <!-- Scanning state -->
          <div v-if="scanning" class="scan-loading">
            <div class="scan-spinner" aria-hidden="true"></div>
            <p class="scan-loading__text">Läser kvittot...</p>
          </div>

          <!-- Upload zone -->
          <div v-else>
            <div
              class="drop-zone"
              :class="{ 'drop-zone--active': dragging }"
              @click="openFilePicker"
              @dragover.prevent="dragging = true"
              @dragleave="dragging = false"
              @drop.prevent="onDrop"
              role="button"
              tabindex="0"
              @keydown.enter="openFilePicker"
              aria-label="Klicka eller dra en bild hit"
            >
              <div class="drop-zone__icon" aria-hidden="true">
                <ImageIcon :size="40" :stroke-width="1.5" />
              </div>
              <p class="drop-zone__text">Klicka eller dra kvitto hit</p>
              <p class="drop-zone__hint">JPG, PNG eller HEIC</p>
            </div>

            <input
              ref="fileInputRef"
              type="file"
              accept="image/*"
              class="file-input"
              @change="onFileInput"
              aria-hidden="true"
              tabindex="-1"
            />

            <p v-if="error" class="scan-error" role="alert">{{ error }}</p>

            <p class="scan-info">
              Kvittot skannas med OCR och belopp, datum och butik fylls i automatiskt. Du kan granska och justera innan det sparas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  background-color: var(--color-card);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  width: 100%;
  max-width: 480px;
  animation: slideInFromBottom 0.28s cubic-bezier(0.32, 0.72, 0, 1);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.125rem 1.25rem 0.875rem;
  border-bottom: 1px solid var(--color-border);
}

.modal__title {
  font-size: 1.0625rem;
  font-weight: 700;
}

.modal__close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s;
}

.modal__close:hover {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.modal__close svg {
  width: 18px;
  height: 18px;
}

.modal__body {
  padding: 1.5rem 1.25rem;
}

/* Drop zone */
.drop-zone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: border-color 0.15s, background-color 0.15s;
  text-align: center;
}

.drop-zone:hover,
.drop-zone--active {
  border-color: var(--color-primary);
  background-color: rgba(79, 155, 143, 0.04);
}

.drop-zone__icon {
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.drop-zone__icon svg {
  width: 40px;
  height: 40px;
}

.drop-zone--active .drop-zone__icon {
  color: var(--color-primary);
}

.drop-zone__text {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
}

.drop-zone__hint {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.file-input {
  display: none;
}

/* Loading */
.scan-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
}

.scan-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.scan-loading__text {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

/* Error & info */
.scan-error {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-danger);
  text-align: center;
}

.scan-info {
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  text-align: center;
  line-height: 1.5;
}
</style>
