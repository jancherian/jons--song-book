export function ChordText({ chord }: { chord: string }) {
  const slash = chord.indexOf('/');
  if (slash === -1) return chord;

  return (
    <>
      {chord.slice(0, slash + 1)}
      <span className="text-[var(--bass-accent)]">{chord.slice(slash + 1)}</span>
    </>
  );
}
