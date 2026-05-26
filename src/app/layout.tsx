import "./globals.css";

export const metadata = {
  title: "Product CRUD App",
  description: "Next.js MongoDB CRUD App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
