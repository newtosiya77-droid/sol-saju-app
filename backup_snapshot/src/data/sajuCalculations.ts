import { Solar, Lunar } from 'lunar-javascript';
import { SajuInput, WonGukPillar, SajuAnalysisResult } from '../types';

// 10 천간 (Heavenly Stems)
export const STEMS = [
  { name: '갑', hanja: '甲', element: 'wood' as const, polarity: '+' },
  { name: '을', hanja: '乙', element: 'wood' as const, polarity: '-' },
  { name: '병', hanja: '丙', element: 'fire' as const, polarity: '+' },
  { name: '정', hanja: '丁', element: 'fire' as const, polarity: '-' },
  { name: '무', hanja: '戊', element: 'earth' as const, polarity: '+' },
  { name: '기', hanja: '己', element: 'earth' as const, polarity: '-' },
  { name: '경', hanja: '庚', element: 'metal' as const, polarity: '+' },
  { name: '신', hanja: '辛', element: 'metal' as const, polarity: '-' },
  { name: '임', hanja: '壬', element: 'water' as const, polarity: '+' },
  { name: '계', hanja: '癸', element: 'water' as const, polarity: '-' },
];

// 12 지지 (Earthly Branches) - 지장간 본기 천간 인덱스(mainStemIdx) 명확화
export const BRANCHES = [
  { name: '자', hanja: '子', element: 'water' as const, polarity: '-', mainStemIdx: 9, animal: '쥐', sinsal: '도화살' }, // 계수(癸, 9)
  { name: '축', hanja: '丑', element: 'earth' as const, polarity: '-', mainStemIdx: 5, animal: '소', sinsal: '화개살' }, // 기토(己, 5)
  { name: '인', hanja: '寅', element: 'wood' as const, polarity: '+', mainStemIdx: 0, animal: '호랑이', sinsal: '역마살' }, // 갑목(甲, 0)
  { name: '묘', hanja: '卯', element: 'wood' as const, polarity: '-', mainStemIdx: 1, animal: '토끼', sinsal: '도화살' }, // 을목(乙, 1)
  { name: '진', hanja: '辰', element: 'earth' as const, polarity: '+', mainStemIdx: 4, animal: '용', sinsal: '화개살' }, // 무토(戊, 4)
  { name: '사', hanja: '巳', element: 'fire' as const, polarity: '+', mainStemIdx: 2, animal: '뱀', sinsal: '역마살' }, // 병화(丙, 2)
  { name: '오', hanja: '午', element: 'fire' as const, polarity: '-', mainStemIdx: 3, animal: '말', sinsal: '도화살' }, // 정화(丁, 3)
  { name: '미', hanja: '未', element: 'earth' as const, polarity: '-', mainStemIdx: 5, animal: '양', sinsal: '화개살' }, // 기토(己, 5)
  { name: '신', hanja: '申', element: 'metal' as const, polarity: '+', mainStemIdx: 6, animal: '원숭이', sinsal: '역마살' }, // 경금(庚, 6)
  { name: '유', hanja: '酉', element: 'metal' as const, polarity: '-', mainStemIdx: 7, animal: '닭', sinsal: '도화살' }, // 신금(辛, 7)
  { name: '술', hanja: '戌', element: 'earth' as const, polarity: '+', mainStemIdx: 4, animal: '개', sinsal: '화개살' }, // 무토(戊, 4)
  { name: '해', hanja: '亥', element: 'water' as const, polarity: '+', mainStemIdx: 8, animal: '돼지', sinsal: '역마살' }, // 임수(壬, 8)
];

// 12지 지장간 (Jijanggan) 매핑
export const JIJANGGAN_MAP: Record<string, { hanja: string; kor: string }> = {
  '자': { hanja: '壬·癸', kor: '임·계' },
  '子': { hanja: '壬·癸', kor: '임·계' },
  '축': { hanja: '癸·辛·己', kor: '계·신·기' },
  '丑': { hanja: '癸·辛·己', kor: '계·신·기' },
  '인': { hanja: '戊·丙·甲', kor: '무·병·갑' },
  '寅': { hanja: '戊·丙·甲', kor: '무·병·갑' },
  '묘': { hanja: '甲·乙', kor: '갑·을' },
  '卯': { hanja: '甲·乙', kor: '갑·을' },
  '진': { hanja: '乙·癸·戊', kor: '을·계·무' },
  '辰': { hanja: '乙·癸·戊', kor: '을·계·무' },
  '사': { hanja: '戊·庚·丙', kor: '무·경·병' },
  '巳': { hanja: '戊·庚·丙', kor: '무·경·병' },
  '오': { hanja: '丙·己·丁', kor: '병·기·정' },
  '午': { hanja: '丙·己·丁', kor: '병·기·정' },
  '미': { hanja: '丁·乙·己', kor: '정·을·기' },
  '未': { hanja: '丁·乙·己', kor: '정·을·기' },
  '신': { hanja: '戊·壬·庚', kor: '무·임·경' },
  '申': { hanja: '戊·壬·庚', kor: '무·임·경' },
  '유': { hanja: '庚·辛', kor: '경·신' },
  '酉': { hanja: '庚·辛', kor: '경·신' },
  '술': { hanja: '辛·丁·戊', kor: '신·정·무' },
  '戌': { hanja: '辛·丁·戊', kor: '신·정·무' },
  '해': { hanja: '戊·甲·壬', kor: '무·갑·임' },
  '亥': { hanja: '戊·甲·壬', kor: '무·갑·임' },
};

export function getJijangganInfo(branchChar: string) {
  return JIJANGGAN_MAP[branchChar] || { hanja: '戊·甲·壬', kor: '무·갑·임' };
}

export function getJijangganList(branchChar: string): Array<{ hanja: string; kor: string }> {
  const info = getJijangganInfo(branchChar);
  const hanjas = info.hanja.split('·');
  const kors = info.kor.split('·');
  return hanjas.map((h, idx) => ({
    hanja: h,
    kor: kors[idx] || '',
  }));
}

export function getJijangganListWithTenGod(branchChar: string, dayStemChar: string): Array<{ hanja: string; kor: string; tenGod: string }> {
  const info = getJijangganInfo(branchChar);
  const hanjas = info.hanja.split('·');
  const kors = info.kor.split('·');
  return hanjas.map((h, idx) => ({
    hanja: h,
    kor: kors[idx] || '',
    tenGod: calculateTenGodForChar(dayStemChar, h),
  }));
}

// 12운성 계산 함수 (일간과 각 기둥 지지 기준)
export function calculate12Unseong(dayStem: string, branch: string): string {
  const UNSEONG_NAMES = ['장생', '목욕', '관대', '건록', '제왕', '쇠', '병', '사', '묘', '절', '태', '양'];
  
  // 장생 지지 인덱스 (0:자, 1:축, 2:인, 3:묘, 4:진, 5:사, 6:오, 7:미, 8:신, 9:유, 10:술, 11:해)
  const JANGSAENG_MAP: Record<string, { jangsaengIdx: number; direction: number }> = {
    '갑': { jangsaengIdx: 11, direction: 1 },
    '甲': { jangsaengIdx: 11, direction: 1 },
    '을': { jangsaengIdx: 6, direction: -1 },
    '乙': { jangsaengIdx: 6, direction: -1 },
    '병': { jangsaengIdx: 2, direction: 1 },
    '丙': { jangsaengIdx: 2, direction: 1 },
    '정': { jangsaengIdx: 9, direction: -1 },
    '丁': { jangsaengIdx: 9, direction: -1 },
    '무': { jangsaengIdx: 2, direction: 1 },
    '戊': { jangsaengIdx: 2, direction: 1 },
    '기': { jangsaengIdx: 9, direction: -1 },
    '己': { jangsaengIdx: 9, direction: -1 },
    '경': { jangsaengIdx: 5, direction: 1 },
    '庚': { jangsaengIdx: 5, direction: 1 },
    '신': { jangsaengIdx: 0, direction: -1 },
    '辛': { jangsaengIdx: 0, direction: -1 },
    '임': { jangsaengIdx: 8, direction: 1 },
    '壬': { jangsaengIdx: 8, direction: 1 },
    '계': { jangsaengIdx: 3, direction: -1 },
    '癸': { jangsaengIdx: 3, direction: -1 },
  };

  const branchIdx = getBranchIndex(branch);
  const info = JANGSAENG_MAP[dayStem];
  if (!info) return '건록';

  let stepDiff = 0;
  if (info.direction === 1) {
    stepDiff = (branchIdx - info.jangsaengIdx + 12) % 12;
  } else {
    stepDiff = (info.jangsaengIdx - branchIdx + 12) % 12;
  }

  return UNSEONG_NAMES[stepDiff] || '건록';
}

// 신살(Sinsal: 흉살/특수살)과 길신(Gilsin: 귀인/길성) 엄격 분리 판별 도우미
export interface PillarSinsalGilsin {
  sinsal: string[];
  gilsin: string[];
}

export function getGongmangBranchIndices(stem: string, branch: string): number[] {
  const stemIdx = getStemIndex(stem);
  const branchIdx = getBranchIndex(branch);
  const xunOffset = (branchIdx - stemIdx + 12) % 12;
  return [(10 + xunOffset) % 12, (11 + xunOffset) % 12];
}

export function getPillarSinsalGilsin(
  dayStem: string,
  dayBranch: string,
  stem: string,
  branch: string,
  pillarType: 'year' | 'month' | 'day' | 'hour',
  wonGukContext?: {
    monthBranch?: string;
    yearBranch?: string;
    yearStem?: string;
  }
): PillarSinsalGilsin {
  const sinsal: string[] = [];
  const gilsin: string[] = [];

  // 한자/한글 정규화 도우미
  const b = branch || '';
  const s = stem || '';
  const ds = dayStem || '';
  const db = dayBranch || '';
  const mb = wonGukContext?.monthBranch || '';
  const ys = wonGukContext?.yearStem || '';
  const yb = wonGukContext?.yearBranch || '';

  // 0. 공망 (일공망 및 년공망) 판별
  const currentBranchIdx = getBranchIndex(b);
  if (ds && db) {
    const dayGongmangIndices = getGongmangBranchIndices(ds, db);
    if (dayGongmangIndices.includes(currentBranchIdx)) {
      sinsal.push('(日)공망');
    }
  }

  if (ys && yb) {
    const yearGongmangIndices = getGongmangBranchIndices(ys, yb);
    if (yearGongmangIndices.includes(currentBranchIdx)) {
      sinsal.push('(年)공망');
    }
  }

  // --- 15종 전면 길신 (Gilsin / Guiin) 판별 ---

  // 1. 천을귀인
  if (
    (('갑무경'.includes(ds) || '甲戊庚'.includes(ds)) && ('축미'.includes(b) || '丑未'.includes(b))) ||
    (('을기'.includes(ds) || '乙己'.includes(ds)) && ('자신'.includes(b) || '子申'.includes(b))) ||
    (('병정'.includes(ds) || '丙丁'.includes(ds)) && ('해유'.includes(b) || '亥酉'.includes(b))) ||
    (('신'.includes(ds) || '辛'.includes(ds)) && ('인오'.includes(b) || '寅午'.includes(b))) ||
    (('임계'.includes(ds) || '壬癸'.includes(ds)) && ('사묘'.includes(b) || '巳卯'.includes(b)))
  ) {
    gilsin.push('천을귀인');
  }

  // 2. 태극귀인
  if (
    (('갑을'.includes(ds) || '甲乙'.includes(ds)) && ('자축'.includes(b) || '子丑'.includes(b))) ||
    (('병정'.includes(ds) || '丙丁'.includes(ds)) && ('묘유'.includes(b) || '卯酉'.includes(b))) ||
    (('무기'.includes(ds) || '戊己'.includes(ds)) && ('진술축미'.includes(b) || '辰戌丑未'.includes(b))) ||
    (('경신'.includes(ds) || '庚辛'.includes(ds)) && ('인해'.includes(b) || '寅亥'.includes(b))) ||
    (('임계'.includes(ds) || '壬癸'.includes(ds)) && ('사오'.includes(b) || '巳午'.includes(b)))
  ) {
    gilsin.push('태극귀인');
  }

  // 3. 천복귀인
  const cheonbokMap: Record<string, string> = {
    '갑': '자', '甲': '子', '을': '축', '乙': '丑', '병': '인', '丙': '寅', '정': '묘', '丁': '卯',
    '무': '진', '戊': '辰', '기': '사', '己': '巳', '경': '오', '庚': '午', '신': '미', '辛': '未',
    '임': '신', '壬': '申', '계': '유', '癸': '酉'
  };
  if (cheonbokMap[ds] && ('자축인묘진사오미신유'.includes(b) || '子丑寅卯辰巳午未申酉'.includes(b))) {
    if (b === cheonbokMap[ds] || BRANCHES.find(br => br.name === cheonbokMap[ds])?.hanja === b) {
      gilsin.push('천복귀인');
    }
  }

  // 4. 문창귀인
  const munchangMap: Record<string, string> = {
    '갑': '사', '甲': '巳', '을': '오', '乙': '午', '병': '신', '丙': '申', '정': '유', '丁': '酉',
    '무': '신', '戊': '申', '기': '유', '己': '酉', '경': '해', '庚': '亥', '신': '자', '辛': '子',
    '임': '인', '壬': '寅', '계': '묘', '癸': '卯'
  };
  if (munchangMap[ds] && (munchangMap[ds] === b || BRANCHES.find(br => br.name === munchangMap[ds])?.hanja === b)) {
    gilsin.push('문창귀인');
  }

  // 5. 문곡귀인
  const mungokMap: Record<string, string> = {
    '갑': '해', '甲': '亥', '을': '자', '乙': '子', '병': '인', '丙': '寅', '정': '묘', '丁': '卯',
    '무': '인', '戊': '寅', '기': '묘', '己': '卯', '경': '사', '庚': '巳', '신': '오', '辛': '午',
    '임': '신', '壬': '申', '계': '유', '癸': '酉'
  };
  if (mungokMap[ds] && (mungokMap[ds] === b || BRANCHES.find(br => br.name === mungokMap[ds])?.hanja === b)) {
    gilsin.push('문곡귀인');
  }

  // 6. 천주귀인
  const cheonjuMap: Record<string, string> = {
    '갑': '사', '甲': '巳', '을': '오', '乙': '午', '병': '사', '丙': '巳', '정': '오', '丁': '午',
    '무': '신', '戊': '申', '기': '유', '己': '酉', '경': '해', '庚': '亥', '신': '자', '辛': '子',
    '임': '인', '壬': '寅', '계': '묘', '癸': '卯'
  };
  if (cheonjuMap[ds] && (cheonjuMap[ds] === b || BRANCHES.find(br => br.name === cheonjuMap[ds])?.hanja === b)) {
    gilsin.push('천주귀인');
  }

  // 7. 월덕귀인 (월지 기준)
  const refMonthBranch = mb || (pillarType === 'month' ? b : '');
  if (refMonthBranch) {
    if (('인오술'.includes(refMonthBranch) || '寅午戌'.includes(refMonthBranch)) && ('병'.includes(s) || '丙'.includes(s))) gilsin.push('월덕귀인');
    else if (('신자진'.includes(refMonthBranch) || '申子辰'.includes(refMonthBranch)) && ('임'.includes(s) || '壬'.includes(s))) gilsin.push('월덕귀인');
    else if (('해묘미'.includes(refMonthBranch) || '亥卯未'.includes(refMonthBranch)) && ('갑'.includes(s) || '甲'.includes(s))) gilsin.push('월덕귀인');
    else if (('사유축'.includes(refMonthBranch) || '巳酉丑'.includes(refMonthBranch)) && ('경'.includes(s) || '庚'.includes(s))) gilsin.push('월덕귀인');
  }

  // 8. 천덕귀인 (월지 기준)
  if (refMonthBranch) {
    if (('자'.includes(refMonthBranch) || '子'.includes(refMonthBranch)) && ('정'.includes(s) || '丁'.includes(s) || '사'.includes(b) || '巳'.includes(b))) gilsin.push('천덕귀인');
    else if (('축'.includes(refMonthBranch) || '丑'.includes(refMonthBranch)) && ('경'.includes(s) || '庚'.includes(s))) gilsin.push('천덕귀인');
    else if (('인'.includes(refMonthBranch) || '寅'.includes(refMonthBranch)) && ('정'.includes(s) || '丁'.includes(s))) gilsin.push('천덕귀인');
    else if (('묘'.includes(refMonthBranch) || '卯'.includes(refMonthBranch)) && ('신'.includes(b) || '申'.includes(b))) gilsin.push('천덕귀인');
    else if (('진'.includes(refMonthBranch) || '辰'.includes(refMonthBranch)) && ('임'.includes(s) || '壬'.includes(s))) gilsin.push('천덕귀인');
    else if (('사'.includes(refMonthBranch) || '巳'.includes(refMonthBranch)) && ('신'.includes(s) || '辛'.includes(s))) gilsin.push('천덕귀인');
    else if (('오'.includes(refMonthBranch) || '午'.includes(refMonthBranch)) && ('해'.includes(b) || '亥'.includes(b))) gilsin.push('천덕귀인');
    else if (('미'.includes(refMonthBranch) || '未'.includes(refMonthBranch)) && ('갑'.includes(s) || '甲'.includes(s))) gilsin.push('천덕귀인');
    else if (('신'.includes(refMonthBranch) || '申'.includes(refMonthBranch)) && ('계'.includes(s) || '癸'.includes(s))) gilsin.push('천덕귀인');
    else if (('유'.includes(refMonthBranch) || '酉'.includes(refMonthBranch)) && ('인'.includes(b) || '寅'.includes(b))) gilsin.push('천덕귀인');
    else if (('술'.includes(refMonthBranch) || '戌'.includes(refMonthBranch)) && ('병'.includes(s) || '丙'.includes(s))) gilsin.push('천덕귀인');
    else if (('해'.includes(refMonthBranch) || '亥'.includes(refMonthBranch)) && ('을'.includes(s) || '乙'.includes(s))) gilsin.push('천덕귀인');
  }

  // 9. 금여
  const geumyeoMap: Record<string, string> = {
    '갑': '진', '甲': '辰', '을': '사', '乙': '巳', '병': '미', '丙': '未', '정': '신', '丁': '申',
    '무': '미', '戊': '未', '기': '신', '己': '申', '경': '술', '庚': '戌', '신': '해', '辛': '亥',
    '임': '축', '壬': '丑', '계': '인', '癸': '寅'
  };
  if (geumyeoMap[ds] && (geumyeoMap[ds] === b || BRANCHES.find(br => br.name === geumyeoMap[ds])?.hanja === b)) {
    gilsin.push('금여');
  }

  // 10. 학당귀인
  const hakdangMap: Record<string, string> = {
    '갑': '해', '甲': '亥', '을': '오', '乙': '午', '병': '인', '丙': '寅', '정': '유', '丁': '酉',
    '무': '인', '戊': '寅', '기': '유', '己': '酉', '경': '사', '庚': '巳', '신': '자', '辛': '子',
    '임': '신', '壬': '申', '계': '묘', '癸': '卯'
  };
  if (hakdangMap[ds] && (hakdangMap[ds] === b || BRANCHES.find(br => br.name === hakdangMap[ds])?.hanja === b)) {
    gilsin.push('학당귀인');
  }

  // 11. 복성귀인
  const bokseongMap: Record<string, string> = {
    '갑': '인', '甲': '寅', '을': '축', '乙': '丑', '병': '자', '丙': '子', '정': '해', '丁': '亥',
    '무': '신', '戊': '申', '기': '미', '己': '未', '경': '오', '庚': '午', '신': '사', '辛': '巳',
    '임': '진', '壬': '辰', '계': '묘', '癸': '卯'
  };
  if (bokseongMap[ds] && (bokseongMap[ds] === b || BRANCHES.find(br => br.name === bokseongMap[ds])?.hanja === b)) {
    gilsin.push('복성귀인');
  }

  // 12. 관귀학관
  const gwangwiMap: Record<string, string> = {
    '갑': '사', '甲': '巳', '을': '사', '乙': '巳', '병': '신', '丙': '申', '정': '신', '丁': '申',
    '무': '해', '戊': '亥', '기': '해', '己': '亥', '경': '인', '庚': '寅', '신': '인', '辛': '寅',
    '임': '신', '壬': '申', '계': '신', '癸': '申'
  };
  if (gwangwiMap[ds] && (gwangwiMap[ds] === b || BRANCHES.find(br => br.name === gwangwiMap[ds])?.hanja === b)) {
    gilsin.push('관귀학관');
  }

  // 13. 협록
  const hyeobrokMap: Record<string, string[]> = {
    '갑': ['축', '묘', '丑', '卯'], '甲': ['축', '묘', '丑', '卯'],
    '을': ['인', '진', '寅', '辰'], '乙': ['인', '진', '寅', '辰'],
    '병': ['진', '오', '辰', '午'], '丙': ['진', '오', '辰', '午'],
    '정': ['사', '미', '巳', '未'], '丁': ['사', '미', '巳', '未'],
    '무': ['진', '오', '辰', '午'], '戊': ['진', '오', '辰', '午'],
    '기': ['사', '미', '巳', '未'], '己': ['사', '미', '巳', '未'],
    '경': ['미', '유', '未', '酉'], '庚': ['미', '유', '未', '酉'],
    '신': ['신', '술', '申', '戌'], '辛': ['신', '술', '申', '戌'],
    '임': ['술', '자', '戌', '子'], '壬': ['술', '자', '戌', '子'],
    '계': ['해', '축', '亥', '丑'], '癸': ['해', '축', '亥', '丑'],
  };
  if (hyeobrokMap[ds] && hyeobrokMap[ds].includes(b)) {
    gilsin.push('협록');
  }

  // 14. 암록
  const amrokMap: Record<string, string> = {
    '갑': '해', '甲': '亥', '을': '술', '乙': '戌', '병': '신', '丙': '申', '정': '미', '丁': '未',
    '무': '신', '戊': '申', '기': '미', '己': '未', '경': '사', '庚': '巳', '신': '진', '辛': '辰',
    '임': '인', '壬': '寅', '계': '축', '癸': '丑'
  };
  if (amrokMap[ds] && (amrokMap[ds] === b || BRANCHES.find(br => br.name === amrokMap[ds])?.hanja === b)) {
    gilsin.push('암록');
  }

  // 15. 건록
  const geonrokMap: Record<string, string> = {
    '갑': '인', '甲': '寅', '을': '묘', '乙': '卯', '병': '사', '丙': '巳', '정': '오', '丁': '午',
    '무': '사', '戊': '巳', '기': '오', '己': '午', '경': '신', '庚': '申', '신': '유', '辛': '酉',
    '임': '해', '壬': '亥', '계': '자', '癸': '子'
  };
  if (geonrokMap[ds] && (geonrokMap[ds] === b || BRANCHES.find(br => br.name === geonrokMap[ds])?.hanja === b)) {
    gilsin.push('건록');
  }

  // --- 20종 전면 신살·흉살 (Sinsal) 판별 ---

  // 1. 12신살 (삼합 기준: 일지/년지 모두 적용)
  const baseBranches = Array.from(new Set([dayBranch, wonGukContext?.yearBranch || ''].filter(Boolean)));
  if (baseBranches.length === 0) baseBranches.push(b);

  for (const baseB of baseBranches) {
    let triadGroup = '';
    if ('신자진申子辰'.includes(baseB)) triadGroup = '신자진';
    else if ('인오술寅午戌'.includes(baseB)) triadGroup = '인오술';
    else if ('사유축巳酉丑'.includes(baseB)) triadGroup = '사유축';
    else if ('해묘미亥卯未'.includes(baseB)) triadGroup = '해묘미';

    if (triadGroup === '신자진') {
      if ('사巳'.includes(b)) sinsal.push('겁살');
      if ('오午'.includes(b)) sinsal.push('재살');
      if ('미未'.includes(b)) sinsal.push('천살');
      if ('신申'.includes(b)) sinsal.push('지살');
      if ('유酉'.includes(b)) sinsal.push('도화살');
      if ('술戌'.includes(b)) sinsal.push('월살');
      if ('해亥'.includes(b)) sinsal.push('망신살');
      if ('자子'.includes(b)) sinsal.push('장성살');
      if ('축丑'.includes(b)) sinsal.push('반안살');
      if ('인寅'.includes(b)) sinsal.push('역마살');
      if ('묘卯'.includes(b)) sinsal.push('육해살');
      if ('진辰'.includes(b)) sinsal.push('화개살');
    } else if (triadGroup === '인오술') {
      if ('해亥'.includes(b)) sinsal.push('겁살');
      if ('자子'.includes(b)) sinsal.push('재살');
      if ('축丑'.includes(b)) sinsal.push('천살');
      if ('인寅'.includes(b)) sinsal.push('지살');
      if ('묘卯'.includes(b)) sinsal.push('도화살');
      if ('진辰'.includes(b)) sinsal.push('월살');
      if ('사巳'.includes(b)) sinsal.push('망신살');
      if ('오午'.includes(b)) sinsal.push('장성살');
      if ('미未'.includes(b)) sinsal.push('반안살');
      if ('신申'.includes(b)) sinsal.push('역마살');
      if ('유酉'.includes(b)) sinsal.push('육해살');
      if ('술戌'.includes(b)) sinsal.push('화개살');
    } else if (triadGroup === '사유축') {
      if ('인寅'.includes(b)) sinsal.push('겁살');
      if ('묘卯'.includes(b)) sinsal.push('재살');
      if ('진辰'.includes(b)) sinsal.push('천살');
      if ('사巳'.includes(b)) sinsal.push('지살');
      if ('오午'.includes(b)) sinsal.push('도화살');
      if ('미未'.includes(b)) sinsal.push('월살');
      if ('신申'.includes(b)) sinsal.push('망신살');
      if ('유酉'.includes(b)) sinsal.push('장성살');
      if ('술戌'.includes(b)) sinsal.push('반안살');
      if ('해亥'.includes(b)) sinsal.push('역마살');
      if ('자子'.includes(b)) sinsal.push('육해살');
      if ('축丑'.includes(b)) sinsal.push('화개살');
    } else if (triadGroup === '해묘미') {
      if ('신申'.includes(b)) sinsal.push('겁살');
      if ('유酉'.includes(b)) sinsal.push('재살');
      if ('술戌'.includes(b)) sinsal.push('천살');
      if ('해亥'.includes(b)) sinsal.push('지살');
      if ('자子'.includes(b)) sinsal.push('도화살');
      if ('축丑'.includes(b)) sinsal.push('월살');
      if ('인寅'.includes(b)) sinsal.push('망신살');
      if ('묘卯'.includes(b)) sinsal.push('장성살');
      if ('진辰'.includes(b)) sinsal.push('반안살');
      if ('사巳'.includes(b)) sinsal.push('역마살');
      if ('오午'.includes(b)) sinsal.push('육해살');
      if ('미未'.includes(b)) sinsal.push('화개살');
    }
  }

  // 보조 대표살 체크 (자/묘/유/오 -> 도화살, 인/신/사/해 -> 역마살, 진/술/축/미 -> 화개살)
  if ('자묘유오子卯酉午'.includes(b) && !sinsal.includes('도화살')) {
    sinsal.push('도화살');
  }
  if ('인신사해寅申巳亥'.includes(b) && !sinsal.includes('역마살')) {
    sinsal.push('역마살');
  }
  if ('진술축미辰戌丑未'.includes(b) && !sinsal.includes('화개살')) {
    sinsal.push('화개살');
  }

  // 2. 현침살 (천간/지지 중 甲, 辛, 寅, 午, 申, 未)
  const hyeonchimChars = '갑신인오미甲辛寅午申未';
  if (hyeonchimChars.includes(s) || hyeonchimChars.includes(b)) {
    sinsal.push('현침살');
  }

  // 3. 홍염살
  const hongyeomMap: Record<string, string> = {
    '갑': '오', '甲': '午', '을': '오', '乙': '午', '병': '인', '丙': '寅', '정': '미', '丁': '未',
    '무': '진', '戊': '辰', '기': '진', '己': '辰', '경': '술', '庚': '戌', '신': '유', '辛': '酉',
    '임': '신', '壬': '申', '계': '신', '癸': '申'
  };
  if (hongyeomMap[ds] && (hongyeomMap[ds] === b || BRANCHES.find(br => br.name === hongyeomMap[ds])?.hanja === b)) {
    sinsal.push('홍염살');
  }

  // 4. 백호살 (백호대살 -> 백호살 명칭 통일)
  const pillarStr = `${s}${b}`;
  if (['갑진', '甲辰', '을미', '乙未', '병진', '丙辰', '정축', '丁丑', '무진', '戊辰', '임술', '壬戌', '계축', '癸丑'].includes(pillarStr)) {
    sinsal.push('백호살');
  }

  // 5. 비인살
  const biinMap: Record<string, string> = {
    '갑': '유', '甲': '酉', '을': '신', '乙': '申', '병': '자', '丙': '子', '정': '해', '丁': '亥',
    '무': '자', '戊': '子', '기': '해', '己': '亥', '경': '묘', '庚': '卯', '신': '인', '辛': '寅',
    '임': '오', '壬': '午', '계': '사', '癸': '巳'
  };
  if (biinMap[ds] && (biinMap[ds] === b || BRANCHES.find(br => br.name === biinMap[ds])?.hanja === b)) {
    sinsal.push('비인살');
  }

  // 6. 고란살
  if (['갑인', '甲寅', '을사', '乙巳', '정사', '丁巳', '무신', '戊申', '신해', '辛亥'].includes(pillarStr)) {
    sinsal.push('고란살');
  }

  // 7. 원진살 (일지/년지 대 타 기둥 지지)
  if (db) {
    if (('자'.includes(db) || '子'.includes(db)) && ('미'.includes(b) || '未'.includes(b))) sinsal.push('원진살');
    if (('축'.includes(db) || '丑'.includes(db)) && ('오'.includes(b) || '午'.includes(b))) sinsal.push('원진살');
    if (('인'.includes(db) || '寅'.includes(db)) && ('유'.includes(b) || '酉'.includes(b))) sinsal.push('원진살');
    if (('묘'.includes(db) || '卯'.includes(db)) && ('신'.includes(b) || '申'.includes(b))) sinsal.push('원진살');
    if (('진'.includes(db) || '辰'.includes(db)) && ('해'.includes(b) || '亥'.includes(b))) sinsal.push('원진살');
    if (('사'.includes(db) || '巳'.includes(db)) && ('술'.includes(b) || '戌'.includes(b))) sinsal.push('원진살');
  }

  // 8. 귀문관살 (일지/년지 대 타 기둥 지지)
  if (db) {
    if (('자'.includes(db) || '子'.includes(db)) && ('유'.includes(b) || '酉'.includes(b))) sinsal.push('귀문관살');
    if (('축'.includes(db) || '丑'.includes(db)) && ('오'.includes(b) || '午'.includes(b))) sinsal.push('귀문관살');
    if (('인'.includes(db) || '寅'.includes(db)) && ('미'.includes(b) || '未'.includes(b))) sinsal.push('귀문관살');
    if (('묘'.includes(db) || '卯'.includes(db)) && ('신'.includes(b) || '申'.includes(b))) sinsal.push('귀문관살');
    if (('진'.includes(db) || '辰'.includes(db)) && ('해'.includes(b) || '亥'.includes(b))) sinsal.push('귀문관살');
    if (('사'.includes(db) || '巳'.includes(db)) && ('술'.includes(b) || '戌'.includes(b))) sinsal.push('귀문관살');
  }

  // 9. 양인살
  const yanginMap: Record<string, string> = {
    '갑': '묘', '甲': '卯', '을': '진', '乙': '辰', '병': '오', '丙': '午', '정': '미', '丁': '未',
    '무': '오', '戊': '午', '기': '미', '己': '未', '경': '유', '庚': '酉', '신': '술', '辛': '戌',
    '임': '자', '壬': '子', '계': '축', '癸': '丑'
  };
  if (yanginMap[ds] && (yanginMap[ds] === b || BRANCHES.find(br => br.name === yanginMap[ds])?.hanja === b)) {
    sinsal.push('양인살');
  }

  // 10. 괴강살
  if (['경진', '庚辰', '경술', '庚戌', '임진', '壬辰', '임술', '壬戌', '무진', '戊辰', '무술', '戊戌'].includes(pillarStr)) {
    sinsal.push('괴강살');
  }

  // 중복 제거 및 '역마' -> '역마살', '백호대살' -> '백호살' 정규화
  const normalizedSinsal = sinsal.map(item => {
    if (item === '역마') return '역마살';
    if (item === '백호대살') return '백호살';
    return item;
  });

  const uniqueSinsal = Array.from(new Set(normalizedSinsal));
  const uniqueGilsin = Array.from(new Set(gilsin)).filter(g => g !== '현침' && g !== '현침살');

  return {
    sinsal: uniqueSinsal.length > 0 ? uniqueSinsal : ['-'],
    gilsin: uniqueGilsin.length > 0 ? uniqueGilsin : ['-'],
  };
}

export const HOUR_BRANCH_MAP: Record<string, number> = {
  '자시 (23:30~01:30)': 0,
  '축시 (01:30~03:30)': 1,
  '인시 (03:30~05:30)': 2,
  '묘시 (05:30~07:30)': 3,
  '진시 (07:30~09:30)': 4,
  '사시 (09:30~11:30)': 5,
  '오시 (11:30~13:30)': 6,
  '미시 (13:30~15:30)': 7,
  '신시 (15:30~17:30)': 8,
  '유시 (17:30~19:30)': 9,
  '술시 (19:30~21:30)': 10,
  '해시 (21:30~23:30)': 11,
  '모름': 0,
};

// 천간 인덱스 찾기 도우미
export function getStemIndex(char: string): number {
  if (!char) return 0;
  const idx = STEMS.findIndex(s => s.name === char || s.hanja === char);
  return idx >= 0 ? idx : 0;
}

// 지지 인덱스 찾기 도우미
export function getBranchIndex(char: string): number {
  if (!char) return 0;
  const idx = BRANCHES.findIndex(b => b.name === char || b.hanja === char);
  return idx >= 0 ? idx : 0;
}

// 단 하나의 기준(일간)으로 천간 간의 십성(십신)을 명확하게 계산하는 기준 공통 함수
export function getTenGodName(dayStemIdx: number, targetStemIdx: number): string {
  const dayElem = STEMS[dayStemIdx].element;
  const dayPol = STEMS[dayStemIdx].polarity;
  const targetElem = STEMS[targetStemIdx].element;
  const targetPol = STEMS[targetStemIdx].polarity;

  const samePol = dayPol === targetPol;

  if (dayElem === targetElem) {
    return samePol ? '비견' : '겁재';
  }
  // 나를 생해주는 관계 (인성: 水->木, 木->火, 火->土, 土->金, 金->水)
  if (
    (dayElem === 'wood' && targetElem === 'water') ||
    (dayElem === 'fire' && targetElem === 'wood') ||
    (dayElem === 'earth' && targetElem === 'fire') ||
    (dayElem === 'metal' && targetElem === 'earth') ||
    (dayElem === 'water' && targetElem === 'metal')
  ) {
    return samePol ? '편인' : '정인';
  }
  // 내가 생하는 관계 (식상: 木->火, 火->土, 土->金, 金->水, 水->木)
  if (
    (dayElem === 'wood' && targetElem === 'fire') ||
    (dayElem === 'fire' && targetElem === 'earth') ||
    (dayElem === 'earth' && targetElem === 'metal') ||
    (dayElem === 'metal' && targetElem === 'water') ||
    (dayElem === 'water' && targetElem === 'wood')
  ) {
    return samePol ? '식신' : '상관';
  }
  // 내가 극하는 관계 (재성: 木->土, 火->金, 土->水, 金->木, 水->火)
  if (
    (dayElem === 'wood' && targetElem === 'earth') ||
    (dayElem === 'fire' && targetElem === 'metal') ||
    (dayElem === 'earth' && targetElem === 'water') ||
    (dayElem === 'metal' && targetElem === 'wood') ||
    (dayElem === 'water' && targetElem === 'fire')
  ) {
    return samePol ? '편재' : '정재';
  }
  // 나를 극하는 관계 (관성: 金->木, 水->火, 木->土, 火->金, 土->水)
  return samePol ? '편관' : '정관';
}

// 지지의 십성(십신) 계산 (지장간 본기 천간 기준)
export function getTenGodForBranch(dayStemIdx: number, branchIdx: number): string {
  const mainStemIdx = BRANCHES[branchIdx].mainStemIdx;
  return getTenGodName(dayStemIdx, mainStemIdx);
}

// 일간 오행 대비 대상 오행의 십성 그룹 (오행 밸런스 차트용)
export function getTenGodGroupForElement(
  dayElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water',
  targetElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water'
): string {
  const elements: ('wood' | 'fire' | 'earth' | 'metal' | 'water')[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  const dayIdx = elements.indexOf(dayElement);
  const targetIdx = elements.indexOf(targetElement);
  const diff = (targetIdx - dayIdx + 5) % 5;

  switch (diff) {
    case 0: return '비겁 (비견·겁재)';
    case 1: return '식상 (식신·상관)';
    case 2: return '재성 (편재·정재)';
    case 3: return '관성 (편관·정관)';
    case 4: return '인성 (편인·정인)';
    default: return '비겁 (비견·겁재)';
  }
}

// 한글/한자 문자가 주어졌을 때 일간 기준으로 십성을 산출하는 통합 공통 도우미
export function calculateTenGodForChar(dayStemChar: string, targetChar: string, isDayMasterSelf: boolean = false): string {
  if (isDayMasterSelf) return '일원';
  const dayIdx = getStemIndex(dayStemChar);

  // 천간 검색
  const stemIdx = STEMS.findIndex(s => s.name === targetChar || s.hanja === targetChar);
  if (stemIdx >= 0) {
    return getTenGodName(dayIdx, stemIdx);
  }

  // 지지 검색
  const branchIdx = BRANCHES.findIndex(b => b.name === targetChar || b.hanja === targetChar);
  if (branchIdx >= 0) {
    return getTenGodForBranch(dayIdx, branchIdx);
  }

  return '비견';
}

export function parseBirthTime(birthHourStr: string, inputHour?: number, inputMinute?: number): { hour: number; minute: number } {
  if (typeof inputHour === 'number' && !isNaN(inputHour)) {
    return {
      hour: Math.max(0, Math.min(23, inputHour)),
      minute: typeof inputMinute === 'number' && !isNaN(inputMinute) ? Math.max(0, Math.min(59, inputMinute)) : 0,
    };
  }

  if (!birthHourStr || birthHourStr.includes('모름') || birthHourStr.includes('미지정')) {
    return { hour: 12, minute: 0 };
  }

  const match = birthHourStr.match(/(\d{1,2})\s*:\s*(\d{1,2})/);
  if (match) {
    return {
      hour: Math.max(0, Math.min(23, parseInt(match[1], 10))),
      minute: Math.max(0, Math.min(59, parseInt(match[2], 10))),
    };
  }

  if (birthHourStr.includes('자시') || birthHourStr.includes('23:30')) return { hour: 0, minute: 30 };
  if (birthHourStr.includes('축시')) return { hour: 2, minute: 30 };
  if (birthHourStr.includes('인시')) return { hour: 4, minute: 30 };
  if (birthHourStr.includes('묘시')) return { hour: 6, minute: 30 };
  if (birthHourStr.includes('진시')) return { hour: 8, minute: 30 };
  if (birthHourStr.includes('사시')) return { hour: 10, minute: 30 };
  if (birthHourStr.includes('오시')) return { hour: 12, minute: 30 };
  if (birthHourStr.includes('미시')) return { hour: 14, minute: 30 };
  if (birthHourStr.includes('신시')) return { hour: 16, minute: 30 };
  if (birthHourStr.includes('유시')) return { hour: 18, minute: 30 };
  if (birthHourStr.includes('술시')) return { hour: 20, minute: 30 };
  if (birthHourStr.includes('해시')) return { hour: 22, minute: 30 };

  return { hour: 12, minute: 0 };
}

// 사주 원국 계산 함수 (정통 만세력 & 24절기 엔진)
export function calculateSajuWonGuk(input: SajuInput) {
  const { birthYear, birthMonth, birthDay, birthHour, birthHourNum, birthMinuteNum, calendarType, useYajasi, jasiOption } = input;
  const { hour, minute } = parseBirthTime(birthHour || '', birthHourNum, birthMinuteNum);

  const isLunar = calendarType === 'lunar' || calendarType === 'lunar-leap' || (typeof calendarType === 'string' && calendarType.includes('음력'));
  const isLeapMonth = calendarType === 'lunar-leap' || (typeof calendarType === 'string' && calendarType.includes('윤달'));

  const is23Hour = hour === 23;
  const is0Hour = hour === 0;
  const isJasi = is23Hour || is0Hour || (birthHour || '').includes('자시');

  let lunarObj: InstanceType<typeof Lunar>;

  try {
    if (isLunar) {
      lunarObj = Lunar.fromYmdHms(
        Math.max(1900, Math.min(2100, birthYear || 1995)),
        isLeapMonth ? -Math.max(1, Math.min(12, birthMonth || 1)) : Math.max(1, Math.min(12, birthMonth || 1)),
        Math.max(1, Math.min(30, birthDay || 1)),
        hour, minute, 0
      );
    } else {
      const solarObj = Solar.fromYmdHms(
        Math.max(1900, Math.min(2100, birthYear || 1995)),
        Math.max(1, Math.min(12, birthMonth || 1)),
        Math.max(1, Math.min(31, birthDay || 1)),
        hour, minute, 0
      );
      lunarObj = solarObj.getLunar();
    }
  } catch {
    const solarObj = Solar.fromYmdHms(
      Math.max(1900, Math.min(2100, birthYear || 1995)),
      Math.max(1, Math.min(12, birthMonth || 1)),
      Math.max(1, Math.min(28, birthDay || 1)),
      hour, minute, 0
    );
    lunarObj = solarObj.getLunar();
  }

  // 자시(23:00~00:59) 처리 명리학 규칙:
  // 1. 23:00~23:59:
  //    - 조자시(명일자시, 기본) 또는 useYajasi === false 또는 jasiOption === 'jo': 23시 이후는 다음 날 일주 적용
  //    - 야자시 (useYajasi === true 또는 jasiOption === 'yaja'): 당일 일주 유지
  // 2. 00:00~00:59:
  //    - 조자시(당일 0시): 이미 당일 일주이므로 그대로 유지
  if (is23Hour) {
    const isYajaSelected = jasiOption === 'yaja' || (useYajasi === true && jasiOption !== 'jo');
    if (!isYajaSelected) {
      lunarObj = lunarObj.next(1);
    }
  } else if (!is23Hour && isJasi && !useYajasi && jasiOption === 'jo') {
    // 00시대 조자시: 당일 유지
  }

  const eightChar = lunarObj.getEightChar();

  const yearGan = eightChar.getYearGan();
  const yearZhi = eightChar.getYearZhi();
  const monthGan = eightChar.getMonthGan();
  const monthZhi = eightChar.getMonthZhi();
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const timeGan = eightChar.getTimeGan();
  const timeZhi = eightChar.getTimeZhi();

  const yearStemIdx = getStemIndex(yearGan);
  const yearBranchIdx = getBranchIndex(yearZhi);
  const monthStemIdx = getStemIndex(monthGan);
  const monthBranchIdx = getBranchIndex(monthZhi);
  const dayStemIdx = getStemIndex(dayGan);
  const dayBranchIdx = getBranchIndex(dayZhi);
  const hourBranchIdx = getBranchIndex(timeZhi);
  // 오호둔법(시두법): 일간(dayStemIdx)과 시지(hourBranchIdx)에 의한 시천간(hourStemIdx) 고정 계산
  const hourStemIdx = ((dayStemIdx % 5) * 2 + hourBranchIdx) % 10;

  const dayStem = STEMS[dayStemIdx];
  const dayBranch = BRANCHES[dayBranchIdx];

  const yearPillar: WonGukPillar = {
    title: '년주 (근본·초년)',
    stem: STEMS[yearStemIdx].name,
    stemHanja: STEMS[yearStemIdx].hanja,
    branch: BRANCHES[yearBranchIdx].name,
    branchHanja: BRANCHES[yearBranchIdx].hanja,
    elementStem: STEMS[yearStemIdx].element,
    elementBranch: BRANCHES[yearBranchIdx].element,
    tenGodStem: getTenGodName(dayStemIdx, yearStemIdx),
    tenGodBranch: getTenGodForBranch(dayStemIdx, yearBranchIdx),
    sinsal: BRANCHES[yearBranchIdx].sinsal,
  };

  const monthPillar: WonGukPillar = {
    title: '월주 (사회·청년)',
    stem: STEMS[monthStemIdx].name,
    stemHanja: STEMS[monthStemIdx].hanja,
    branch: BRANCHES[monthBranchIdx].name,
    branchHanja: BRANCHES[monthBranchIdx].hanja,
    elementStem: STEMS[monthStemIdx].element,
    elementBranch: BRANCHES[monthBranchIdx].element,
    tenGodStem: getTenGodName(dayStemIdx, monthStemIdx),
    tenGodBranch: getTenGodForBranch(dayStemIdx, monthBranchIdx),
    sinsal: BRANCHES[monthBranchIdx].sinsal,
  };

  const dayPillar: WonGukPillar = {
    title: '일주 (본질·중년)',
    stem: dayStem.name,
    stemHanja: dayStem.hanja,
    branch: dayBranch.name,
    branchHanja: dayBranch.hanja,
    elementStem: dayStem.element,
    elementBranch: dayBranch.element,
    tenGodStem: getTenGodName(dayStemIdx, dayStemIdx),
    tenGodBranch: getTenGodForBranch(dayStemIdx, dayBranchIdx),
    sinsal: dayBranch.sinsal,
  };

  const hourPillar: WonGukPillar = {
    title: '시주 (비전·말년)',
    stem: STEMS[hourStemIdx].name,
    stemHanja: STEMS[hourStemIdx].hanja,
    branch: BRANCHES[hourBranchIdx].name,
    branchHanja: BRANCHES[hourBranchIdx].hanja,
    elementStem: STEMS[hourStemIdx].element,
    elementBranch: BRANCHES[hourBranchIdx].element,
    tenGodStem: getTenGodName(dayStemIdx, hourStemIdx),
    tenGodBranch: getTenGodForBranch(dayStemIdx, hourBranchIdx),
    sinsal: BRANCHES[hourBranchIdx].sinsal,
  };

  return {
    dayStem,
    dayBranch,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
  };
}

// 30대 이하 트렌디 MZ 셀럽 데이터베이스 (성별 엄격 분류)
export interface CelebData {
  name: string;
  occupation: string;
  ageGroup: string;
  dominantTrait: string;
  points: [string, string, string];
  summary: string;
}

export const FEMALE_MZ_CELEBS: CelebData[] = [
  {
    name: '장원영',
    occupation: '아이돌/아티스트 (아이브)',
    ageGroup: '20대',
    dominantTrait: '도화살 + 상관격',
    points: [
      '압도적 스타성과 트렌드를 주도하는 상관(傷官)의 강렬한 존재감',
      '사람들의 시선을 끌어당기는 천생 도화살(桃花煞)과의 극적인 시너지',
      '단단한 자존감과 자기관리로 독보적 매력을 완성하는 완벽주의 성향'
    ],
    summary: '주위의 시선을 자연스럽게 사로잡는 보석 같은 존재감! 자신감 넘치는 자아 표현과 다재다능함으로 트렌드를 리드하는 셀럽 사주입니다.'
  },
  {
    name: '카리나',
    occupation: '아이돌/아티스트 (에스파)',
    ageGroup: '20대',
    dominantTrait: '편관 + 화개살',
    points: [
      '비현실적 아우라와 기품을 발산하는 신비로운 화개살(華蓋煞)',
      '자신만의 정체성을 확고히 유지하며 절제된 카리스마를 보여주는 편관(偏官)',
      '철저한 프로의식과 트렌디한 감각이 결합된 독보적인 비주얼 리더'
    ],
    summary: '냉철한 철학과 유니크한 매력이 공존하는 아티스트! 남다른 카리스마와 감각으로 대중의 선망을 받는 압도적 아우라의 소유자입니다.'
  },
  {
    name: '한소희',
    occupation: '배우',
    ageGroup: '30대',
    dominantTrait: '상관 + 역마살',
    points: [
      '자유롭고 솔직한 표현력으로 강렬한 연기 스펙트럼을 보여주는 상관(傷官)',
      '새로운 영역을 과감하게 개척하며 영역을 확장하는 역마살(驛馬煞)',
      '자신만의 독창적 스타일과 매혹적인 무드로 대중을 매료시키는 본질'
    ],
    summary: '틀에 갇히지 않는 거침없는 자유로움과 스웨그! 자신만의 독보적인 컬러로 대중을 완벽히 매료시키는 트렌디 핫걸 사주입니다.'
  },
  {
    name: '안유진',
    occupation: '아이돌/방송인 (아이브)',
    ageGroup: '20대',
    dominantTrait: '식신 + 정관',
    points: [
      '밝고 에너제틱한 친화력으로 대중의 사랑을 받는 식신(食神)의 기운',
      '어디서나 신뢰감을 주며 책임감 있게 그룹을 이끄는 올바른 정관(正官)',
      '예능과 무대를 자유롭게 넘나드는 다재다능한 융합형 리더십'
    ],
    summary: '맑은 에너지와 탄탄한 신뢰감의 완벽한 조화! 밝은 햇살처럼 분위기를 환하게 비추며 전 연령대의 사랑을 한몸에 받는 대세 스타 사주입니다.'
  },
  {
    name: '민지',
    occupation: '아이돌/아티스트 (뉴진스)',
    ageGroup: '20대',
    dominantTrait: '비견 + 정인',
    points: [
      '클래식하면서도 세련된 본연의 아름다움을 지닌 정인(正印)의 기품',
      '주관이 뚜렷하고 당당하여 든든한 안정감을 주는 비견(比肩)의 매력',
      '자연스러움 속에서 빛나는 고급스러운 트렌디 아우라'
    ],
    summary: '단아하고 우아한 클래식한 품격과 현대적 세련미의 조화! 주관이 굳건하고 주위 사람들에게 깊은 신뢰감을 주는 매력 사주입니다.'
  },
  {
    name: '김태리',
    occupation: '배우',
    ageGroup: '30대',
    dominantTrait: '편인 + 상관',
    points: [
      '깊은 몰입력과 독창적 캐릭터 해석 능력을 보여주는 편인(偏印)',
      '생동감 넘치는 표정과 감정 표현으로 시선을 집중시키는 상관(傷官)',
      '한계 없이 발전하는 열정과 예술적 깊이를 지닌 명품 아티스트'
    ],
    summary: '깊이를 가늠할 수 없는 열정과 예술적 영감의 결정체! 한 번 보면 잊히지 않는 순수한 과감함으로 빛나는 명품 아티스트 사주입니다.'
  }
];

export const MALE_MZ_CELEBS: CelebData[] = [
  {
    name: '차은우',
    occupation: '배우/아티스트 (아스트로)',
    ageGroup: '20대',
    dominantTrait: '정관 + 도화살',
    points: [
      '완벽한 비주얼과 품격 있는 아우라를 완성하는 천생 도화살(桃花煞)',
      '바르고 정직하며 어디서나 올바른 태도를 지키는 명품 정관(正官)',
      '대중에게 호감과 안정감을 안겨주는 독보적인 비주얼 킹'
    ],
    summary: '완벽한 품격과 보석처럼 빛나는 외유내강의 정석! 단정함 속에서 분출되는 강렬한 스타성으로 시대를 대표하는 남신 사주입니다.'
  },
  {
    name: '변우석',
    occupation: '배우',
    ageGroup: '30대',
    dominantTrait: '편재 + 역마살',
    points: [
      '따뜻한 다정함과 여유로운 신사다움으로 마음을 설레게 하는 편재(偏財)',
      '넓은 스펙트럼과 당당한 피지컬로 분위기를 압도하는 역마살(驛馬煞)',
      '묵묵한 노력 끝에 빛을 발하는 진정성 넘치는 아이콘'
    ],
    summary: '다정한 미소 뒤에 숨겨진 단단한 열정과 도전 정신! 시대를 흔드는 스윗함과 순수한 매력으로 모두의 마음을 사로잡는 대세 스타 사주입니다.'
  },
  {
    name: 'BTS 뷔 (김태형)',
    occupation: '아티스트/뮤지션',
    ageGroup: '30대',
    dominantTrait: '상관 + 화개살',
    points: [
      '독보적인 예술적 감수성과 독창적 음색을 이끄는 화개살(華蓋煞)',
      '규격화된 틀을 깨부수는 자유로운 스타일리시함의 상관(傷官)',
      '세계적 아이콘으로서의 유니크한 오라와 압도적 비주얼'
    ],
    summary: '한 자릿수로 정의할 수 없는 독보적인 감성과 몽환적 예술성! 대중의 시선을 기분 좋게 뒤흔드는 독창적 아티스트 사주입니다.'
  },
  {
    name: '덱스 (김진영)',
    occupation: '방송인/크리에이터',
    ageGroup: '20대',
    dominantTrait: '편관 + 비견',
    points: [
      '상남자다운 카리스마와 솔직담백한 매력의 편관(偏官)',
      '누구와도 쉽게 친해지는 털털함과 의리를 지닌 비견(比肩)',
      '거침없는 도전과 스릴을 즐기며 대세를 주도하는 행동파'
    ],
    summary: '날것 그대로의 거침없는 매력과 기분 좋은 솔직함! 솔직하고 마초적인 에너지로 남녀노소 매료시키는 트렌디 핫보이 사주입니다.'
  },
  {
    name: '이도현',
    occupation: '배우',
    ageGroup: '20대',
    dominantTrait: '식신 + 정인',
    points: [
      '깊이 있는 목소리와 진정성 있는 연기력의 정인(正印)',
      '주변 사람들을 챙기는 따뜻함과 재치를 지닌 식신(食神)',
      '신뢰감 높은 분위기와 묵직한 몰입감을 선사하는 차세대 연기파'
    ],
    summary: '묵직한 신뢰감과 따뜻한 인간미가 공존하는 명품 배우! 어떤 역할이든 자기것으로 소화해 내는 신뢰와 스펙트럼의 사주입니다.'
  },
  {
    name: '손흥민',
    occupation: '스포츠 스타/아티스트',
    ageGroup: '30대',
    dominantTrait: '식신 + 역마살',
    points: [
      '세계 무대를 누비며 최고의 퍼포먼스를 선보이는 강력한 역마살(驛馬煞)',
      '지치지 않는 열정과 탁월한 재능으로 분야의 정점에 서는 식신(食神)',
      '겸손한 인품과 긍정적인 밝은 에너지로 대중을 매료시키는 정석'
    ],
    summary: '세계 무대를 호령하는 열정과 압도적 기량! 겸손과 밝은 미소로 대중에게 자부심과 영감을 선사하는 월드클래스 사주입니다.'
  }
];

// 결정론적 해시로 동일 인적사항 시 일관된 셀럽 선택
export function selectCelebMatch(input: SajuInput, dayStemIdx: number): typeof FEMALE_MZ_CELEBS[0] {
  const celeblist = input.gender === 'female' ? FEMALE_MZ_CELEBS : MALE_MZ_CELEBS;
  const hash = (input.birthYear * 31 + input.birthMonth * 12 + input.birthDay * 7 + dayStemIdx) % celeblist.length;
  return celeblist[hash];
}

// 사주 원국(년·월·일·시) 맞춤형 작용력(충·합·형·파·해·원진) 동적 감지 인터페이스 및 분석 엔진
export interface DetectedInteraction {
  id: string;
  category: 'chung' | 'hap' | 'hyeong' | 'pa' | 'hae' | 'wonjin';
  categoryKor: string;
  categoryTag: string;
  title: string;
  codeTag: string;
  pairText: string;
  comboText: string;
  locationDesc: string;
  mechanism: string;
  interaction: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  badgeBg: string;
  icon: string;
}

const STEM_HANJA_MAP: Record<string, string> = {
  '갑': '甲', '을': '乙', '병': '丙', '정': '丁', '무': '戊',
  '기': '己', '경': '庚', '신': '辛', '임': '壬', '계': '癸'
};

const BRANCH_HANJA_MAP: Record<string, string> = {
  '자': '子', '축': '丑', '인': '寅', '묘': '卯', '진': '辰', '사': '巳',
  '오': '午', '미': '未', '신': '申', '유': '酉', '술': '戌', '해': '亥'
};

export function detectSajuWonGukInteractions(wonGuk: {
  hourPillar?: { stem?: string; branch?: string; stemHanja?: string; branchHanja?: string };
  dayPillar?: { stem?: string; branch?: string; stemHanja?: string; branchHanja?: string };
  monthPillar?: { stem?: string; branch?: string; stemHanja?: string; branchHanja?: string };
  yearPillar?: { stem?: string; branch?: string; stemHanja?: string; branchHanja?: string };
  isUnknownTime?: boolean;
}): DetectedInteraction[] {
  const normS = (s?: string) => {
    if (!s) return '';
    const map: Record<string, string> = { '甲':'갑','乙':'을','丙':'병','丁':'정','戊':'무','己':'기','庚':'경','辛':'신','壬':'임','癸':'계' };
    return map[s] || s;
  };
  const normB = (b?: string) => {
    if (!b) return '';
    const map: Record<string, string> = { '子':'자','丑':'축','寅':'인','卯':'묘','辰':'진','巳':'사','午':'오','未':'미','申':'신','酉':'유','戌':'술','亥':'해' };
    return map[b] || b;
  };

  const BRANCH_ORDER: Record<string, number> = {
    '자': 1, '축': 2, '인': 3, '묘': 4, '진': 5, '사': 6,
    '오': 7, '미': 8, '신': 9, '유': 10, '술': 11, '해': 12
  };

  const STEM_ORDER: Record<string, number> = {
    '갑': 1, '을': 2, '병': 3, '정': 4, '무': 5,
    '기': 6, '경': 7, '신': 8, '임': 9, '계': 10
  };

  const pillars = [
    ...(wonGuk?.isUnknownTime ? [] : [{ name: '시주', shortName: '시', stem: normS(wonGuk?.hourPillar?.stem), branch: normB(wonGuk?.hourPillar?.branch) }]),
    { name: '일주', shortName: '일', stem: normS(wonGuk?.dayPillar?.stem), branch: normB(wonGuk?.dayPillar?.branch) },
    { name: '월주', shortName: '월', stem: normS(wonGuk?.monthPillar?.stem), branch: normB(wonGuk?.monthPillar?.branch) },
    { name: '년주', shortName: '년', stem: normS(wonGuk?.yearPillar?.stem), branch: normB(wonGuk?.yearPillar?.branch) },
  ];

  const results: DetectedInteraction[] = [];
  const addedKeys = new Set<string>();

  const addInteraction = (item: Omit<DetectedInteraction, 'id'>) => {
    const key = `${item.category}_${item.title}_${item.locationDesc}`;
    if (!addedKeys.has(key)) {
      addedKeys.add(key);
      results.push({ ...item, id: key });
    }
  };

  for (let i = 0; i < pillars.length; i++) {
    for (let j = i + 1; j < pillars.length; j++) {
      const p1 = pillars[i];
      const p2 = pillars[j];
      const b1 = p1.branch;
      const b2 = p2.branch;
      if (!b1 || !b2) continue;

      const s1 = p1.stem;
      const s2 = p2.stem;

      // 12지지 역학적 정순 정렬 (자축인묘진사오미신유술해)
      const bOrder1 = BRANCH_ORDER[b1] || 99;
      const bOrder2 = BRANCH_ORDER[b2] || 99;
      const [firstB, secondB, pFirstB, pSecondB] = bOrder1 <= bOrder2
        ? [b1, b2, p1, p2]
        : [b2, b1, p2, p1];

      // 10천간 역학적 정순 정렬 (갑을병정무기경신임계)
      const sOrder1 = STEM_ORDER[s1] || 99;
      const sOrder2 = STEM_ORDER[s2] || 99;
      const [firstS, secondS, pFirstS, pSecondS] = sOrder1 <= sOrder2
        ? [s1, s2, p1, p2]
        : [s2, s1, p2, p1];

      // --- 지지 충 ---
      const isChung = (b1 === '자' && b2 === '오') || (b1 === '오' && b2 === '자') ||
                      (b1 === '축' && b2 === '미') || (b1 === '미' && b2 === '축') ||
                      (b1 === '인' && b2 === '신') || (b1 === '신' && b2 === '인') ||
                      (b1 === '묘' && b2 === '유') || (b1 === '유' && b2 === '묘') ||
                      (b1 === '진' && b2 === '술') || (b1 === '술' && b2 === '진') ||
                      (b1 === '사' && b2 === '해') || (b1 === '해' && b2 === '사');

      if (isChung) {
        const pairName = `${firstB}${secondB}충`;
        addInteraction({
          category: 'chung',
          categoryKor: '충',
          categoryTag: '변동·개혁',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstB} ⚡ ${secondB}`,
          comboText: `${pFirstB.name}(${BRANCH_HANJA_MAP[firstB] || firstB}) ↔ ${pSecondB.name}(${BRANCH_HANJA_MAP[secondB] || secondB}) (${pairName})`,
          locationDesc: `${pFirstB.name} ${firstB}와 ${pSecondB.name} ${secondB}의 충돌`,
          mechanism: '서로 반대되는 기운이 충돌하여 정체된 에너지를 깨뜨리고 강력한 유동성을 극대화합니다.',
          interaction: '현실 안주를 방지하고 강한 개혁 추진력과 환경 변화 적응력을 불어넣어 줍니다.',
          borderColor: 'border-red-500/40',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: '⚡',
        });
      }

      // --- 천간 충 ---
      const isStemChung = (s1 === '갑' && s2 === '경') || (s1 === '경' && s2 === '갑') ||
                          (s1 === '을' && s2 === '신') || (s1 === '신' && s2 === '을') ||
                          (s1 === '병' && s2 === '임') || (s1 === '임' && s2 === '병') ||
                          (s1 === '정' && s2 === '계') || (s1 === '계' && s2 === '정') ||
                          (s1 === '병' && s2 === '경') || (s1 === '경' && s2 === '병') ||
                          (s1 === '정' && s2 === '신') || (s1 === '신' && s2 === '정');

      if (isStemChung && firstS && secondS) {
        const pairName = `${firstS}${secondS}천간충`;
        addInteraction({
          category: 'chung',
          categoryKor: '충',
          categoryTag: '정신적 결단',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstS} ⚡ ${secondS}`,
          comboText: `${pFirstS.name} 천간(${STEM_HANJA_MAP[firstS] || firstS}) ↔ ${pSecondS.name} 천간(${STEM_HANJA_MAP[secondS] || secondS}) (${pairName})`,
          locationDesc: `${pFirstS.name} 천간 ${firstS}와 ${pSecondS.name} 천간 ${secondS}의 마찰`,
          mechanism: '정신적 영역의 가치관 마찰로 결단력과 주관을 명료하게 만들어 줍니다.',
          interaction: '우유부단함을 걷어내고 목표를 조준하는 명확한 판단 집중력을 높여줍니다.',
          borderColor: 'border-red-500/40',
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-400',
          badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
          icon: '⚡',
        });
      }

      // --- 지지 육합 ---
      const isYukHap = (b1 === '자' && b2 === '축') || (b1 === '축' && b2 === '자') ||
                        (b1 === '인' && b2 === '해') || (b1 === '해' && b2 === '인') ||
                        (b1 === '묘' && b2 === '술') || (b1 === '술' && b2 === '묘') ||
                        (b1 === '진' && b2 === '유') || (b1 === '유' && b2 === '진') ||
                        (b1 === '사' && b2 === '신') || (b1 === '신' && b2 === '사') ||
                        (b1 === '오' && b2 === '미') || (b1 === '미' && b2 === '오');

      if (isYukHap) {
        const pairName = `${firstB}${secondB}합`;
        addInteraction({
          category: 'hap',
          categoryKor: '합',
          categoryTag: '결합·화합',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstB} 🤝 ${secondB}`,
          comboText: `${pFirstB.name}(${BRANCH_HANJA_MAP[firstB] || firstB}) ↔ ${pSecondB.name}(${BRANCH_HANJA_MAP[secondB] || secondB}) (${pairName})`,
          locationDesc: `${pFirstB.name} ${firstB}와 ${pSecondB.name} ${secondB}의 육합`,
          mechanism: '서로 다른 글자가 끌어당겨 합쳐져 긴밀한 친밀성과 화합 에너지를 형성합니다.',
          interaction: '원국 내 충·형의 날카로움을 부드럽게 완화시키며 연대감과 조화로움을 이끌어냅니다.',
          borderColor: 'border-blue-500/40',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: '🤝',
        });
      }

      // --- 천간 오합 ---
      const isStemHap = (s1 === '갑' && s2 === '기') || (s1 === '기' && s2 === '갑') ||
                        (s1 === '을' && s2 === '경') || (s1 === '경' && s2 === '을') ||
                        (s1 === '병' && s2 === '신') || (s1 === '신' && s2 === '병') ||
                        (s1 === '정' && s2 === '임') || (s1 === '임' && s2 === '정') ||
                        (s1 === '무' && s2 === '계') || (s1 === '계' && s2 === '무');

      if (isStemHap && firstS && secondS) {
        const pairName = `${firstS}${secondS}천간합`;
        addInteraction({
          category: 'hap',
          categoryKor: '합',
          categoryTag: '정서적 끌림',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstS} 🤝 ${secondS}`,
          comboText: `${pFirstS.name} 천간(${STEM_HANJA_MAP[firstS] || firstS}) ↔ ${pSecondS.name} 천간(${STEM_HANJA_MAP[secondS] || secondS}) (${pairName})`,
          locationDesc: `${pFirstS.name} 천간 ${firstS}와 ${pSecondS.name} 천간 ${secondS}의 오합`,
          mechanism: '의사소통 및 감정 교류를 촉진하는 온화한 상호 수용 결합 작용입니다.',
          interaction: '타인과의 신뢰 형성 및 유대 관계 구축에 자연스러운 호감도를 높여줍니다.',
          borderColor: 'border-blue-500/40',
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: '🤝',
        });
      }

      // --- 지지 형 ---
      const isHyeong = (b1 === '인' && b2 === '사') || (b1 === '사' && b2 === '인') ||
                       (b1 === '사' && b2 === '신') || (b1 === '신' && b2 === '사') ||
                       (b1 === '인' && b2 === '신') || (b1 === '신' && b2 === '인') ||
                       (b1 === '축' && b2 === '술') || (b1 === '술' && b2 === '축') ||
                       (b1 === '술' && b2 === '미') || (b1 === '미' && b2 === '술') ||
                       (b1 === '축' && b2 === '미') || (b1 === '미' && b2 === '축') ||
                       (b1 === '자' && b2 === '묘') || (b1 === '묘' && b2 === '자');

      if (isHyeong) {
        const pairName = `${firstB}${secondB}형`;
        addInteraction({
          category: 'hyeong',
          categoryKor: '형',
          categoryTag: '정밀 조정',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstB} ⚖️ ${secondB}`,
          comboText: `${pFirstB.name}(${BRANCH_HANJA_MAP[firstB] || firstB}) ↔ ${pSecondB.name}(${BRANCH_HANJA_MAP[secondB] || secondB}) (${pairName})`,
          locationDesc: `${pFirstB.name} ${firstB}와 ${pSecondB.name} ${secondB}의 형살 작용`,
          mechanism: '불필요한 부분을 다듬고 엄격하게 가공하는 칼날 같은 미세 정비 작용입니다.',
          interaction: '사리분별과 정밀한 완성도를 완성하며 기술·분석·전문가적 역량을 높여줍니다.',
          borderColor: 'border-amber-500/40',
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: '⚖️',
        });
      }

      // 自刑 (진진, 오오, 유유, 해해)
      if (b1 === b2 && ['진', '오', '유', '해'].includes(b1)) {
        const pairName = `${b1}${b2}자형`;
        addInteraction({
          category: 'hyeong',
          categoryKor: '형',
          categoryTag: '완벽주의',
          title: pairName,
          codeTag: pairName,
          pairText: `${b1} ⚖️ ${b2}`,
          comboText: `${p1.name}(${BRANCH_HANJA_MAP[b1] || b1}) ↔ ${p2.name}(${BRANCH_HANJA_MAP[b2] || b2}) (${pairName})`,
          locationDesc: `${p1.name} ${b1}와 ${p2.name} ${b2}의 자형 중첩`,
          mechanism: '동일 기운이 중첩되어 자신의 기준을 검증하는 완벽주의 성찰 작용입니다.',
          interaction: '집중력을 극대화하여 기술이나 학문 분야에서 높은 디테일을 완성합니다.',
          borderColor: 'border-amber-500/40',
          bgColor: 'bg-amber-500/10',
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: '⚖️',
        });
      }

      // --- 지지 파 ---
      const isPa = (b1 === '자' && b2 === '유') || (b1 === '유' && b2 === '자') ||
                   (b1 === '축' && b2 === '진') || (b1 === '진' && b2 === '축') ||
                   (b1 === '인' && b2 === '해') || (b1 === '해' && b2 === '인') ||
                   (b1 === '묘' && b2 === '오') || (b1 === '오' && b2 === '묘') ||
                   (b1 === '사' && b2 === '신') || (b1 === '신' && b2 === '사') ||
                   (b1 === '술' && b2 === '미') || (b1 === '미' && b2 === '술');

      if (isPa) {
        const pairName = `${firstB}${secondB}파`;
        addInteraction({
          category: 'pa',
          categoryKor: '파',
          categoryTag: '구조 재편',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstB} 🔨 ${secondB}`,
          comboText: `${pFirstB.name}(${BRANCH_HANJA_MAP[firstB] || firstB}) ↔ ${pSecondB.name}(${BRANCH_HANJA_MAP[secondB] || secondB}) (${pairName})`,
          locationDesc: `${pFirstB.name} ${firstB}와 ${pSecondB.name} ${secondB}의 개편`,
          mechanism: '고착된 틀에 미세 균열을 주어 최신 흐름에 맞게 시스템을 업그레이드합니다.',
          interaction: '시대 변화에 발맞추어 체질을 바꾸는 기민한 유연성과 창의 재탄생 기운입니다.',
          borderColor: 'border-purple-500/40',
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-400',
          badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          icon: '🔨',
        });
      }

      // --- 지지 해 ---
      const isHae = (b1 === '자' && b2 === '미') || (b1 === '미' && b2 === '자') ||
                    (b1 === '축' && b2 === '오') || (b1 === '오' && b2 === '축') ||
                    (b1 === '인' && b2 === '사') || (b1 === '사' && b2 === '인') ||
                    (b1 === '묘' && b2 === '진') || (b1 === '진' && b2 === '묘') ||
                    (b1 === '신' && b2 === '해') || (b1 === '해' && b2 === '신') ||
                    (b1 === '유' && b2 === '술') || (b1 === '술' && b2 === '유');

      if (isHae) {
        const pairName = `${firstB}${secondB}해`;
        addInteraction({
          category: 'hae',
          categoryKor: '해',
          categoryTag: '세심 검증',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstB} ⚡ ${secondB}`,
          comboText: `${pFirstB.name}(${BRANCH_HANJA_MAP[firstB] || firstB}) ↔ ${pSecondB.name}(${BRANCH_HANJA_MAP[secondB] || secondB}) (${pairName})`,
          locationDesc: `${pFirstB.name} ${firstB}와 ${pSecondB.name} ${secondB}의 육해`,
          mechanism: '지나치기 쉬운 허점이나 숨은 유의점을 감지하는 방어적 점검 작용입니다.',
          interaction: '성급함을 막아주고 이면의 조건까지 다각도로 점검하는 리스크 관리력입니다.',
          borderColor: 'border-orange-500/40',
          bgColor: 'bg-orange-500/10',
          textColor: 'text-orange-400',
          badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          icon: '⚡',
        });
      }

      // --- 원진살 ---
      const isWonjin = (b1 === '자' && b2 === '미') || (b1 === '미' && b2 === '자') ||
                       (b1 === '축' && b2 === '오') || (b1 === '오' && b2 === '축') ||
                       (b1 === '인' && b2 === '유') || (b1 === '유' && b2 === '인') ||
                       (b1 === '묘' && b2 === '신') || (b1 === '신' && b2 === '묘') ||
                       (b1 === '진' && b2 === '해') || (b1 === '해' && b2 === '진') ||
                       (b1 === '사' && b2 === '술') || (b1 === '술' && b2 === '사');

      if (isWonjin) {
        const pairName = `${firstB}${secondB}원진`;
        addInteraction({
          category: 'wonjin',
          categoryKor: '원진',
          categoryTag: '예리한 직관',
          title: pairName,
          codeTag: pairName,
          pairText: `${firstB} 👁️ ${secondB}`,
          comboText: `${pFirstB.name}(${BRANCH_HANJA_MAP[firstB] || firstB}) ↔ ${pSecondB.name}(${BRANCH_HANJA_MAP[secondB] || secondB}) (${pairName})`,
          locationDesc: `${pFirstB.name} ${firstB}와 ${pSecondB.name} ${secondB}의 원진`,
          mechanism: '섬세한 관찰력과 영감으로 본질과 이면을 단번에 파악하는 직관적 기운입니다.',
          interaction: '독창적 아이디어와 남다른 관찰력을 키워 예술·학문·분석 기운을 돕습니다.',
          borderColor: 'border-cyan-500/40',
          bgColor: 'bg-cyan-500/10',
          textColor: 'text-cyan-400',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          icon: '👁️',
        });
      }
    }
  }

  // --- 삼합 (Three Triads) Check across all 4 branches ---
  const allBranches = pillars.map(p => p.branch);
  const hasB = (b: string) => allBranches.includes(b);

  if (hasB('신') && hasB('자') && hasB('진')) {
    addInteraction({
      category: 'hap',
      categoryKor: '합',
      categoryTag: '삼합 수국',
      title: '신자진 삼합',
      codeTag: '신자진 삼합',
      pairText: '신 · 자 · 진 삼합',
      comboText: '원국 지지 전체(申·子·辰) (신자진 삼합)',
      locationDesc: '원국 내 신·자·진 지지의 수국 결합',
      mechanism: '수(水) 기운의 거대한 연대로 폭넓은 지혜와 유동성을 극대화합니다.',
      interaction: '유연성과 글로벌 확장력, 폭넓은 정신적 지평을 불어넣어 줍니다.',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: '🌊',
    });
  }
  if (hasB('인') && hasB('오') && hasB('술')) {
    addInteraction({
      category: 'hap',
      categoryKor: '합',
      categoryTag: '삼합 화국',
      title: '인오술 삼합',
      codeTag: '인오술 삼합',
      pairText: '인 · 오 · 술 삼합',
      comboText: '원국 지지 전체(寅·午·戌) (인오술 삼합)',
      locationDesc: '원국 내 인·오·술 지지의 화국 결합',
      mechanism: '화(火) 기운의 연대로 열정과 대중적 존재감을 극대화합니다.',
      interaction: '무대에서의 존재감과 창의적 열정을 높여주는 활력소입니다.',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: '🔥',
    });
  }
  if (hasB('사') && hasB('유') && hasB('축')) {
    addInteraction({
      category: 'hap',
      categoryKor: '합',
      categoryTag: '삼합 금국',
      title: '사유축 삼합',
      codeTag: '사유축 삼합',
      pairText: '사 · 유 · 축 삼합',
      comboText: '원국 지지 전체(巳·酉·丑) (사유축 삼합)',
      locationDesc: '원국 내 사·유·축 지지의 금국 결합',
      mechanism: '금(金) 기운의 연대로 단호한 결단과 강력한 체계를 구축합니다.',
      interaction: '체계성과 실리 중심의 확고한 원칙 감각을 완성해 줍니다.',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: '⚔️',
    });
  }
  if (hasB('해') && hasB('묘') && hasB('미')) {
    addInteraction({
      category: 'hap',
      categoryKor: '합',
      categoryTag: '삼합 목국',
      title: '해묘미 삼합',
      codeTag: '해묘미 삼합',
      pairText: '해 · 묘 · 미 삼합',
      comboText: '원국 지지 전체(亥·卯·未) (해묘미 삼합)',
      locationDesc: '원국 내 해·묘·미 지지의 목국 결합',
      mechanism: '목(木) 기운의 연대로 생기와 기획 성장력을 발휘합니다.',
      interaction: '새로운 과제를 기획하고 사람을 이끄는 성장 추진력입니다.',
      borderColor: 'border-blue-500/40',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      icon: '🌿',
    });
  }

  const orderMap: Record<string, number> = { chung: 1, hap: 2, hyeong: 3, pa: 4, hae: 5, wonjin: 6 };
  results.sort((a, b) => (orderMap[a.category] || 99) - (orderMap[b.category] || 99));

  return results;
}

export const DEFAULT_WON_GUK = calculateSajuWonGuk({
  name: '김지훈',
  gender: 'male',
  birthYear: 1992,
  birthMonth: 5,
  birthDay: 20,
  calendarType: 'solar',
  birthHour: '오시 (11:30~13:29)',
  isUnknownTime: false,
});

