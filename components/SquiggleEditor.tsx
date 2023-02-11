import React from "react"

import dynamic from "next/dynamic"
import { SquiggleEditorProps } from "@quri/squiggle-components/dist/src/components/SquiggleEditor"

const SquiggleEditor = dynamic(
  () => import("@quri/squiggle-components").then((mod) => mod.SquiggleEditor),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
)

export function DynamicSquiggleEditor(props: SquiggleEditorProps) {
  return (
    <SquiggleEditor
      {...props}
    />
  )
}