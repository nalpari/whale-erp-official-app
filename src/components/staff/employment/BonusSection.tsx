"use client";
import type { ContractBonus } from "@/types/contract";

interface BonusSectionProps {
  bonuses: ContractBonus[];
  onOpenSheet: () => void;
  formatAmount: (val: number) => string;
}

/**
 * 상여금 섹션 -- 3가지 계약분류 모두에서 사용.
 * 바텀시트(BonusPaySheet)를 열어 상여금을 설정하고,
 * 설정된 상여금 목록을 표시한다.
 */
export default function BonusSection({
  bonuses,
  onOpenSheet,
  formatAmount,
}: BonusSectionProps) {
  return (
    <div className="sub-item-bx">
      <div className="pay-table-header">
        <div className="pay-table-tit">상여금</div>
        <div className="auto-right">
          <button
            className="contract-arr"
            onClick={onOpenSheet}
          />
        </div>
      </div>
      {bonuses.length > 0 && (
        <table className="employ-table">
          <colgroup>
            <col />
            <col width="105px" />
          </colgroup>
          <thead>
            <tr>
              <th>구분</th>
              <th>금액(원)</th>
            </tr>
          </thead>
          <tbody>
            {bonuses.map((bonus, i) => (
              <tr key={bonus.bonusCode ?? i}>
                <td className="tit">{bonus.bonusType}</td>
                <td className="al-r">
                  {formatAmount(bonus.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>상여금 합계</td>
              <td className="al-r">
                {formatAmount(bonuses.reduce((sum, b) => sum + b.amount, 0))}원
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
