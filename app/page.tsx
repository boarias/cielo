'use client';
import { useState } from 'react';

export default function Home() {
  const [valorVenda, setValorVenda] = useState(0);
  const [taxaMensal, setTaxaMensal] = useState(2.45); // taxa de antecipação padrão
  const taxaDiaria = (taxaMensal / 100) / 30;
  const valorParcela = valorVenda / 12;

  const parcelas = Array.from({ length: 12 }, (_, i) => {
    const numero = i + 1;
    const dias = 30 * numero;
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

  const totalLiquido = parcelas.reduce((acc, p) => acc + p.valorLiquido, 0);
  const custoTotal = valorVenda - totalLiquido;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Calculadora de Antecipação Realista</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          Valor da Venda:
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={valorVenda}
            onChange={(e) => setValorVenda(parseFloat(e.target.value) || 0)}
          />
        </label>
        <label className="block">
          Taxa Mensal de Antecipação (%):
          <input
            type="number"
            step="0.01"
            className="w-full p-2 border rounded"
            value={taxaMensal}
            onChange={(e) => setTaxaMensal(parseFloat(e.target.value) || 0)}
          />
        </label>
      </div>

      {valorVenda > 0 && (
        <>
          <div className="overflow-auto">
            <table className="w-full border text-sm mt-4">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Parcela</th>
                  <th className="border p-2">Dias antecipados</th>
                  <th className="border p-2">Taxa Efetiva (%)</th>
                  <th className="border p-2">Parcela Bruta</th>
                  <th className="border p-2">Parcela Líquida</th>
                </tr>
              </thead>
              <tbody>
                {parcelas.map((p) => (
                  <tr key={p.numero}>
                    <td className="border p-2">{p.numero}</td>
                    <td className="border p-2">{p.dias}</td>
                    <td className="border p-2">{p.taxaEfetiva.toFixed(2)}</td>
                    <td className="border p-2">R$ {p.valorBruto.toFixed(2)}</td>
                    <td className="border p-2">R$ {p.valorLiquido.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-lg">
            <p><strong>Total Líquido Recebido:</strong> R$ {totalLiquido.toFixed(2)}</p>
            <p><strong>Custo da Antecipação:</strong> R$ {custoTotal.toFixed(2)}</p>
          </div>
        </>
      )}
    </main>
  );
}
