'use client';
import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const taxas = [2.45, 2.99, 3.27];

function calcularParcelas(valorVenda: number, taxaMensal: number) {
  const taxaDiaria = (taxaMensal / 100) / 30;
  const valorParcela = valorVenda / 12;
  return Array.from({ length: 12 }, (_, i) => {
    const numero = i + 1;
    const dias = numero * 30;
    const taxaEfetiva = taxaDiaria * dias;
    const valorLiquido = valorParcela * (1 - taxaEfetiva);
    return {
      numero,
      dias,
      taxaEfetiva: taxaEfetiva * 100,
      valorBruto: valorParcela,
      valorLiquido,
    };
  });
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Home() {
  const [valorTexto, setValorTexto] = useState('');
  const [valorVenda, setValorVenda] = useState(0);

  const comparativo = taxas.map((taxa) => {
    const parcelas = calcularParcelas(valorVenda, taxa);
    const totalLiquido = parcelas.reduce((acc, p) => acc + p.valorLiquido, 0);
    const custoTotal = valorVenda - totalLiquido;
    return { taxa, parcelas, totalLiquido, custoTotal };
  });

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const number = parseFloat(raw) / 100;
    setValorVenda(number);
    setValorTexto(formatCurrency(number));
  };

  const copiarValores = () => {
    const texto = comparativo.map(c =>
      `Taxa: ${c.taxa}%\nReceberá: ${formatCurrency(c.totalLiquido)}\nCusto: ${formatCurrency(c.custoTotal)}`
    ).join('\n\n');
    navigator.clipboard.writeText(texto);
    alert('Valores copiados!');
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Comparativo de Antecipação', 14, 14);
    comparativo.forEach((c, i) => {
      autoTable(doc, {
        startY: 20 + (i * 80),
        head: [[
          `Taxa: ${c.taxa}%`,
          'Dias',
          'Taxa Efetiva (%)',
          'Bruto',
          'Líquido'
        ]],
        body: c.parcelas.map(p => [
          `${p.numero}x`,
          p.dias,
          p.taxaEfetiva.toFixed(2),
          formatCurrency(p.valorBruto),
          formatCurrency(p.valorLiquido)
        ])
      });
    });
    doc.save('antecipacao.pdf');
  };

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Comparativo de Antecipação</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          Valor da Venda:
          <input
            type="text"
            inputMode="numeric"
            className="w-full p-2 border rounded"
            value={valorTexto}
            onChange={handleValorChange}
            placeholder="R$ 0,00"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={copiarValores}>Copiar Valores</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={exportarPDF}>Exportar PDF</button>
      </div>

      {valorVenda > 0 && (
        <div className="overflow-auto mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparativo.map((c) => (
            <div key={c.taxa} className="border rounded p-3 shadow bg-white">
              <h2 className="text-lg font-semibold mb-2 text-center">Taxa {c.taxa}%</h2>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2 border">Parc.</th>
                    <th className="p-2 border">Dias</th>
                    <th className="p-2 border">Efetiva</th>
                    <th className="p-2 border">Líquido</th>
                  </tr>
                </thead>
                <tbody>
                  {c.parcelas.map(p => (
                    <tr key={p.numero}>
                      <td className="p-2 border">{p.numero}x</td>
                      <td className="p-2 border">{p.dias}</td>
                      <td className="p-2 border">{p.taxaEfetiva.toFixed(2)}%</td>
                      <td className="p-2 border">{formatCurrency(p.valorLiquido)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 text-sm">
                <p><strong>Total:</strong> {formatCurrency(c.totalLiquido)}</p>
                <p><strong>Custo:</strong> {formatCurrency(c.custoTotal)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
