export default function SkeletonPostCard() {
  return (
    <div className="animate-pulse bg-muted dark:bg-[#1e1e1e] rounded p-4 shadow-md flex flex-col gap-4">
      {/* Imagem */}
      <div className="h-44 bg-surface dark:bg-[#2a2a2a] rounded" />

      {/* Título */}
      <div className="h-6 bg-surface dark:bg-[#2a2a2a] rounded w-4/5" />

      {/* Trecho do corpo */}
      <div className="space-y-2">
        <div className="h-4 bg-surface dark:bg-[#2a2a2a] rounded w-full" />
        <div className="h-4 bg-surface dark:bg-[#2a2a2a] rounded w-5/6" />
        <div className="h-4 bg-surface dark:bg-[#2a2a2a] rounded w-3/4" />
      </div>

      {/* Rodapé (autor + data fake) */}
      <div className="flex items-center justify-between pt-2 mt-auto">
        <div className="h-4 w-24 bg-surface dark:bg-[#2a2a2a] rounded" />
        <div className="h-4 w-16 bg-surface dark:bg-[#2a2a2a] rounded" />
      </div>
    </div>
  )
}
