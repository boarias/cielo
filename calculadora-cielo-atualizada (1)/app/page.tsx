'use client';
import { useState } from 'react';

function calcularParcelamento(valor: number, taxa: number, parcelas: number) {
  const mensal = valor * Math.pow(1 + taxa, parcelas) / parcelas;
  return mensal;
}

export default function Page() {
  const [valorVenda, setValorVenda] = useState(10000);

  const simulacaoParcelas = Array.from({ length: 12 }, (_, i) => {
    const parcela = i + 1;
    const taxaMensal = parcela <= 6 ? 0.0286 : 0.0327;
    const valorParcela = calcularParcelamento(valorVenda, taxaMensal, parcela);
    const total = valorParcela * parcela;
    return {
      parcela,
      mensal: valorParcela,
      total,
      custo: total - valorVenda,
    };
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simulação de Parcelamento (sem antecipação)</h1>
      <input
        type="number"
        value={valorVenda}
        onChange={(e) => setValorVenda(parseFloat(e.target.value))}
        className="border px-2 py-1 mb-4"
        placeholder="Valor da venda"
      />
      <table className="table-auto w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th>Parcela</th>
            <th>Valor Mensal</th>
            <th>Total</th>
            <th>Custo</th>
          </tr>
        </thead>
        <tbody>
          {simulacaoParcelas.map((item) => (
            <tr key={item.parcela} className="text-center border-t">
              <td>{item.parcela}x</td>
              <td>R$ {item.mensal.toFixed(2)}</td>
              <td>R$ {item.total.toFixed(2)}</td>
              <td>R$ {item.custo.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}