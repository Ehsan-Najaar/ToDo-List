import Layout from '@/components/Layout'
import '../../style/globals.css'

export const metadata = {
  title: 'Todo List',
  description: 'Todo List app',
}

export default function RootLayout({ children }) {
  return (
    <html dir="rtl" lang="fa">
      <body className="bg-bg1 bg-cover bg-no-repeat bg-center overflow-hidden">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
