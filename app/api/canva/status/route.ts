import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('canva_access_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const jobId = req.nextUrl.searchParams.get('jobId')
  if (!jobId) {
    return NextResponse.json({ error: 'missing_job_id' }, { status: 400 })
  }

  const res = await fetch(`https://api.canva.com/rest/v1/imports/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'poll_failed' }, { status: 500 })
  }

  const { job } = await res.json()

  if (job.status === 'success') {
    const url = job.result?.design?.urls?.edit_url
    return NextResponse.json({ status: 'success', url })
  }

  if (job.status === 'failed') {
    return NextResponse.json({ status: 'failed' }, { status: 500 })
  }

  // still in_progress
  return NextResponse.json({ status: 'pending' })
}
