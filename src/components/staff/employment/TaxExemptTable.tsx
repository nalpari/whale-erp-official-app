"use client";
import { Tooltip } from "react-tooltip";

/** 비과세 항목 최대 금액 */
const MAX_MEAL = 200000;
const MAX_VEHICLE = 200000;
const MAX_CHILDCARE = 200000;

interface TaxExemptData {
  mealAllowance: number;
  mealIncluded: boolean;
  vehicleAllowance: number;
  vehicleIncluded: boolean;
  childcareAllowance: number;
  childcareIncluded: boolean;
}

type AmountField = "mealAllowance" | "vehicleAllowance" | "childcareAllowance";
type ToggleField = "mealIncluded" | "vehicleIncluded" | "childcareIncluded";

interface TaxExemptTableProps {
  data: TaxExemptData;
  onAmountChange: (field: AmountField, value: number) => void;
  onToggleChange: (field: ToggleField, value: boolean) => void;
  tooltipId?: string;
}

export default function TaxExemptTable({
  data,
  onAmountChange,
  onToggleChange,
  tooltipId = "tooltip-tax-exempt",
}: TaxExemptTableProps) {
  const handleAmountChange = (
    field: AmountField,
    value: string,
    max: number
  ) => {
    const v = Math.max(0, Number(value) || 0);
    onAmountChange(field, Math.min(v, max));
  };

  return (
    <div className="sub-item-bx">
      <table className="employ-table">
        <colgroup>
          <col />
          <col width="71px" />
          <col width="105px" />
        </colgroup>
        <thead>
          <tr>
            <th>
              <div className="tip-th flex g4">
                <span>비과세 항목</span>
                <button className="tooltip-btn">
                  <span
                    className="tooltip-icon"
                    id={tooltipId}
                  />
                  <Tooltip
                    className="tooltip-txt"
                    anchorSelect={`#${tooltipId}`}
                    opacity={1}
                  >
                    <div>비과세 항목은 급여에 포함 시 해당 금액만큼 비과세 처리됩니다.</div>
                  </Tooltip>
                </button>
              </div>
            </th>
            <th>급여에 포함</th>
            <th>금액(원)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="tit">식대</td>
            <td className="al-c">
              <div className="toggle-btn">
                <input
                  type="checkbox"
                  className="toggle-input"
                  id="toggle-meal"
                  checked={data.mealIncluded}
                  onChange={(e) => onToggleChange("mealIncluded", e.target.checked)}
                />
                <label className="slider" htmlFor="toggle-meal" />
              </div>
            </td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  value={data.mealAllowance || ""}
                  placeholder="0"
                  max={MAX_MEAL}
                  disabled={!data.mealIncluded}
                  onChange={(e) =>
                    handleAmountChange("mealAllowance", e.target.value, MAX_MEAL)
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="tit">자가운전보조금</td>
            <td className="al-c">
              <div className="toggle-btn">
                <input
                  type="checkbox"
                  className="toggle-input"
                  id="toggle-vehicle"
                  checked={data.vehicleIncluded}
                  onChange={(e) =>
                    onToggleChange("vehicleIncluded", e.target.checked)
                  }
                />
                <label className="slider" htmlFor="toggle-vehicle" />
              </div>
            </td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  value={data.vehicleAllowance || ""}
                  placeholder="0"
                  max={MAX_VEHICLE}
                  disabled={!data.vehicleIncluded}
                  onChange={(e) =>
                    handleAmountChange(
                      "vehicleAllowance",
                      e.target.value,
                      MAX_VEHICLE
                    )
                  }
                />
              </div>
            </td>
          </tr>
          <tr>
            <td className="tit">육아수당</td>
            <td className="al-c">
              <div className="toggle-btn">
                <input
                  type="checkbox"
                  className="toggle-input"
                  id="toggle-childcare"
                  checked={data.childcareIncluded}
                  onChange={(e) =>
                    onToggleChange("childcareIncluded", e.target.checked)
                  }
                />
                <label className="slider" htmlFor="toggle-childcare" />
              </div>
            </td>
            <td>
              <div className="block">
                <input
                  type="number"
                  className="employ-input"
                  value={data.childcareAllowance || ""}
                  placeholder="0"
                  max={MAX_CHILDCARE}
                  disabled={!data.childcareIncluded}
                  onChange={(e) =>
                    handleAmountChange(
                      "childcareAllowance",
                      e.target.value,
                      MAX_CHILDCARE
                    )
                  }
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
