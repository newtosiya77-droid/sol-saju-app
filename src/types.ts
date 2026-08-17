export interface SajuInput {
  name?: string;
  gender: 'female' | 'male';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: string; // e.g., '14:35 (미시)' or '모름'
  birthHourNum?: number; // 0~23
  birthMinuteNum?: number; // 0~59
  calendarType: 'solar' | 'lunar' | 'lunar-leap' | string;
  isUnknownTime?: boolean;
  useYajasi?: boolean;
  jasiOption?: 'yaja' | 'jo'; // 'yaja': 야자시(23:00~23:59), 'jo': 조자시(00:00~00:59)
  birthCity?: string; // e.g., '대한민국 경기도 수원시'
  birthLongitude?: number; // e.g., 127.01
  applySolarCorrection?: boolean;
}

export interface WonGukPillar {
  title: string; // 년주, 월주, 일주, 시주
  stem: string; // 천간 (e.g., 갑, 을, 병...)
  stemHanja: string; // 甲, 乙, 丙...
  branch: string; // 지지 (e.g., 자, 축, 인...)
  branchHanja: string; // 子, 丑, 寅...
  elementStem: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  elementBranch: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  tenGodStem: string; // 비견, 겁재, 식신...
  tenGodBranch: string;
  sinsal?: string; // 도화살, 화개살, 역마살...
}

export interface SajuAnalysisResult {
  matchPercentage: number;
  celebName: string;
  celebOccupation: string;
  celebCategory: string; // 아이돌, 배우, 인플루언서 등
  celebGender: 'female' | 'male';
  celebAgeGroup: string; // "20대" or "30대"
  sajuPoints: [string, string, string];
  summary: string;
  dayMaster: {
    stem: string;
    hanja: string;
    elementName: string;
    description: string;
  };
  dominantTenGod: string; // 주격 십성
  keySinsal: string[]; // 주요 신살
  wonGuk: {
    yearPillar: WonGukPillar;
    monthPillar: WonGukPillar;
    dayPillar: WonGukPillar;
    hourPillar: WonGukPillar;
  };
  isUnknownTime?: boolean;
}

export interface SavedSajuItem {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthTime: string;
  birthHourNum?: number;
  birthMinuteNum?: number;
  birthCity?: string;
  calendar: string;
  group: string;
  memo: string;
  savedAt: string;
  lastViewedAt?: number;
  lastGunghapAt?: number;
  yearPillarStr: string;
  monthPillarStr: string;
  dayPillarStr: string;
  hourPillarStr: string;
  dayMasterStr?: string;
  isUnknownTime?: boolean;
  isRepresentative?: boolean;
}

export interface SavedGunghapResult {
  id: string;
  mySajuId: string;
  mySajuName: string;
  targetSajuId: string;
  targetSajuName: string;
  targetBirthYear: number;
  targetBirthMonth: number;
  targetBirthDay: number;
  targetGender: 'male' | 'female';
  score: number;
  createdAt: string; // e.g. "2026.08.11"
  createdAtTimestamp: number;
  // 상세 분석 섹션들
  summary: string;
  overall: string;
  personality: string;
  love: string;
  life: string;
  keyPoints: string[];
}

export interface SavedWongukResult {
  id: string;
  sajuId: string;
  sajuName: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthTime: string;
  dayMasterStr?: string;
  analysisType: 'detail' | 'deep'; // '상세분석' vs '심층분석'
  isPremium?: boolean; // 유료 여부
  createdAt: string; // e.g. "2026.08.13"
  createdAtTimestamp: number;
  // 약 4,000자 분량의 상세 사주분석 섹션들
  summary: string;
  overall: string;            // 1. 전체 사주 총평 및 핵심 본질
  tenGodsAndElements: string; // 2. 십성(十神)과 오행(五行) 정밀 해독
  wealthAndCareer: string;    // 3. 타고난 재물운 및 직업적 적성
  loveAndRelations: string;   // 4. 애정운과 인간관계 및 인복
  lifeFlowAndAdvice: string;  // 5. 삶의 대운 흐름 및 대길(大吉) 지혜
  keyPoints: string[];        // 6. 핵심 사주 키포인트
}

export interface SavedPremiumReport {
  id: string;
  productType: 'gunghap' | 'saju_detail' | 'saju_deep'; // 💎 PREMIUM 궁합 분석, 💎 PREMIUM 고급 사주총운, 💎 PREMIUM 심층 사주총운
  productName: string; // e.g., "💎 PREMIUM 궁합 분석", "💎 PREMIUM 고급 사주총운", "💎 PREMIUM 심층 사주총운"
  aiGrade: string;     // e.g., "고급 AI 기반 궁합 분석", "고급 AI 기반 심층 분석", "플래그십 AI 기반 심층 분석"
  pages: string;       // e.g., "A4 약 10장 분량", "A4 약 16장 분량", "A4 약 32장 분량"
  price: string;       // e.g., "6,900원", "9,900원", "18,900원"
  
  // 사주 대상 정보 (1인)
  targetName: string;
  targetGender?: 'male' | 'female';
  targetBirthYear: number;
  targetBirthMonth: number;
  targetBirthDay: number;
  targetBirthTime: string;
  targetCalendar?: string; // '양력' | '음력' | '윤달'

  // 궁합인 경우 상대방 정보 (2인)
  isGunghap?: boolean;
  partnerName?: string;
  partnerGender?: 'male' | 'female';
  partnerBirthYear?: number;
  partnerBirthMonth?: number;
  partnerBirthDay?: number;
  partnerBirthTime?: string;
  partnerCalendar?: string;

  // 구매 및 만료 일시
  purchasedAt: string;         // e.g., "2026.08.14"
  purchasedAtTimestamp: number;// e.g., 1786665600000
  expiresAt: string;           // e.g., "2027.08.14"
  expiresAtTimestamp: number;  // 1년 후 timestamp
  completedAtTimestamp?: number; // 리포트 생성 완료 시간 (정렬 보조)

  // 분석 결과 요약 내용 (다시보기/다운로드용)
  summary?: string;
  reportContent?: string;
}

export type SocialProvider = 'kakao' | 'naver';

export interface SignupBenefitPolicy {
  enabled: boolean; // 회원가입 무료 혜택 활성화 여부
  freeWongukCount: number; // 상세 사주 무료 제공 횟수
  freeGunghapCount: number; // 궁합 무료 제공 횟수
  badgeText?: string; // 뱃지 텍스트 (예: 3초 간편 가입 시)
}

export interface UserAccount {
  id: string; // 서비스 내부 고유 ID (예: kakao_123456789)
  provider: SocialProvider;
  providerId: string; // 소셜 플랫폼 고유 식별자
  name: string; // 회원 닉네임 또는 이름
  email: string; // 회원 이메일 (마스킹 또는 식별용)
  profileImage?: string;
  createdAt: string; // 가입일
  createdAtTimestamp: number;
  lastLoginAt: string;
  // 계정별 무료 이용 혜택 잔여 횟수
  freeWongukCount: number; // 사주 상세분석 잔여 횟수 (기본 2회)
  freeGunghapCount: number; // 궁합 상세분석 잔여 횟수 (기본 1회)
}

export interface UserInquiry {
  id: string;
  userId: string;
  userProvider: SocialProvider;
  userName: string;
  category: '서비스 이용 문의' | '결제 문의' | '오류/장애 문의' | '계정 문의' | '기타 문의';
  title: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'answered';
  answer?: {
    content: string;
    answeredAt: string;
  };
}

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
}
