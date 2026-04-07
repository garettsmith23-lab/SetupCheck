import './globals.css';

export const metadata = {
  title: 'SetupCheck — AI Stock Review Checklist',
  description: 'IBD methodology meets AI. Get instant 5-step stock analysis with live data.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
