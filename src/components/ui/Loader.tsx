type LoaderProps = {
  label?: string
}

export default function Loader({ label = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        <p className="mt-3 text-primary/80">{label}</p>
      </div>
    </div>
  )
}
