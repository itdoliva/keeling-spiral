export default function Center({ children }: { children: React.ReactNode }) {
  return (
    <article className="relative z-10 max-w-3xl mx-auto mt-6 md:mt-16 px-6 flex flex-col justify-end">
      {children}
    </article>
  )
}