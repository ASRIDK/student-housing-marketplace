export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 py-20 text-center">
      <p className="text-lg font-medium text-zinc-700">
        No apartments match your filters
      </p>
      <p className="text-sm text-zinc-500">
        Try a different city, a higher rent, or an earlier date.
      </p>
    </div>
  );
}
