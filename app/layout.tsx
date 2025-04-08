import '../styles/globals.css';

export const metadata = {
  title: 'Calculadora de Antecipação Realista',
  description: 'Simulação detalhada por parcela com taxa proporcional ao prazo.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-gray-50 text-gray-800">{children}</body>
    </html>
  );
}
