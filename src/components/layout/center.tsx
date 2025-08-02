import cn from "@/utils/cn"

type CenterProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export default function Center({ children, className, ...props }: CenterProps) {
  return (
    <article className={cn("max-w-3xl mx-auto", className)}>
      {children}
    </article>
  )
}