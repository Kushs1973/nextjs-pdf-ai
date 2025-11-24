export const metadata = {
  title: 'AI PDF Reader',
  description: 'Analyze documents with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#0a0a0a' }}>{children}</body>
    </html>
  )
}
