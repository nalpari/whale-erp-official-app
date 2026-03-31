"use client"

import Image from "next/image"
import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useLoginMutation, useAuthoritySelectMutation } from "@/hooks/queries/use-login-mutation"
import { getErrorMessage } from "@/lib/api"
import { getBpTree } from "@/lib/api/bp"
import { usePopupControler } from "@/store/usePopupControler"
import { OWNER_CODE } from "@/lib/constants"
import type { LoginResponse } from "@/types/auth"

function getSafeReturnUrl(url: string | null): string {
  if (!url || !url.startsWith("/") || url.startsWith("//")) return "/"
  return url
}

function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null
  try { return localStorage.getItem(key) } catch (err) { console.warn('[Login] localStorage 읽기 실패:', err); return null }
}

function safeSetItem(key: string, value: string) {
  try { localStorage.setItem(key, value) } catch (err) { console.warn('[Login] localStorage 저장 실패:', err) }
}

function safeRemoveItem(key: string) {
  try { localStorage.removeItem(key) } catch (err) { console.warn('[Login] localStorage 삭제 실패:', err) }
}

export default function Login() {
  const openAlert = usePopupControler((state) => state.openAlert)
  const [loginId, setLoginId] = useState(() => safeGetItem("savedLoginId") ?? "")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [saveId, setSaveId] = useState(() => !!safeGetItem("savedLoginId"))
  const [error, setError] = useState("")
  const [showAuthoritySelect, setShowAuthoritySelect] = useState(false)
  const [companies, setCompanies] = useState<NonNullable<LoginResponse["companies"]>>([])
  const [pendingTokens, setPendingTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null)
  const [pendingLoginData, setPendingLoginData] = useState<LoginResponse | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get("returnUrl")
  const reason = searchParams.get("reason")

  const loginMutation = useLoginMutation()
  const authoritySelectMutation = useAuthoritySelectMutation()

  const completeLogin = useCallback(async (data: LoginResponse, authorityId: number, programs: LoginResponse["authority"], ownerCode?: string, headOfficeId?: number) => {
    const store = useAuthStore.getState()
    store.setTokens(data.accessToken, data.refreshToken)
    store.setAffiliationId(String(authorityId))
    if (programs?.programs) {
      store.setAuthority(programs.programs)
    }
    if (ownerCode) {
      store.setOwnerCode(ownerCode)
    }
    store.setHeadOfficeId(headOfficeId ?? null)
    store.setFranchiseId(null)

    // 가맹점 권한(PRGRP_002_002)이면 bp-tree에서 가맹점 ID 조회
    if (ownerCode === OWNER_CODE.FRANCHISE && headOfficeId) {
      try {
        const bpTree = await getBpTree()
        const office = bpTree.find((o) => o.id === headOfficeId)
        if (office?.franchises?.length) {
          store.setFranchiseId(office.franchises[0].id)
        }
      } catch (err) {
        console.error('[Login] bp-tree 조회 실패:', err)
        openAlert({ message: '가맹점 정보를 불러오지 못했습니다. 다시 로그인해주세요.' })
        store.clearAuth()
        return
      }
    }

    if (data.loginId && data.name) {
      store.setUserInfo(data.loginId, data.name, data.mobilePhone ?? "", data.avatar ?? null)
    }
    if (data.passwordChangeRequired) {
      store.setPasswordChangeRequired(true)
      router.push("/changepw")
      return
    }

    if (saveId) {
      safeSetItem("savedLoginId", loginId)
    } else {
      safeRemoveItem("savedLoginId")
    }

    router.push(getSafeReturnUrl(returnUrl))
  }, [saveId, loginId, returnUrl, router, openAlert])

  const handleLogin = async () => {
    if (!loginId.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.")
      return
    }
    setError("")

    try {
      const data = await loginMutation.mutateAsync({ loginId: loginId.trim(), password })

      if (data.authority) {
        const matchedCompany = data.companies?.find((c) => c.authorityId === data.authority.authorityId)
        const headOfficeId = matchedCompany?.headOfficeId ?? data.companies?.[0]?.headOfficeId
        const ownerCode = matchedCompany?.ownerCode ?? data.authority.ownerCode
        await completeLogin(data, data.authority.authorityId, data.authority, ownerCode, headOfficeId)
        return
      }

      if (data.companies && data.companies.length > 0) {
        setCompanies(data.companies)
        setPendingTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken })
        setPendingLoginData(data)
        setShowAuthoritySelect(true)
        return
      }

      setError("로그인 권한이 없습니다.")
    } catch (err) {
      setError(getErrorMessage(err, "로그인에 실패했습니다."))
    }
  }

  const handleAuthoritySelect = async (authorityId: number) => {
    if (!pendingTokens || !pendingLoginData) return

    try {
      const result = await authoritySelectMutation.mutateAsync({
        authorityId,
        accessToken: pendingTokens.accessToken,
      })

      const selectedCompany = companies.find((c) => c.authorityId === authorityId)
      const ownerCode = result.authority?.ownerCode ?? selectedCompany?.ownerCode
      const headOfficeId = selectedCompany?.headOfficeId

      await completeLogin(
        { ...pendingLoginData, accessToken: pendingTokens.accessToken, refreshToken: pendingTokens.refreshToken },
        authorityId,
        result.authority ? { authorityId, programs: result.authority.programs, ownerCode: result.authority.ownerCode } : undefined,
        ownerCode,
        headOfficeId,
      )
      setShowAuthoritySelect(false)
    } catch (err) {
      setError(getErrorMessage(err, "권한 선택에 실패했습니다."))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  const isLoading = loginMutation.isPending || authoritySelectMutation.isPending

  return (
    <div className="login-wrap">
      <div className="login-logo-wrap">
        <div className="login-logo">
          <Image
            src="/assets/images/layout/login_logo.svg"
            alt="logo"
            width={60}
            height={60}
          />
        </div>
        <div className="logo-app-name">
          <span>WHALE ERP</span>
          <span>PARTNER OFFICE</span>
        </div>
      </div>
      <div className="login-form-wrap">
        <div className="form-tit">All in One 점포관리 플랫폼</div>
        {reason === "session_expired" && (
          <div className="login-error" style={{ color: "#dc3545", fontSize: "13px", padding: "4px 0 8px" }}>
            세션이 만료되었습니다. 다시 로그인해주세요.
          </div>
        )}
        <div className="login-form">
          <div className="id-form">
            <input
              type="text"
              className="input-frame"
              placeholder="ID"
              value={loginId}
              onChange={(e) => { setLoginId(e.target.value); setError("") }}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
          </div>
          <div className="pw-form">
            <div className="input-icon-frame">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError("") }}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={`input-icon-btn ${showPw ? "show" : "hide"}`}
                onClick={() => setShowPw(!showPw)}
              ></button>
            </div>
          </div>
          {error && (
            <div className="login-error" style={{ color: "#dc3545", fontSize: "13px", padding: "4px 0" }}>
              {error}
            </div>
          )}
          <div className="login-btn">
            <button
              className="btn-form login block"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "LOGIN"}
            </button>
          </div>
        </div>
      </div>
      <div className="login-form-check-wrap">
        <div className="toggle-wrap">
          <div className="toggle-btn">
            <input
              type="checkbox"
              id="toggle-btn"
              checked={saveId}
              onChange={(e) => setSaveId(e.target.checked)}
            />
            <label className="slider" htmlFor="toggle-btn">
              아이디 저장
            </label>
          </div>
        </div>
        <div className="auto-right">
          <div className="find-id-wrap">
            <button className="find-id-btn" onClick={() => router.push("/login/findid")}>ID 찾기</button>
            <button className="find-id-btn" onClick={() => router.push("/login/findpw")}>비밀번호 찾기</button>
          </div>
        </div>
      </div>
      <div className="another-login-wrap">
        <div className="another-login-tit">다른 로그인 방법</div>
        <div className="another-login-list">
          <button className="btn-form outline-g block">
            <i className="kakao"></i>
            <span>카카오 계정으로 회원 등록 </span>
          </button>
          <button className="btn-form outline-g block">
            <i className="naver"></i>
            <span>네이버 계정으로 회원 등록 </span>
          </button>
          <button className="btn-form outline-g block">
            <i className="google"></i>
            <span>구글 계정으로 회원 등록 </span>
          </button>
        </div>
      </div>
      <div className="login-guide">
        <span>본 서비스는 ERP 마스터 계정 또는 권한이 부여된 직원만 이용할 수 있습니다.</span>
        <span>로그인 권한이 부여된 직원만 이용할 수 있습니다.</span>
        <span>
          직원은 <b>직원용 APP 계정</b>으로 로그인하며, 카카오, 네이버, 구글
          간편 로그인을 지원합니다.
        </span>
      </div>

      {showAuthoritySelect && (
        <div className="modal-popup alert" style={{ display: "flex" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <div className="alert-frame">
                  <div className="alert-info">
                    <span>조직을 선택해주세요.</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "16px 0" }}>
                    {companies.map((company) => (
                      <button
                        key={company.authorityId}
                        className="btn-form outline min block"
                        onClick={() => handleAuthoritySelect(company.authorityId)}
                        disabled={authoritySelectMutation.isPending}
                      >
                        {company.companyName || company.brandName || `조직 ${company.authorityId}`}
                      </button>
                    ))}
                  </div>
                  <div className="alert-btn flex g8">
                    <button
                      className="btn-form black min block"
                      onClick={() => setShowAuthoritySelect(false)}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
