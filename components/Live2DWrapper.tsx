'use client'

import dynamic from 'next/dynamic'

const Live2DCompanion = dynamic(
  () => import('@/components/Live2DCompanion'),
  { ssr: false }
)

export default function Live2DWrapper() {
  return <Live2DCompanion />
}
