"use client";
import { formatAmount } from "@/lib/constants";
import type { ContractBonus } from "@/types/contract";

interface BonusTableProps {
  bonuses?: ContractBonus[];
  onEdit?: () => void;
}

export default function BonusTable({ bonuses, onEdit }: BonusTableProps) {
  return (
    <div className="sub-item-bx">
      <div className="pay-table-header">
        <div className="pay-table-tit">상여금</div>
        {onEdit && (
          <div className="auto-right">
            <button className="contract-arr" onClick={onEdit}></button>
          </div>
        )}
      </div>
      <table className="pay-table">
        <colgroup>
          <col />
          <col />
        </colgroup>
        <tbody>
          {bonuses && bonuses.length > 0 ? (
            bonuses.map((b, i) => (
              <tr key={b.bonusCode ?? b.id ?? i}>
                <td className="tit">{b.bonusType}</td>
                <td className="al-r">{formatAmount(b.amount ?? 0)}원</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="tit">-</td>
              <td className="al-r">0원</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
