import cn from "@/utils/cn"

type StackProps = {
  children: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>

export default function Stack({ children, className, ...props }: StackProps) {
  return (
    <div className={cn('flex flex-col', className)} {...props}>
      {children}
    </div>
  )
}