export interface SajuInput {
  name?: string;
  gender: 'female' | 'male';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: string; // e.g., '모름' or '00:30~02:30 (축시)'
  calendarType: 'solar' | 'lunar' | 'lunar-leap' | string;
  isUnknownTime?: boolean;
  useYajasi?: boolean;
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
