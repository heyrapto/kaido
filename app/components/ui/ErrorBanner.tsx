export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="col-span-full py-4 text-[12px] text-[color:var(--taken)]">
      {message}
    </div>
  );
}
