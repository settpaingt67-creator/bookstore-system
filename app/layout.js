import './globals.css'

export const metadata = {
  title: 'Bookstore System',
  description: 'A complete bookstore management system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}