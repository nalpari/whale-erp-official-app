"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tooltip } from "react-tooltip";
import { useUpdateContractHeader } from "@/hooks/queries/use-contract-queries";
import { getErrorMessage } from "@/lib/api";
import type { ContractDetail as ContractDetailType } from "@/types/contract";
import type {
  ContractClassificationType,
  SalaryCycle,
  SalaryMonth,
} from "@/types/contract";

interface ContractEditInfoProps {
  initialData?: ContractDetailType;
}

const JOB_DESCRIPTION_OPTIONS = [
  "메뉴조리",
  "홀서빙",
  "고객응대",
  "업무보조",
  "매장청소",
  "직접입력",
];

const CONTRACT_CLASSIFICATION_OPTIONS: {
  value: ContractClassificationType;
  label: string;
}[] = [
  { value: "CNTCFWK_001", label: "포괄임금" },
  { value: "CNTCFWK_002", label: "비포괄임금" },
  { value: "CNTCFWK_003", label: "파트타임" },
];

const SALARY_CYCLE_OPTIONS: { value: SalaryCycle; label: string }[] = [
  { value: "SLRCC_001", label: "월급" },
  { value: "SLRCC_002", label: "시급" },
];

const SALARY_MONTH_OPTIONS: { value: SalaryMonth; label: string }[] = [
  { value: "SLRCF_001", label: "당월" },
  { value: "SLRCF_002", label: "익월" },
];

const SALARY_DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => i + 1);

function formatDateInput(dateStr?: string) {
  if (!dateStr) return "";
  return dateStr.slice(0, 10).replace(/-/g, ".");
}

function parseDateInput(value: string) {
  return value.replace(/\./g, "-");
}

function getSelectedJobDescriptions(jobDescription: string): string[] {
  if (!jobDescription) return [];
  return jobDescription
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildJobDescription(selected: string[], customText: string): string {
  const withoutCustom = selected.filter((s) => s !== "직접입력");
  const parts = [...withoutCustom];
  if (selected.includes("직접입력") && customText.trim()) {
    parts.push(customText.trim());
  }
  return parts.join(", ");
}

export default function ContractEditInfo({ initialData }: ContractEditInfoProps) {
  const router = useRouter();
  const header = initialData?.employmentContractHeader;

  const initialJobDescriptions = header?.jobDescription
    ? getSelectedJobDescriptions(header.jobDescription)
    : [];
  const predefinedOptions = JOB_DESCRIPTION_OPTIONS.filter(
    (o) => o !== "직접입력"
  );
  const selectedPredefined = initialJobDescriptions.filter((d) =>
    predefinedOptions.includes(d)
  );
  const customJobText = initialJobDescriptions
    .filter((d) => !JOB_DESCRIPTION_OPTIONS.includes(d))
    .join(", ");
  const hasCustom =
    customJobText.length > 0 ||
    initialJobDescriptions.includes("직접입력");

  const [hasContractPeriod, setHasContractPeriod] = useState(true);
  const [contractStartDate, setContractStartDate] = useState(
    formatDateInput(header?.contractStartDate)
  );
  const [contractEndDate, setContractEndDate] = useState(
    formatDateInput(header?.contractEndDate)
  );
  const [selectedJobs, setSelectedJobs] = useState<string[]>([
    ...selectedPredefined,
    ...(hasCustom ? ["직접입력"] : []),
  ]);
  const [customJobDescription, setCustomJobDescription] =
    useState(customJobText);
  const [contractClassification, setContractClassification] =
    useState<ContractClassificationType>(
      header?.contractClassification ?? "CNTCFWK_001"
    );
  const [nationalPensionEnrolled, setNationalPensionEnrolled] = useState(
    header?.nationalPensionEnrolled ?? false
  );
  const [healthInsuranceEnrolled, setHealthInsuranceEnrolled] = useState(
    header?.healthInsuranceEnrolled ?? false
  );
  const [employmentInsuranceEnrolled, setEmploymentInsuranceEnrolled] =
    useState(header?.employmentInsuranceEnrolled ?? false);
  const [workersCompensationEnrolled, setWorkersCompensationEnrolled] =
    useState(header?.workersCompensationEnrolled ?? false);
  const [salaryCycle, setSalaryCycle] = useState<SalaryCycle>(
    header?.salaryCycle ?? "SLRCC_001"
  );
  const [salaryMonth, setSalaryMonth] = useState<SalaryMonth>(
    header?.salaryMonth ?? "SLRCF_001"
  );
  const [salaryDay, setSalaryDay] = useState<number>(header?.salaryDay ?? 15);
  const [contractDate] = useState(formatDateInput(header?.contractDate));

  const [workContractFile, setWorkContractFile] = useState<File | null>(null);
  const [wageContractFile, setWageContractFile] = useState<File | null>(null);

  const updateMutation = useUpdateContractHeader();

  const toggleJob = (job: string) => {
    setSelectedJobs((prev) =>
      prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job]
    );
  };

  const handleSave = async () => {
    if (!header?.id || !initialData?.id) {
      alert("계약 정보를 불러오지 못했습니다.");
      return;
    }

    const jobDescription = buildJobDescription(selectedJobs, customJobDescription);

    try {
      await updateMutation.mutateAsync({
        id: initialData.id,
        data: {
          headerId: header.id,
          contractType: header.contractType,
          electronicContractStatus: header.electronicContractStatus,
          contractClassification,
          nationalPensionEnrolled,
          healthInsuranceEnrolled,
          employmentInsuranceEnrolled,
          workersCompensationEnrolled,
          salaryCycle,
          salaryMonth,
          salaryDay,
          contractStartDate: hasContractPeriod
            ? parseDateInput(contractStartDate)
            : "",
          contractEndDate: hasContractPeriod
            ? parseDateInput(contractEndDate)
            : "",
          contractDate: parseDateInput(contractDate),
          jobDescription,
          workContractFileId: header.workContractFile?.id,
          wageContractFileId: header.wageContractFile?.id,
        },
        workContractFile: workContractFile ?? undefined,
        wageContractFile: wageContractFile ?? undefined,
      });
      alert("저장되었습니다.");
      router.back();
    } catch (error) {
      alert(getErrorMessage(error, "저장에 실패했습니다."));
    }
  };

  return (
    <>
      <div className="container sub">
        <div className="sub-content-body">
          <div className="sub-cont-wrap">
            <div className="sub-cont-item-wrap">
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    직원명 <span className="imp">*</span>
                  </div>
                  <div className="block mb8">
                    <button className="btn-form block grey">
                      이전 계약정보 불러오기
                    </button>
                  </div>
                  <div className="block">
                    <select className="select-form" disabled>
                      <option value="">
                        {initialData?.employeeInfoName ?? "-"}
                      </option>
                    </select>
                  </div>
                  {initialData?.member?.loginId && (
                    <div className="s-txt mt10">{initialData.member.loginId}</div>
                  )}
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    계약기간 <span className="imp">*</span>
                  </div>
                  <div className="flex g8 mb8">
                    <button
                      className={`radio-btn block blue${hasContractPeriod ? " act" : ""}`}
                      onClick={() => setHasContractPeriod(true)}
                    >
                      계약기간 있음
                    </button>
                    <button
                      className={`radio-btn block blue${!hasContractPeriod ? " act" : ""}`}
                      onClick={() => setHasContractPeriod(false)}
                    >
                      계약기간 미정
                    </button>
                  </div>
                  {hasContractPeriod && (
                    <div className="flex g6">
                      <div className="date-picker-custom">
                        <input
                          type="text"
                          className="date-picker-input"
                          value={contractStartDate}
                          onChange={(e) =>
                            setContractStartDate(e.target.value)
                          }
                          placeholder="YYYY.MM.DD"
                        />
                      </div>
                      <span>~</span>
                      <div className="date-picker-custom">
                        <input
                          type="text"
                          className="date-picker-input"
                          value={contractEndDate}
                          onChange={(e) => setContractEndDate(e.target.value)}
                          placeholder="YYYY.MM.DD"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    업무내용 <span className="imp">*</span>
                  </div>
                  <div className="radio-btn-grid">
                    {JOB_DESCRIPTION_OPTIONS.map((job) => (
                      <button
                        key={job}
                        className={`radio-btn block blue${selectedJobs.includes(job) ? " act" : ""}`}
                        onClick={() => toggleJob(job)}
                      >
                        {job}
                      </button>
                    ))}
                  </div>
                  {selectedJobs.includes("직접입력") && (
                    <div className="block">
                      <textarea
                        className="textarea-form"
                        placeholder="업무 내용을 직접 입력해주세요."
                        value={customJobDescription}
                        onChange={(e) =>
                          setCustomJobDescription(e.target.value)
                        }
                      ></textarea>
                    </div>
                  )}
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">
                      계약분류<span className="imp">*</span>
                    </div>
                    <div className="auto-right">
                      <button className="tooltip-btn">
                        <span
                          className="tooltip-icon"
                          id="tooltip-btn-anchor"
                        ></span>
                        <Tooltip
                          className="tooltip-txt"
                          anchorSelect="#tooltip-btn-anchor"
                          opacity={1}
                        >
                          <div>tooltip text</div>
                        </Tooltip>
                      </button>
                    </div>
                  </div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={contractClassification}
                      onChange={(e) =>
                        setContractClassification(
                          e.target.value as ContractClassificationType
                        )
                      }
                    >
                      {CONTRACT_CLASSIFICATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="filed-tit">
                    4대보험 가입여부<span className="imp"> *</span>
                  </div>
                  <div className="flex g8">
                    <button
                      className={`radio-btn block blue${healthInsuranceEnrolled && nationalPensionEnrolled ? " act" : ""}`}
                      onClick={() => {
                        const next = !(
                          healthInsuranceEnrolled && nationalPensionEnrolled
                        );
                        setHealthInsuranceEnrolled(next);
                        setNationalPensionEnrolled(next);
                      }}
                    >
                      건강보험, 국민연금
                    </button>
                    <button
                      className={`radio-btn block blue${employmentInsuranceEnrolled && workersCompensationEnrolled ? " act" : ""}`}
                      onClick={() => {
                        const next = !(
                          employmentInsuranceEnrolled &&
                          workersCompensationEnrolled
                        );
                        setEmploymentInsuranceEnrolled(next);
                        setWorkersCompensationEnrolled(next);
                      }}
                    >
                      고용보험, 산재보험
                    </button>
                  </div>
                  <div className="s-txt mt10">
                    ※ 적용할 항목 체크 시 급여에 반영됩니다.
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">
                      급여 지급일 <span className="imp"> *</span>
                    </div>
                  </div>
                  <div className="block mb8">
                    <select
                      className="select-form"
                      value={salaryCycle}
                      onChange={(e) =>
                        setSalaryCycle(e.target.value as SalaryCycle)
                      }
                    >
                      {SALARY_CYCLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="block mb8">
                    <select
                      className="select-form"
                      value={salaryMonth}
                      onChange={(e) =>
                        setSalaryMonth(e.target.value as SalaryMonth)
                      }
                    >
                      {SALARY_MONTH_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="block">
                    <select
                      className="select-form"
                      value={salaryDay}
                      onChange={(e) => setSalaryDay(Number(e.target.value))}
                    >
                      {SALARY_DAY_OPTIONS.map((day) => (
                        <option key={day} value={day}>
                          {day}일
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="s-txt mt10">
                    ※ 31일로 설정 시, 급여일은 매월 말일 적용됩니다.
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">
                      계약일 <span className="imp"> *</span>
                    </div>
                  </div>
                  <div className="block mb8">
                    <div className="date-picker-custom">
                      <input
                        type="text"
                        className="date-picker-input"
                        value={contractDate}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">
                      근로계약서 <span className="imp"> *</span>
                    </div>
                  </div>
                  <div className="block mb10">
                    <div className="file-btn">
                      <input
                        type="file"
                        id="work-contract-file-input"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          setWorkContractFile(e.target.files?.[0] ?? null)
                        }
                      />
                      <label
                        className="btn-form block grey"
                        htmlFor="work-contract-file-input"
                      >
                        <i className="file-icon"></i>
                        <span>파일찾기</span>
                      </label>
                    </div>
                  </div>
                  <div className="store-img-list">
                    {workContractFile ? (
                      <div className="store-img-bx">
                        <div className="store-img-tit">
                          <span className="img-tit">
                            {workContractFile.name.replace(/\.[^.]+$/, "")}
                          </span>
                          <span>
                            {workContractFile.name.match(/\.[^.]+$/)?.[0] ?? ""}
                          </span>
                        </div>
                        <div className="store-img-btn-wrap">
                          <button
                            className="img-delete"
                            onClick={() => setWorkContractFile(null)}
                          ></button>
                        </div>
                      </div>
                    ) : header?.workContractFile ? (
                      <div className="store-img-bx">
                        <div className="store-img-tit">
                          <span className="img-tit">
                            {header.workContractFile.fileName.replace(
                              /\.[^.]+$/,
                              ""
                            )}
                          </span>
                          <span>
                            {header.workContractFile.fileName.match(
                              /\.[^.]+$/
                            )?.[0] ?? ""}
                          </span>
                        </div>
                        <div className="store-img-btn-wrap">
                          <button className="img-delete"></button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="filed-guide">
                    <span>
                      등록가능한 파일 문서파일(PDF), 이미지파일 (PNG,JPG, JPEG)
                    </span>
                  </div>
                </div>
              </div>
              <div className="sub-item-bx">
                <div className="data-filed">
                  <div className="tit-head">
                    <div className="filed-tit">
                      임금계약서 <span className="imp"> *</span>
                    </div>
                  </div>
                  <div className="block mb10">
                    <div className="file-btn">
                      <input
                        type="file"
                        id="wage-contract-file-input"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) =>
                          setWageContractFile(e.target.files?.[0] ?? null)
                        }
                      />
                      <label
                        className="btn-form block grey"
                        htmlFor="wage-contract-file-input"
                      >
                        <i className="file-icon"></i>
                        <span>파일찾기</span>
                      </label>
                    </div>
                  </div>
                  <div className="store-img-list">
                    {wageContractFile ? (
                      <div className="store-img-bx">
                        <div className="store-img-tit">
                          <span className="img-tit">
                            {wageContractFile.name.replace(/\.[^.]+$/, "")}
                          </span>
                          <span>
                            {wageContractFile.name.match(/\.[^.]+$/)?.[0] ?? ""}
                          </span>
                        </div>
                        <div className="store-img-btn-wrap">
                          <button
                            className="img-delete"
                            onClick={() => setWageContractFile(null)}
                          ></button>
                        </div>
                      </div>
                    ) : header?.wageContractFile ? (
                      <div className="store-img-bx">
                        <div className="store-img-tit">
                          <span className="img-tit">
                            {header.wageContractFile.fileName.replace(
                              /\.[^.]+$/,
                              ""
                            )}
                          </span>
                          <span>
                            {header.wageContractFile.fileName.match(
                              /\.[^.]+$/
                            )?.[0] ?? ""}
                          </span>
                        </div>
                        <div className="store-img-btn-wrap">
                          <button className="img-delete"></button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="filed-guide">
                    <span>
                      등록가능한 파일 문서파일(PDF), 이미지파일 (PNG,JPG, JPEG)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-pagination">
        <button
          className="btn-form block blue"
          onClick={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </>
  );
}
