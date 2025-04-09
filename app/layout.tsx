import './globals.css'
import { Poppins } from 'next/font/google'
import UseSessionProvider from './providers/UseSessionProvider';
import QueryProvider from './providers/QueryProvider';

const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ['latin'],
})



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={poppins.className}>
      <QueryProvider>
        <UseSessionProvider>
          <body >{children}</body>
        </UseSessionProvider>
      </QueryProvider>
    </html>
  );
}
