import "@/styles/global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-dvh overflow-hidden">
      <body className="antialiased font-grotesk h-full overflow-hidden text-black bg-white m-0 p-0 tracking-text">
        {children}
      </body>
    </html>
  );
}
