import './globals.css'

export const metadata = {
  title: '가계부 앱',
  description: '간편한 수입/지출 관리',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
