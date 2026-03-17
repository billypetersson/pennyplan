import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MINDEE_MODEL_ID = 'd4577820-3b4e-4394-a3a0-01108f01ad26'
const MINDEE_BASE = 'https://api-v2.mindee.net'

async function poll(jobUrl: string, apiKey: string, attempts = 20): Promise<Response> {
  for (let i = 0; i < attempts; i++) {
    await new Promise(r => setTimeout(r, 1500))
    const res = await fetch(jobUrl, {
      headers: { Authorization: apiKey },
      redirect: 'manual',
    })
    if (res.status === 302) {
      const resultUrl = res.headers.get('location')!
      return fetch(resultUrl, { headers: { Authorization: apiKey } })
    }
    if (res.status !== 200) return res
    const body = await res.json()
    if (body?.job?.status === 'Processed' && body?.job?.result_url) {
      return fetch(body.job.result_url, { headers: { Authorization: apiKey } })
    }
    if (body?.job?.status === 'Failed') throw new Error('Mindee job failed')
  }
  throw new Error('Timeout waiting for Mindee result')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { image, mimeType } = await req.json()

    if (!image) {
      return new Response(JSON.stringify({ error: 'Ingen bild uppladdad' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('MINDEE_API_KEY') ?? ''
    const imageBytes = Uint8Array.from(atob(image), c => c.charCodeAt(0))
    const blob = new Blob([imageBytes], { type: mimeType || 'image/jpeg' })

    const enqueueForm = new FormData()
    enqueueForm.append('model_id', MINDEE_MODEL_ID)
    enqueueForm.append('file', blob, 'receipt.jpg')

    const enqueueRes = await fetch(`${MINDEE_BASE}/v2/products/extraction/enqueue`, {
      method: 'POST',
      headers: { Authorization: apiKey },
      body: enqueueForm,
    })

    if (!enqueueRes.ok) {
      const err = await enqueueRes.text()
      console.error('Mindee enqueue error:', err)
      return new Response(JSON.stringify({ error: `Mindee ${enqueueRes.status}: ${err}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const enqueueData = await enqueueRes.json()
    const jobUrl = enqueueData?.job?.polling_url ?? `${MINDEE_BASE}/v2/jobs/${enqueueData?.job?.id}`

    const resultRes = await poll(jobUrl, apiKey)

    if (!resultRes.ok) {
      const err = await resultRes.text()
      console.error('Mindee result error:', err)
      return new Response(JSON.stringify({ error: 'Kunde inte läsa kvittot' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const resultData = await resultRes.json()
    console.log('Mindee result:', JSON.stringify(resultData))

    const fields = resultData?.inference?.result?.fields ?? {}

    const result = {
      amount: fields?.total_amount?.value ?? null,
      date: fields?.date?.value ?? null,
      note: fields?.supplier_name?.value ?? null,
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
