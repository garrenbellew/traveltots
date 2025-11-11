'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-primary flex items-center gap-2"
      type="button"
    >
      🖨️ Print
    </button>
  )
}

