import { UserAccount, SocialProvider, SignupBenefitPolicy } from '../types';

const AUTH_TOKEN_KEY = 'saju_auth_token';
const CURRENT_USER_KEY = 'saju_current_user';
const ALL_ACCOUNTS_KEY = 'saju_registered_accounts_db';
const SIGNUP_BENEFIT_POLICY_KEY = 'saju_signup_benefit_policy';

// 기본 회원가입 혜택 정책 (사주 2회, 궁합 1회 즉시 지급)
export const DEFAULT_SIGNUP_BENEFIT_POLICY: SignupBenefitPolicy = {
  enabled: true,
  freeWongukCount: 2,
  freeGunghapCount: 1,
  badgeText: '3초 간편 가입 시',
};

/**
 * 현재 적용 중인 회원가입 혜택 정책 조회
 */
export function getSignupBenefitPolicy(): SignupBenefitPolicy {
  try {
    const raw = localStorage.getItem(SIGNUP_BENEFIT_POLICY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.enabled === 'boolean') {
        return {
          ...DEFAULT_SIGNUP_BENEFIT_POLICY,
          ...parsed,
        };
      }
    }
  } catch (e) {}
  return DEFAULT_SIGNUP_BENEFIT_POLICY;
}

/**
 * 회원가입 혜택 정책 업데이트 (운영 정책 동적 변경 지원)
 */
export function setSignupBenefitPolicy(policy: Partial<SignupBenefitPolicy>): SignupBenefitPolicy {
  const current = getSignupBenefitPolicy();
  const updated: SignupBenefitPolicy = {
    ...current,
    ...policy,
  };
  try {
    localStorage.setItem(SIGNUP_BENEFIT_POLICY_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

/**
 * 회원가입 혜택 요약 텍스트 생성 (동적 표현)
 * 혜택이 없거나 비활성화된 경우 null 반환
 */
export function getSignupBenefitSummary(policy: SignupBenefitPolicy = getSignupBenefitPolicy()): string | null {
  if (!policy.enabled) return null;

  const parts: string[] = [];
  if (policy.freeWongukCount > 0) {
    parts.push(`상세 사주 ${policy.freeWongukCount}회`);
  }
  if (policy.freeGunghapCount > 0) {
    parts.push(`궁합 ${policy.freeGunghapCount}회`);
  }

  if (parts.length === 0) return null;

  return `${parts.join(' · ')} 무료 혜택 즉시 제공`;
}

// 로컬 계정 데이터베이스 헬퍼 (오프라인/클라이언트 영구 보존 및 중복 방지)
const getLocalAccountsDb = (): Record<string, UserAccount> => {
  try {
    const raw = localStorage.getItem(ALL_ACCOUNTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {};
};

const saveLocalAccountsDb = (db: Record<string, UserAccount>) => {
  try {
    localStorage.setItem(ALL_ACCOUNTS_KEY, JSON.stringify(db));
  } catch (e) {}
};

/**
 * 소셜 로그인 (카카오 / 네이버)
 * 최초 이용자 -> 회원가입 처리 & 현재 정책에 따른 무료 혜택 초기화
 * 기존 이용자 -> 기존 계정 조회 & 혜택/데이터 유지
 */
export async function loginWithSocial(
  provider: SocialProvider,
  options?: {
    providerId?: string;
    name?: string;
    email?: string;
  }
): Promise<{ user: UserAccount; isNewUser: boolean; token: string }> {
  const providerId = options?.providerId || `${provider}_demo_${provider === 'kakao' ? '778899' : '112233'}`;
  const accountLookupKey = `${provider}_${providerId}`;

  // 1. 서버 API 호출 시도
  try {
    const res = await fetch('/api/auth/social-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        providerId,
        name: options?.name,
        email: options?.email,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user && data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));

        // 로컬 DB에도 백업 저장
        const db = getLocalAccountsDb();
        db[accountLookupKey] = data.user;
        saveLocalAccountsDb(db);

        return {
          user: data.user,
          isNewUser: !!data.isNewUser,
          token: data.token,
        };
      }
    }
  } catch (err) {
    console.warn('Backend auth endpoint unreachable, falling back to local client auth engine:', err);
  }

  // 2. 클라이언트 측 정밀 Fallback 인증 처리
  const db = getLocalAccountsDb();
  const existingUser = db[accountLookupKey];
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
  const timeStr = `${dateStr} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let user: UserAccount;
  let isNewUser = false;

  if (existingUser) {
    // 기존 회원
    user = {
      ...existingUser,
      lastLoginAt: timeStr,
      name: options?.name || existingUser.name,
      email: options?.email || existingUser.email,
    };
  } else {
    // 신규 회원 자동 가입 (현재 정책 기준 무료 횟수 지급)
    isNewUser = true;
    const policy = getSignupBenefitPolicy();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const newId = `${provider}_user_${randomSuffix}`;
    user = {
      id: newId,
      provider,
      providerId,
      name: options?.name || (provider === 'kakao' ? '카카오 회원' : '네이버 회원'),
      email: options?.email || (provider === 'kakao' ? `kakao_${randomSuffix}@kakao.com` : `naver_${randomSuffix}@naver.com`),
      createdAt: dateStr,
      createdAtTimestamp: Date.now(),
      lastLoginAt: timeStr,
      freeWongukCount: policy.enabled ? Math.max(0, policy.freeWongukCount) : 0,
      freeGunghapCount: policy.enabled ? Math.max(0, policy.freeGunghapCount) : 0,
    };
  }

  db[accountLookupKey] = user;
  saveLocalAccountsDb(db);

  const fallbackToken = `local_token_${user.id}_${Date.now()}`;
  localStorage.setItem(AUTH_TOKEN_KEY, fallbackToken);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  return { user, isNewUser, token: fallbackToken };
}

/**
 * 저장된 현재 로그인 유저 가져오기
 */
export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

/**
 * 저장된 인증 토큰 가져오기
 */
export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {}
  return null;
}

/**
 * 로그아웃
 */
export async function logoutUser(): Promise<void> {
  const token = getStoredToken();
  if (token) {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (e) {}
  }
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * 회원 탈퇴 (현재 계정 정보 제거)
 */
export async function withdrawUser(user: UserAccount): Promise<void> {
  await logoutUser();
  try {
    const db = getLocalAccountsDb();
    const accountLookupKey = `${user.provider}_${user.providerId}`;
    delete db[accountLookupKey];
    saveLocalAccountsDb(db);
  } catch (e) {}
}

/**
 * 무료 혜택 차감 및 저장
 */
export async function consumeFreeBenefit(
  user: UserAccount,
  type: 'saju' | 'gunghap'
): Promise<UserAccount> {
  const updatedUser: UserAccount = {
    ...user,
    freeWongukCount: type === 'saju' ? Math.max(0, user.freeWongukCount - 1) : user.freeWongukCount,
    freeGunghapCount: type === 'gunghap' ? Math.max(0, user.freeGunghapCount - 1) : user.freeGunghapCount,
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

  const db = getLocalAccountsDb();
  const accountLookupKey = `${user.provider}_${user.providerId}`;
  db[accountLookupKey] = updatedUser;
  saveLocalAccountsDb(db);

  // 서버 동기화 시도
  const token = getStoredToken();
  if (token) {
    try {
      await fetch('/api/auth/benefits/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, userId: user.id }),
      });
    } catch (e) {}
  }

  return updatedUser;
}
