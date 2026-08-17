import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SajuAnalysisResult, SavedSajuItem, SavedGunghapResult, SavedWongukResult, SavedPremiumReport } from './types';
import { getTenGodGroupForElement, calculateTenGodForChar, getJijangganInfo, getJijangganList, getPillarSinsalGilsin, calculate12Unseong, calculateSajuWonGuk, selectCelebMatch, STEMS, detectSajuWonGukInteractions, DEFAULT_WON_GUK } from './data/sajuCalculations';

const getKSTTodayString = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 3600000));
  const yyyy = kst.getFullYear();
  const mm = String(kst.getMonth() + 1).padStart(2, '0');
  const dd = String(kst.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
};

const getKSTDateKey = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 3600000));
  const yyyy = kst.getFullYear();
  const mm = String(kst.getMonth() + 1).padStart(2, '0');
  const dd = String(kst.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

function generateFullGunghapReport(mySaju: SavedSajuItem, targetSaju: SavedSajuItem): SavedGunghapResult {
  const myDayStem = mySaju.dayMasterStr || mySaju.dayPillarStr?.charAt(0) || '갑';
  const targetDayStem = targetSaju.dayMasterStr || targetSaju.dayPillarStr?.charAt(0) || '을';

  let baseScore = 82;
  if (myDayStem === targetDayStem) baseScore += 5;
  const charSum = (mySaju.name.length + targetSaju.name.length + mySaju.birthYear + targetSaju.birthYear) % 15;
  const score = Math.min(98, Math.max(72, baseScore + charSum - 3));

  const createdAt = getKSTTodayString();
  const createdAtTimestamp = Date.now();

  const summary = `【${mySaju.name}】 님과 【${targetSaju.name}】 님의 명리학적 사주 결합 지수는 ${score}점입니다. 두 사람의 사주 원국에서 발현되는 오행의 기운과 음양의 결합력이 유연하게 맞물려 인연의 성숙도와 깊이가 매우 뛰어난 명리학적 화합 구조를 이루고 있습니다.`;

  const overall = `두 사람의 사주 원국을 정밀하게 대조한 결과, ${mySaju.name} 님의 본질적 일간(日干) 기운과 ${targetSaju.name} 님의 사주 오행 기운이 서로의 단점을 정밀하게 보완하고 장점을 극대화하는 강력한 상생(相生) 에너지 흐름을 형상화합니다. 십성과 지지(地支)의 오행 조화가 유연하게 형성되어 첫 만남부터 서로에게 특별한 인상과 친근함, 정서적 안도감을 강하게 느끼게 됩니다.

명리학적으로 한 사람에게 부족하거나 과 과다한 오행의 쏠림을 상대방이 넉넉하고 온화하게 상쇄해주는 기운의 밸런스가 조화롭게 흐르고 있습니다. 시간이 지남에 따라 단순한 호감이나 일시적인 이끌림을 넘어 깊은 신뢰와 존중을 바탕으로 한 인연의 틀을 구축하게 됩니다. 삶의 예기치 못한 난관이나 환경적 풍파가 찾아오더라도, 두 사람만의 독보적인 상생 지혜로 서로의 든든한 버팀목이 되어 굳건하게 헤쳐나갈 수 있는 강인한 궁합 결속력을 지니고 있습니다.`;

  const personality = `${mySaju.name} 님의 솔직하고 직관적인 의사소통 스타일과 ${targetSaju.name} 님의 깊은 배려심 및 정교한 감정 리액션이 대화 속에서 오행의 완벽한 밸런스를 창출합니다. 서로의 생각과 감정을 공유할 때 억지스러운 부딪힘보다는 존중과 이성적 수용이 먼저 작용하며, 사소한 의견 차이나 생활 습관의 다름이 생기더라도 상대를 먼저 이해하려는 음양의 유연함 덕분에 신속하고 긍정적인 관계 회복력을 발휘합니다.

특히 상대방의 언어 너머에 숨겨진 감정선과 미묘한 심리적 이상을 예리하게 감지해내는 감응력이 탁월합니다. 서로에게 마음의 짐이나 고민을 숨김없이 털어놓을 수 있는 최고의 정서적 멘토이자, 삶의 중요한 순간마다 명확한 이성적 조언과 진심 어린 위로를 주고받는 대화 상대로서 완벽한 인연의 호합을 보여줍니다.`;

  const love = `애정운과 연애적 이끌림에 있어서 두 사람은 강렬한 열정적 인력과 따뜻한 정서적 안정감을 동시에 선사하는 이상적인 궁합 원국을 지니고 있습니다. ${mySaju.name} 님이 가진 독보적인 캐릭터와 매력이 ${targetSaju.name} 님의 다정하고 온화한 기운과 만나 서로에게 대체 불가능한 유일한 존재이자 평온한 안식처가 되어줍니다.

연애 기간이 길어질수록 서로를 향한 존중과 애정의 깊이가 더욱 단단해지며, 명리학적으로 연인 간의 화합과 정서적 결속을 돕는 길신(吉神)과 유연한 기운이 상존합니다. 시간이 지날수록 단순한 순간의 감정적 설렘을 넘어서 서로의 삶 전체에 자연스럽고 깊숙하게 스며드는 애정의 밀도를 자랑합니다. 각자의 오행적 고유성이 상대의 결점을 따뜻하게 감싸안으며, 만남이 지속될수록 서정적이고 감동적인 애정의 깊이감을 더해갑니다.`;

  const life = `가치관과 생활 양식, 그리고 미래 지향성에 있어서는 실용성과 내실을 함께 중시하는 공통 분모가 매 우 큽니다. 재물운과 경제적 관념, 그리고 미래 생활 설계에 대해 진솔하게 이야기를 나눌 때 놀라울 정도로 합이 잘 맞으며, 서로의 목표 달성과 동반 성장을 진심으로 격려하고 이끌어주는 페이스메이커 역할을 수행합니다.

돈과 자산을 효율적으로 모으고 관리하는 경제적 방향성이 서로 일치하여, 함께 재무 계획을 세우고 먼 미래를 동반 설계할 때 커다란 시너지 효과를 발휘합니다. 일상 속 소소한 생활 패턴이나 개인적 취향의 차이가 있더라도, 서로의 개별적 공간과 자율성을 기꺼이 존중해주는 현명함이 기본 바탕에 깔려 있어 매우 안정적이고 지속가능한 성숙한 관계를 유지해나갑니다.`;

  const keyPoints = [
    `✨ 오행 상생 조화: ${mySaju.name} 님과 ${targetSaju.name} 님의 일간·지지가 견고한 상생 구조를 이루어 깊은 신뢰와 안정감을 구축합니다.`,
    `💬 정서적 대화 케미: 감정 교류 시 음양의 조화가 뛰어나 갈등을 원천 차단하고 최선의 지혜로운 협력 관계를 유지합니다.`,
    `💡 동반 성장 가이드: 서로의 독자적인 공간과 개성을 존중해줄 때 두 사람의 사주 운이 함께 대길(大吉)하여 무궁한 시너지를 냅니다.`
  ];

  return {
    id: `gh_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    mySajuId: mySaju.id,
    mySajuName: mySaju.name,
    targetSajuId: targetSaju.id,
    targetSajuName: targetSaju.name,
    targetBirthYear: targetSaju.birthYear,
    targetBirthMonth: targetSaju.birthMonth,
    targetBirthDay: targetSaju.birthDay,
    targetGender: targetSaju.gender,
    score,
    createdAt,
    createdAtTimestamp,
    summary,
    overall,
    personality,
    love,
    life,
    keyPoints
  };
}

function generateFullWongukReport(saju: SavedSajuItem, analysisType: 'detail' | 'deep' = 'detail', isPremium: boolean = false): SavedWongukResult {
  const dayMaster = saju.dayMasterStr || saju.dayPillarStr?.charAt(0) || '갑';
  const createdAt = getKSTTodayString();
  const createdAtTimestamp = Date.now();

  const summary = `【${saju.name}】 님의 사주 원국 정밀 분석 결과입니다. 타고난 일간(${dayMaster})의 본질적 음양오행과 사주 4기둥의 십성·신살 배치를 입체적으로 종합 정밀 해독하였습니다.`;

  const overall = `【1. 사주 원국 총평 및 타고난 핵심 본질】
${saju.name} 님의 사주 원국은 타고난 일간(${dayMaster})의 기운을 중심으로 음양오행의 균형감이 돋보이는 명리학적 고유성을 지니고 있습니다. 사주는 태어난 해, 달, 날, 시의 네 기둥(四柱)과 여덟 글자(八字)로 이루어지며, 이는 개인이 세상에 태어날 때 부여받은 에너지의 지도이자 타고난 본질적 기질을 선명하게 보여줍니다.

${saju.name} 님은 주체적이고 독립적인 자아 의식이 뚜렷하여 어떤 환경에 놓이더라도 자신의 신념과 가치관을 당당하게 지켜내는 견고한 정신적 중심축을 갖추고 있습니다. 상황을 판단하고 분석할 때 감정에 쉽게 휩쓸리기보다는 객관적인 명분과 논리적 이성을 우선시하는 명철함이 있으며, 한 번 목표를 설정하면 은근한 추진력과 강인한 집념으로 꾸준하게 성과를 쌓아올리는 성실함이 배어 있습니다.

명리학적으로 사주 원국 내에 흐르는 기운은 본인 고유의 창의적 직관력과 현실적 실행력을 조화롭게 자극합니다. 겉으로는 온화하고 안정적인 태도를 유지하지만, 내면에는 자신만의 높은 기준과 확실한 자존감이 자리 잡고 있어 타인의 시선이나 무분별한 유행에 부화뇌동하지 않고 자신만의 삶의 궤적을 묵묵히 개척해나가는 독보적인 기상을 지니고 있습니다.`;

  const tenGodsAndElements = `【2. 십성(十神)과 오행(五行) 정밀 해독】
사주 원국을 관장하는 십성(비견·겁재·식신·상관·편재·정재·편관·정관·편인·정인)의 배치는 ${saju.name} 님의 삶에서 어떠한 방식으로 역량이 발휘되고 인간관계가 이루어지는지를 정밀하게 조명합니다.

${saju.name} 님의 원국에는 자기 확신과 자립심을 상징하는 비겁(比劫)의 정당한 기운과, 자신의 생각과 창의성을 현실로 표현해내는 식상(食傷)의 유연한 기운이 조화롭게 작용하고 있습니다. 이는 단순한 이론적 지식이나 구상에 머무르지 않고, 실제로 아이디어를 기획하고 실행하여 형상화하는 탁월한 스킬을 부여합니다. 또한, 원국에 자리한 재성(財星)과 관성(官星)의 기운은 현실 감각과 조직적 책임감을 배가시켜 주어, 자유로운 창의력 발휘 속에서도 조직의 규율과 현실적인 리스크 관리의 끈을 놓지 않는 균형 잡힌 명리학적 구조를 완성합니다.

오행의 순환 구조 측면에서는 목(木)의 성장 에너지, 화(火)의 열정과 표현력, 토(土)의 중용과 신용, 금(金)의 예리한 결단력, 수(水)의 지혜와 수용성이 상생하며 흐르고 있습니다. 특정 오행으로의 극단적인 쏠림이 적고 기운의 소통이 원활하여, 삶의 기로에서 위기가 찾아오더라도 내면의 원천 에너지를 통해 신속하게 자정 작용을 일으키는 유연하고 기품 있는 원국 체계를 보유하고 있습니다.`;

  const wealthAndCareer = `【3. 타고난 재물운 및 직업적 적성】
${saju.name} 님의 재물운은 일시적인 요행이나 투기적 성향보다는, 자신의 전문적 역량과 정당한 노동, 신뢰를 바탕으로 한 시스템 구축을 통해 차곡차곡 자산을 증식해나가는 정재(正財) 및 성실재(誠實財) 중심의 견고한 구조를 형성하고 있습니다.

타고난 분석력과 개성적 추진력이 상존하여 한 번 인연을 맺은 전문 분야에서 자신만의 압도적인 노하우와 입지를 다질 때 가장 강력한 수복(壽福)과 재물 창출력이 발현됩니다. 무모한 고위험 투자나 불확실한 사업적 확장보다는, 명확한 근거와 확실한 시장성에 기초한 자산운용 및 사업 기획이 훨씬 유리합니다.

직업적 적성에 있어서는 전문성을 요구하는 전문직, 연구 기획, 교육 및 컨설팅, 콘텐츠 및 예술 창작, 또는 조직 내에서 핵심적 전략을 수립하고 기획을 통솔하는 리더 및 전문 위원 분야에서 독보적인 기량을 발휘합니다. 사주에 내재된 책임감과 깊이 있는 통찰력이 합쳐져 시간이 흐를수록 업계와 조직 내에서 높은 명예와 함께 안정적인 경제적 결실을 지속적으로 수확하게 되는 귀한 운을 지니고 있습니다.`;

  const loveAndRelations = `【4. 애정운과 인간관계 및 인복】
인간관계와 애정에 있어서 ${saju.name} 님은 경솔한 인연 맺기를 자제하고, 깊은 신뢰와 존중을 바탕으로 진실된 관계를 선호하는 고결한 인복의 소유자입니다.

타인과의 관계에서 처음에는 일정한 거리를 두고 신중하게 상대를 탐색하지만, 한 번 마음을 열고 진정한 인연으로 인정한 상대에게는 온 마음을 다해 진심 어린 조력과 변함없는 의리를 보여줍니다. 타인의 감정을 헤아리는 섬세한 감수성과 배려심이 깊어 주변 사람들에게 든든한 정신적 버팀목이자 깊은 신뢰를 주는 인물로 평가받습니다.

애정운에 있어서는 단순한 외형적 조건이나 순간적인 호기심보다는, 상호 간의 대화 케미와 가치관의 일치, 그리고 깊은 이성적 존중을 중요하게 생각합니다. 자신의 고유한 성향과 자율성을 너그럽게 인정해주고, 서로의 성장을 격려해줄 수 있는 성숙한 파트너를 만났을 때 최고의 정서적 안락함과 평화로운 보금자리를 구축합니다. 사주에 길신과 상생의 기운이 깃들어 있어, 결혼이나 장기적인 동반자 관계를 맺을 때 서서히 가운(家運)이 더 크게 융성해지는 길한 구조를 지니고 있습니다.`;

  const lifeFlowAndAdvice = `【5. 삶의 대운 흐름 및 대길(大吉) 지혜】
${saju.name} 님의 삶의 대운(大運) 흐름은 초년과 중년을 지나 장년으로 접어들수록 타고난 오행의 결실이 크게 맺어지는 대기만성(大器晚成) 및 후복(後福)형의 순탄한 궤적을 그려냅니다.

인생의 중요한 전환기마다 스스로의 한계를 시험하는 도전 과제가 주어질 수 있으나, 사주 원국에 숨겨진 귀인(貴人)의 덕과 내면의 강인한 자정 작용 덕분에 고난을 오히려 새로운 도약의 발판으로 반전시키는 명리학적 역전의 힘을 갖고 있습니다.

삶을 더욱 대길(大吉)하게 이끌기 위한 명리학적 개운(開運)의 지혜는 다음과 같습니다. 첫째, 자신의 뛰어난 직관과 분석력을 믿되 혼자서 모든 짐을 짊어지려 하지 말고 주변의 유능한 조력자들과 지혜롭게 협력하는 개방성을 유지하는 것입니다. 둘째, 바쁜 일상 속에서 주기적으로 단전호흡, 명상, 자연과의 교류를 통해 수(水)와 화(火)의 수승화강(水昇火降) 밸런스를 조율하면 정신적 청명함과 육체적 활력이 한층 배가됩니다. 타고난 사주 원국의 품격이 높으므로, 자신감을 갖고 자신의 길을 소신 있게 걸어갈 때 세상의 높은 명예와 평안한 결실이 항상 함께할 것입니다.`;

  const keyPoints = [
    `☯️ 일간 중심의 견고한 원국: 타고난 자아 중심축과 주관이 뚜렷하여 어떠한 환경에서도 흔들림 없는 독보적 주도권을 발휘합니다.`,
    `💡 전문성과 자산의 안정적 증식: 요행보다는 전문적 노하우와 시스템 구축을 통해 명예와 견고한 재물 결실을 차곡차곡 이룹니다.`,
    `✨ 성숙한 인복과 개운 지혜: 신뢰를 바탕으로 한 진실된 인연과 유연한 소통을 이어갈 때 삶의 대운과 후복(後福)이 한층 풍요로워집니다.`
  ];

  return {
    id: `wk_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    sajuId: saju.id,
    sajuName: saju.name,
    gender: saju.gender,
    birthYear: saju.birthYear,
    birthMonth: saju.birthMonth,
    birthDay: saju.birthDay,
    birthTime: saju.birthTime,
    dayMasterStr: saju.dayMasterStr,
    analysisType,
    isPremium,
    createdAt,
    createdAtTimestamp,
    summary,
    overall,
    tenGodsAndElements,
    wealthAndCareer,
    loveAndRelations,
    lifeFlowAndAdvice,
    keyPoints,
  };
}

function getDayMasterFullDisplay(dayMasterStr?: string, dayPillarStr?: string): string {
  const char = dayMasterStr?.trim().charAt(0) || dayPillarStr?.trim().charAt(0) || '';
  const stemMap: Record<string, string> = {
    '갑': '갑목(甲木)', '甲': '갑목(甲木)',
    '을': '을목(乙木)', '乙': '을목(乙木)',
    '병': '병화(丙火)', '丙': '병화(丙火)',
    '정': '정화(丁火)', '丁': '정화(丁火)',
    '무': '무토(戊土)', '戊': '무토(戊土)',
    '기': '기토(己土)', '己': '기토(己土)',
    '경': '경금(庚金)', '庚': '경금(庚金)',
    '신': '신금(辛金)', '辛': '신금(辛金)',
    '임': '임수(壬水)', '壬': '임수(壬水)',
    '계': '계수(癸水)', '癸': '계수(癸水)',
  };
  const mapped = stemMap[char];
  if (mapped) return `일간 ${mapped}`;
  if (char) return `일간 ${char}`;
  return '일간 정보 없음';
}

function getWongukBadgeInfo(item: { analysisType?: 'detail' | 'deep' | string; isPremium?: boolean }) {
  if (item.analysisType === 'deep') {
    return {
      label: 'PREMIUM 심층분석',
      className: 'bg-amber-500/15 text-amber-300 border-amber-400/35',
    };
  }
  if (item.isPremium) {
    return {
      label: 'PREMIUM 상세분석',
      className: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/35',
    };
  }
  return {
    label: '무료 상세분석',
    className: 'bg-purple-500/20 text-purple-300 border-purple-400/35',
  };
}

const GILSIN_DESC: Record<string, string> = {
  '천을귀인': '최고의 길신으로 위기와 난관 속에서 귀인의 도움과 인복을 받아 안정적으로 발전합니다.',
  '태극귀인': '어려움 속에서도 극적인 반전과 상위 조력자의 도움으로 중심을 찾아 안정적으로 입지를 구축합니다.',
  '천복귀인': '하늘이 내린 복록이 임하여 삶의 기반이 견고해지고 지속적인 보살핌과 혜택을 받습니다.',
  '문창귀인': '총명한 지혜와 학문, 문장 표현력이 뛰어나며 논리적인 총기로 결실을 맺습니다.',
  '문곡귀인': '예술적 감수성과 문화적 소양이 깊으며 예리한 학식과 지적인 창의력을 발휘합니다.',
  '천주귀인': '식복과 평안함이 넘치며 타인을 품는 후덕함과 물질적 유복함을 안겨줍니다.',
  '월덕귀인': '달의 은혜와 덕을 받아 재앙을 줄이고 귀인의 안팎 조력으로 평화와 안정을 누립니다.',
  '천덕귀인': '하늘의 덕과 보호를 받아 흉함을 길함으로 돌려놓고 인복과 평안을 가져다줍니다.',
  '금여': '황금마차를 뜻하는 길성으로 온화함과 배우자복, 안락하고 풍요로운 환경을 가져다줍니다.',
  '학당귀인': '학문과 교직, 연구 분야에서 탁월한 수완을 발휘하며 스승과 학계의 인정을 받습니다.',
  '복성귀인': '뜻밖의 행운과 성실한 수복(壽福)이 따라서 한 평생 평탄하고 유복하게 성과를 이룹니다.',
  '관귀학관': '관운과 학문이 결합되어 관직, 승진, 입신양명의 기회를 잡고 사회적 명예를 높입니다.',
  '협록': '녹봉을 협조받듯 양옆 귀인의 은밀한 조력과 후원으로 재물과 기회를 얻습니다.',
  '암록': '보이지 않는 곳에서 뜻밖의 조력자나 은인이 나타나 고난을 극복하고 재운을 보태줍니다.',
  '건록': '주체적인 자립심과 강인한 실행력, 당당한 기상으로 스스로 재물과 성공의 기반을 세웁니다.',
};

const SINSAL_DESC: Record<string, string> = {
  '역마살': '역동적인 추진력과 적극적인 활동성으로 전국, 해외, 사방으로 영역을 넓힙니다.',
  '도화살': '대중을 사로잡는 독보적인 매력과 스타일리시한 스타성으로 주목을 집중시킵니다.',
  '화개살': '깊은 학문적 탐구력과 예리한 예술적 감수성, 내면 성찰과 창작의 영감을 발현합니다.',
  '현침살': '바늘처럼 예리한 분석력과 직관을 바탕으로 의료, IT, 세밀한 전문 분야에서 기량을 발휘합니다.',
  '홍염살': '상대를 매료시키는 치명적인 친화력과 다정함으로 만인의 호감과 애정을 이끌어냅니다.',
  '백호살': '강렬한 에너지와 강력한 돌파력으로 난관을 제압하며 압도적인 리더십을 드러냅니다.',
  '비인살': '날카로운 의지력과 강한 집중력으로 시련에 굴하지 않고 묵묵히 목표를 달성합니다.',
  '지살': '자발적인 변화와 터전 이동, 새로운 시작을 위한 진취적 기반을 주도적으로 만듭니다.',
  '고란살': '독립적이고 주체성이 매우 강하여 타인에게 의존하지 않고 홀로 개척하는 외유내강의 힘을 갖습니다.',
  '반안살': '말 안장 위에 올라앉듯 출세와 편안한 직위, 승진 및 명예를 보장받는 좋은 길성입니다.',
  '천살': '거스를 수 없는 하늘의 과제와 높은 지향점을 통해 내면의 신념과 거대한 성숙을 이룹니다.',
  '육해살': '세밀한 신속함과 기민한 대응력으로 복잡한 문제 상황을 빠르게 파악하고 조율합니다.',
  '월살': '어두운 밤을 밝히는 달빛처럼 어려움 속에서도 불빛 같은 조력과 반사적 이익을 얻습니다.',
  '재살': '예리한 꾀와 전략, 비상한 임기응변으로 위기 상황을 역전시키는 지혜를 발휘합니다.',
  '겁살': '과감한 결단력과 빼앗기지 않으려는 강한 집념으로 승부사적 기질을 과시합니다.',
  '망신살': '솔직하고 과감한 자기 표현과 솔직함으로 주위의 시선을 모으고 개성을 부각시킵니다.',
  '원진살': '섬세한 감정의 선과 복잡한 내면 심리를 잘 다루어 타인의 세밀한 마음을 읽어냅니다.',
  '귀문관살': '영적 직관력과 천재적인 독창성, 집중력으로 아무도 생각지 못한 영감을 창출합니다.',
  '양인살': '칼을 쥔 듯한 비상한 권력과 칼같은 추진력, 카리스마로 세상을 장악합니다.',
  '괴강살': '총명하고 대범하며 세상을 통솔하는 지도자적 위엄과 거침없는 도약의 힘을 떨칩니다.',
  '장성살': '군대의 장수처럼 강력한 리더십과 주도권, 추진력으로 무리를 이끌고 승리를 거둡니다.',
  '(日)공망': '일주 기준 공망으로 비움과 해탈의 기운이며, 얽매이지 않는 자유로운 창의력과 직관을 키워줍니다.',
  '(年)공망': '년주 기준 공망으로 선조나 조상의 인연에 얽매이지 않고 주도적으로 자신만의 길을 개척합니다.',
  '공망': '공허함을 비움으로 승화시켜 세속적 탐욕을 뛰어넘는 고도의 정신적 직관과 창의를 발휘합니다.',
};

function renderPillarAnalysisContent(
  pillarType: 'year' | 'month' | 'day' | 'hour',
  sg: { sinsal: string[]; gilsin: string[] },
  onSelectDetail?: (name: string, type: 'sinsal' | 'gilsin') => void
) {
  const activeGilsin = sg.gilsin.filter(g => g && g !== '-');
  const activeSinsal = sg.sinsal.filter(s => s && s !== '-');
  const hasItems = activeGilsin.length > 0 || activeSinsal.length > 0;

  return (
    <div className="px-3.5 pb-3.5 text-xs text-gray-200 space-y-3 border-t border-gray-800/80 pt-3">
      {/* 신살 목록 */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-[11px] font-bold text-orange-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block"></span>
            <span>신살</span>
          </div>
          {pillarType === 'year' && (
            <span className="text-[10.5px] text-lime-300/90 font-normal tracking-tight">
              ▼ 미니박스를 터치해서 뜻을 확인해보세요
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 pl-2">
          {activeSinsal.length > 0 ? (
            activeSinsal.map((item, idx) => (
              <button
                type="button"
                key={`sinsal-${idx}`}
                onClick={() => onSelectDetail && onSelectDetail(item, 'sinsal')}
                className="inline-flex items-center justify-center bg-[#8C3B2B] hover:bg-[#a64532] text-orange-100 font-semibold text-xs px-2.5 py-1 leading-none rounded-md border border-orange-500/30 shadow-sm whitespace-nowrap cursor-pointer transition active:scale-95"
              >
                {item}
              </button>
            ))
          ) : (
            <span className="text-gray-500 text-[11px] italic pl-1">해당 없음</span>
          )}
        </div>
      </div>

      {/* 길신 목록 */}
      <div className="flex flex-col gap-1.5">
        <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block"></span>
          <span>길신</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-2">
          {activeGilsin.length > 0 ? (
            activeGilsin.map((item, idx) => (
              <button
                type="button"
                key={`gilsin-${idx}`}
                onClick={() => onSelectDetail && onSelectDetail(item, 'gilsin')}
                className="inline-flex items-center justify-center bg-[#4C205E] hover:bg-[#5f2876] text-purple-100 font-semibold text-xs px-2.5 py-1 leading-none rounded-md border border-purple-500/30 shadow-sm whitespace-nowrap cursor-pointer transition active:scale-95"
              >
                {item}
              </button>
            ))
          ) : (
            <span className="text-gray-500 text-[11px] italic pl-1">해당 없음</span>
          )}
        </div>
      </div>

      {!hasItems && (
        <div className="text-gray-400 py-1 text-center italic text-[11px]">
          이 기둥에는 별도의 신살이나 길신이 형성되지 않은 조화로운 기운입니다.
        </div>
      )}
    </div>
  );
}

// 대운 데이터
const daeunData = [
  {
    title: '[戊申 대운 심층 분석] (3세~12세)',
    items: [
      { color: 'text-earth', label: '초년 환경:', text: '가정 안에서 안정적인 보호를 받으며 건강하게 성장하는 시기입니다.' },
      { color: 'text-metal', label: '호기심:', text: '주변 세계에 대한 탐색이 시작되고 기초 학습 습관이 형성됩니다.' }
    ]
  },
  {
    title: '[癸酉 대운 심층 분석] (13세~22세)',
    items: [
      { color: 'text-fire', label: '학업과 집중:', text: '학업 및 진로에 대한 고민이 깊어지고 지혜를 쌓아가는 시기입니다.' },
      { color: 'text-water', label: '교우 관계:', text: '주변 사람들과의 소통이 원활하며 감수성이 예민해지는 때입니다.' }
    ]
  },
  {
    title: '[壬申 대운 심층 분석] (23세~32세)',
    items: [
      { color: 'text-water', label: '사회 진출:', text: '사회 초년생 시기로 다양한 경험과 도전의 기회가 주어집니다.' },
      { color: 'text-metal', label: '실전 역량:', text: '전문성을 다지기 위해 바쁘게 움직이며 역량을 키우는 시기입니다.' }
    ]
  },
  {
    title: '[현재 甲戌 대운 심층 분석] (33세~42세)',
    items: [
      { color: 'text-wood', label: '성장과 도약:', text: '새로운 프로젝트나 커리어상의 변화를 시도하기에 매우 유리한 시기입니다.' },
      { color: 'text-earth', label: '자산 관리:', text: '활동력이 커지는 만큼 고정 지출이나 투자 면에서 세밀한 계획성이 요구됩니다.' }
    ]
  },
  {
    title: '[乙亥 대운 심층 분석] (43세~52세)',
    items: [
      { color: 'text-wood', label: '인맥 확장:', text: '귀인의 도움과 협력 관계가 두터워져 리더십을 발휘하기 좋습니다.' },
      { color: 'text-water', label: '내실 다지기:', text: '확장된 기반을 바탕으로 안정적인 수확을 거두는 흐름입니다.' }
    ]
  },
  {
    title: '[丙子 대운 심층 분석] (53세~62세)',
    items: [
      { color: 'text-earth', label: '명예와 결실:', text: '그동안 쌓아온 경력이 사회적으로 크게 인정받는 시기입니다.' },
      { color: 'text-fire', label: '여유와 관리:', text: '철저한 건강 관리와 함께 삶의 여유를 찾아가는 단계입니다.' }
    ]
  },
  {
    title: '[丁丑 대운 심층 분석] (63세~72세)',
    items: [
      { color: 'text-metal', label: '자산 안정:', text: '안정적인 자산 운영과 후학 양성 또는 경험을 나누는 시기입니다.' },
      { color: 'text-earth', label: '가정 중심:', text: '가정을 돌보며 평온하고 보람된 일상을 누리게 됩니다.' }
    ]
  },
  {
    title: '[戊寅 대운 심층 분석] (73세~82세)',
    items: [
      { color: 'text-earth', label: '지혜 공유:', text: '오랜 세월 축적된 지혜와 통찰을 주변에 베푸는 시기입니다.' },
      { color: 'text-wood', label: '정신적 활력:', text: '꾸준한 취미와 여가 활동으로 활기찬 노년을 보냅니다.' }
    ]
  },
  {
    title: '[己卯 대운 심층 분석] (83세~92세)',
    items: [
      { color: 'text-wood', label: '평온한 휴식:', text: '삶의 여정을 조용히 되돌아보며 마음의 평안을 누리는 시기입니다.' },
      { color: 'text-earth', label: '건강 유의:', text: '무리한 활동보다는 심신의 안정을 최우선으로 삼는 단계입니다.' }
    ]
  }
];

// 세운 데이터
const sewoonData = [
  {
    title: '[2022년 壬寅년 세운 분석]',
    items: [
      { color: 'text-water', label: '변화의 모색:', text: '새로운 환경 변화나 이동수가 작용했던 해입니다.' }
    ]
  },
  {
    title: '[2023년 癸卯년 세운 분석]',
    items: [
      { color: 'text-wood', label: '내실 구축:', text: '꾸준히 실력을 갈고닦으며 내면의 성장을 이룬 시기입니다.' }
    ]
  },
  {
    title: '[2024년 甲辰년 세운 분석]',
    items: [
      { color: 'text-wood', label: '새로운 시작:', text: '새로운 계획을 착수하거나 변화를 도모하기 좋은 해였습니다.' }
    ]
  },
  {
    title: '[2025년 乙巳년 세운 분석]',
    items: [
      { color: 'text-fire', label: '왕성한 활동:', text: '대인관계가 넓어지고 대외적인 성과가 가시화되는 시기입니다.' }
    ]
  },
  {
    title: '[2026년 丙午년 세운 분석] (올해의 운세)',
    items: [
      { color: 'text-fire', label: '열정과 활력:', text: '화(火)의 기운이 강하게 작용하여 자기표현 욕구가 커지고 대외 활동이 활발해집니다.' },
      { color: 'text-cyan-300', label: '주의점:', text: '의욕이 앞서 무리한 확장이나 급작스러운 결정을 내리는 것은 피하는 것이 좋습니다.' }
    ]
  },
  {
    title: '[2027년 丁未년 세운 분석]',
    items: [
      { color: 'text-metal', label: '내실과 정돈:', text: '벌려놓은 일들을 차분히 정리하고 실속을 챙기는 시기입니다.' }
    ]
  },
  {
    title: '[2028년 戊申년 세운 분석]',
    items: [
      { color: 'text-earth', label: '결실과 수확:', text: '노력한 만큼의 구체적인 결과물과 보상이 따르는 해입니다.' }
    ]
  },
  {
    title: '[2029년 己酉년 세운 분석]',
    items: [
      { color: 'text-water', label: '관계 정립:', text: '주변 사람들과의 협업이 중요해지며 소통 능력이 빛을 발합니다.' }
    ]
  },
  {
    title: '[2030년 庚戌년 세운 분석]',
    items: [
      { color: 'text-metal', label: '장기 계획:', text: '다가올 미래를 대비하여 탄탄한 계획을 세우기 좋은 해입니다.' }
    ]
  }
];

// 오행 관련 도우미 함수 및 정보
function getElementFromStemBranch(char: string): 'wood' | 'fire' | 'earth' | 'metal' | 'water' {
  if (!char) return 'wood';
  if (['갑', '을', '甲', '乙', '인', '묘', '寅', '卯'].includes(char)) return 'wood';
  if (['병', '정', '丙', '丁', '사', '오', '巳', '午'].includes(char)) return 'fire';
  if (['무', '기', '戊', '己', '진', '술', '축', '미', '辰', '戌', '丑', '未'].includes(char)) return 'earth';
  if (['경', '신', '庚', '辛', '유', '申', '酉'].includes(char)) return 'metal';
  if (['임', '계', '壬', '癸', '해', '자', '亥', '子'].includes(char)) return 'water';
  return 'wood';
}

const elementInfoMap: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', { kor: string; hanja: string; colorClass: string; bgHex: string }> = {
  wood: { kor: '목', hanja: '木', colorClass: 'text-wood', bgHex: '#4ADE80' },
  fire: { kor: '화', hanja: '火', colorClass: 'text-fire', bgHex: '#F87171' },
  earth: { kor: '토', hanja: '土', colorClass: 'text-earth', bgHex: '#FACC15' },
  metal: { kor: '금', hanja: '金', colorClass: 'text-metal', bgHex: '#F3F4F6' },
  water: { kor: '수', hanja: '水', colorClass: 'text-water', bgHex: '#60A5FA' },
};

// 십신 분류 및 성향 특성 정의
const tenGodTraitsMap: Record<string, { shortName: string; coreTrait: string; strengthDesc: string }> = {
  '비겁 (비견·겁재)': {
    shortName: '비겁',
    coreTrait: '당당한 주체성 및 강한 독립심',
    strengthDesc: '자기 확신과 주체성을 바탕으로 목표를 성취해 나가는 구조입니다.'
  },
  '식상 (식신·상관)': {
    shortName: '식상',
    coreTrait: '창의적 표현력, 유연한 기획·소통 감각',
    strengthDesc: '아이디어를 구체화하고 자유롭게 재능을 표출하는 감각이 뛰어난 구조입니다.'
  },
  '재성 (편재·정재)': {
    shortName: '재성',
    coreTrait: '탁월한 경제 관념 및 치밀한 현실 감각',
    strengthDesc: '목표 지향적 성향으로 자원을 효율적으로 관리하고 결실을 도출하는 구조입니다.'
  },
  '관성 (편관·정관)': {
    shortName: '관성',
    coreTrait: '투철한 책임감, 원칙과 절제된 리더십',
    strengthDesc: '조직 질서와 명예를 중시하며 안정적인 신뢰감을 구축하는 구조입니다.'
  },
  '인성 (편인·정인)': {
    shortName: '인성',
    coreTrait: '깊은 분석력 및 본질을 꿰뚫는 통찰력',
    strengthDesc: '지식과 경험을 체계적으로 자산화하여 내실을 다지는 지성형 구조입니다.'
  }
};

// 한글 받침 여부에 따른 조사 조율 도우미
function attachGwa(text: string): string {
  if (!text) return text;
  const lastChar = text.charAt(text.length - 1);
  const code = lastChar.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const hasJongsung = (code - 0xac00) % 28 > 0;
    return hasJongsung ? `${text}과 함께` : `${text}와 함께`;
  }
  return `${text}와 함께`;
}

function attachEunI(text: string): string {
  if (!text) return text;
  const lastChar = text.charAt(text.length - 1);
  const code = lastChar.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const hasJongsung = (code - 0xac00) % 28 > 0;
    return hasJongsung ? `${text}이` : `${text}가`;
  }
  return `${text}가`;
}

const elementNatureMap: Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', string> = {
  wood: '목(木)의 솟구치는 생명력과 추진 성향',
  fire: '화(火)의 열정적이고 화려하게 퍼지는 확산 성향',
  earth: '토(土)의 포용력 있고 진중하게 중용을 잡아주는 안정 성향',
  metal: '금(金)의 단호하고 명확하며 결실을 맺는 결단 성향',
  water: '수(水)의 유연하고 유유히 흐르는 깊은 지혜 성향',
};

export type ColorId = 'yellow' | 'green' | 'purple' | 'gray' | 'blue' | 'pink' | 'mint' | 'orange';

export interface GroupColorStyle {
  id: ColorId;
  name: string;
  badgeBgClass: string;
  badgeTextClass: string;
  badgeBorderClass: string;
  dotClass: string;
  chipActiveBgClass: string;
  bgHex: string;
  textHex: string;
  borderHex: string;
  dotHex: string;
}

export const PASTEL_COLOR_MAP: Record<ColorId, GroupColorStyle> = {
  yellow: {
    id: 'yellow',
    name: '옐로우',
    badgeBgClass: 'bg-[#FDE047]',
    badgeTextClass: 'text-[#713F12] font-extrabold',
    badgeBorderClass: 'border-[#EAB308]',
    dotClass: 'bg-[#CA8A04]',
    chipActiveBgClass: 'bg-[#FDE047] text-[#713F12] font-extrabold',
    bgHex: '#FDE047',
    textHex: '#713F12',
    borderHex: '#EAB308',
    dotHex: '#CA8A04',
  },
  green: {
    id: 'green',
    name: '그린',
    badgeBgClass: 'bg-[#4ADE80]',
    badgeTextClass: 'text-[#14532D] font-extrabold',
    badgeBorderClass: 'border-[#22C55E]',
    dotClass: 'bg-[#16A34A]',
    chipActiveBgClass: 'bg-[#4ADE80] text-[#14532D] font-extrabold',
    bgHex: '#4ADE80',
    textHex: '#14532D',
    borderHex: '#22C55E',
    dotHex: '#16A34A',
  },
  purple: {
    id: 'purple',
    name: '퍼플',
    badgeBgClass: 'bg-[#C084FC]',
    badgeTextClass: 'text-[#3B0764] font-extrabold',
    badgeBorderClass: 'border-[#A855F7]',
    dotClass: 'bg-[#9333EA]',
    chipActiveBgClass: 'bg-[#C084FC] text-[#3B0764] font-extrabold',
    bgHex: '#C084FC',
    textHex: '#3B0764',
    borderHex: '#A855F7',
    dotHex: '#9333EA',
  },
  gray: {
    id: 'gray',
    name: '회색',
    badgeBgClass: 'bg-[#9CA3AF]',
    badgeTextClass: 'text-[#111827] font-extrabold',
    badgeBorderClass: 'border-[#6B7280]',
    dotClass: 'bg-[#4B5563]',
    chipActiveBgClass: 'bg-[#9CA3AF] text-[#111827] font-extrabold',
    bgHex: '#9CA3AF',
    textHex: '#111827',
    borderHex: '#6B7280',
    dotHex: '#4B5563',
  },
  blue: {
    id: 'blue',
    name: '블루',
    badgeBgClass: 'bg-[#3B82F6]',
    badgeTextClass: 'text-white font-extrabold',
    badgeBorderClass: 'border-[#2563EB]',
    dotClass: 'bg-[#1E40AF]',
    chipActiveBgClass: 'bg-[#3B82F6] text-white font-extrabold',
    bgHex: '#3B82F6',
    textHex: '#FFFFFF',
    borderHex: '#2563EB',
    dotHex: '#93C5FD',
  },
  pink: {
    id: 'pink',
    name: '핑크',
    badgeBgClass: 'bg-[#EC4899]',
    badgeTextClass: 'text-white font-extrabold',
    badgeBorderClass: 'border-[#DB2777]',
    dotClass: 'bg-[#9D174D]',
    chipActiveBgClass: 'bg-[#EC4899] text-white font-extrabold',
    bgHex: '#EC4899',
    textHex: '#FFFFFF',
    borderHex: '#DB2777',
    dotHex: '#FBCFE8',
  },
  mint: {
    id: 'mint',
    name: '민트',
    badgeBgClass: 'bg-[#14B8A6]',
    badgeTextClass: 'text-white font-extrabold',
    badgeBorderClass: 'border-[#0D9488]',
    dotClass: 'bg-[#115E59]',
    chipActiveBgClass: 'bg-[#14B8A6] text-white font-extrabold',
    bgHex: '#14B8A6',
    textHex: '#FFFFFF',
    borderHex: '#0D9488',
    dotHex: '#99F6E4',
  },
  orange: {
    id: 'orange',
    name: '오렌지',
    badgeBgClass: 'bg-[#F97316]',
    badgeTextClass: 'text-white font-extrabold',
    badgeBorderClass: 'border-[#EA580C]',
    dotClass: 'bg-[#9A3412]',
    chipActiveBgClass: 'bg-[#F97316] text-white font-extrabold',
    bgHex: '#F97316',
    textHex: '#FFFFFF',
    borderHex: '#EA580C',
    dotHex: '#FFEDD5',
  },
};

// 구 카테고리 마이그레이션 헬퍼
const migrateCategoryName = (grp: string | undefined): string => {
  if (!grp || grp === '미지정' || grp === '') return '일반';
  if (grp === '그룹1') return '가족';
  if (grp === '그룹2' || grp === '친구') return '지인';
  if (grp === '그룹3' || grp === '회사' || grp === '연예인') return '유명인';
  return grp;
};

export default function App() {
  // 화면 관리 ('landing' | 'input' | 'analyzing' | 'result')
  const [viewMode, setViewMode] = useState<'landing' | 'input' | 'analyzing' | 'result'>('landing');
  // 하단 네비게이션 탭 관리 ('saju' | 'storage' | '보관함' | 'gunghap' | 'premium' | 'settings')
  const [activeTab, setActiveTab] = useState<string>('saju');
  
  // 보관함 탭 검색어, 정렬 옵션 및 그룹 필터 상태
  const [storageSearchTerm, setStorageSearchTerm] = useState('');
  const [storageSelectedGroup, setStorageSelectedGroup] = useState<string>('전체');
  const [storageSortOption, setStorageSortOption] = useState<'latestSave' | 'latestView' | 'nameAsc' | 'birthAsc'>('latestSave');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 커스텀 그룹 목록 상태 (localStorage 연동, 기본 3개: 가족, 지인, 유명인)
  const [customGroups, setCustomGroups] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('customGroups');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const containsOldDefaults = parsed.some((g: string) => ['그룹1', '그룹2', '그룹3', '친구', '회사', '연예인', '미지정'].includes(g));
          if (!containsOldDefaults) {
            const filtered = parsed.filter((g: string) => g && g !== '미지정' && g !== '일반' && g !== '전체');
            if (filtered.length === 3) return filtered;
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return ['가족', '지인', '유명인'];
  });

  // 그룹별 파스텔 테마 색상 상태 (localStorage 연동)
  const [groupColors, setGroupColors] = useState<Record<string, ColorId>>(() => {
    const defaultColors: Record<string, ColorId> = {
      '가족': 'green',
      '지인': 'yellow',
      '유명인': 'purple',
      '일반': 'gray',
    };
    try {
      const saved = localStorage.getItem('groupColors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          const hasOldKeys = '그룹1' in parsed || '그룹2' in parsed || '그룹3' in parsed || '친구' in parsed || '회사' in parsed || '연예인' in parsed;
          if (!hasOldKeys) {
            return { ...defaultColors, ...parsed };
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultColors;
  });

  // 보관함 목록 및 localStorage 연동 (구 카테고리 마이그레이션 적용)
  const [savedSajuList, setSavedSajuList] = useState<SavedSajuItem[]>(() => {
    try {
      const saved = localStorage.getItem('savedSajuList');
      if (saved) {
        const parsed: SavedSajuItem[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map(item => ({
            ...item,
            group: migrateCategoryName(item.group),
          }));
        }
      }
    } catch {
      return [];
    }
    return [];
  });



  // 궁합 전용 대표사주 ID 상태 (localStorage 연동)
  const [gunghapRepSajuId, setGunghapRepSajuId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('gunghapRepSajuId') || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (gunghapRepSajuId) {
        localStorage.setItem('gunghapRepSajuId', gunghapRepSajuId);
      } else {
        localStorage.removeItem('gunghapRepSajuId');
      }
    } catch (e) {}
  }, [gunghapRepSajuId]);

  // 궁합 전용 대표사주 객체 (savedSajuList에서 매칭)
  const gunghapRepresentativeSaju = useMemo(() => {
    if (!gunghapRepSajuId) return null;
    return savedSajuList.find(item => item.id === gunghapRepSajuId) || null;
  }, [gunghapRepSajuId, savedSajuList]);

  // 궁합 대표사주 선택 모달 상태
  const [isSelectGunghapRepModalOpen, setIsSelectGunghapRepModalOpen] = useState(false);
  const [pendingGunghapRepItem, setPendingGunghapRepItem] = useState<SavedSajuItem | null>(null);
  const [gunghapRepSearchTerm, setGunghapRepSearchTerm] = useState('');
  const [gunghapRepSelectedGroup, setGunghapRepSelectedGroup] = useState<string>('전체');
  const [gunghapRepSortOption, setGunghapRepSortOption] = useState<'latestSave' | 'latestView' | 'nameAsc' | 'birthAsc'>('latestSave');
  const [isGunghapRepGroupDropdownOpen, setIsGunghapRepGroupDropdownOpen] = useState<boolean>(false);
  const [isGunghapRepSortDropdownOpen, setIsGunghapRepSortDropdownOpen] = useState<boolean>(false);
  // 궁합 대표사주 해제 확인 모달 상태
  const [isUnlinkGunghapRepConfirmOpen, setIsUnlinkGunghapRepConfirmOpen] = useState(false);

  // 프리미엄 탭 하위 뷰 상태 ('products' | 'storage')
  const [premiumSubView, setPremiumSubView] = useState<'products' | 'storage'>('products');

  // 프리미엄 보관함 저장 목록 (localStorage 연동: savedPremiumReportList)
  const [savedPremiumReportList, setSavedPremiumReportList] = useState<SavedPremiumReport[]>(() => {
    try {
      const raw = localStorage.getItem('savedPremiumReportList');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('savedPremiumReportList', JSON.stringify(savedPremiumReportList));
    } catch (e) {}
  }, [savedPremiumReportList]);

  // 프리미엄 리포트 개별 삭제 모달 대상
  const [reportToDelete, setReportToDelete] = useState<SavedPremiumReport | null>(null);

  // 프리미엄 리포트 다시보기 상세 모달 대상
  const [activeViewingReport, setActiveViewingReport] = useState<SavedPremiumReport | null>(null);

  // 프리미엄 상품 구매 안내/흐름 모달 상태
  const [selectedPremiumProduct, setSelectedPremiumProduct] = useState<{
    name: string;
    grade: string;
    pages: string;
    desc: string;
    highlights: string[];
    price: string;
    badge: string;
    isGunghap?: boolean;
  } | null>(null);

  // --- 궁합 탭 전용 신규 상태 ---
  const [gunghapSubTab, setGunghapSubTab] = useState<'wonguk' | 'view' | 'history'>('wonguk');

  // 로그인 후 최초 1회 무료 상세 궁합 사용 여부
  const [hasUsedFirstFreeGunghap, setHasUsedFirstFreeGunghap] = useState<boolean>(() => {
    try {
      return localStorage.getItem('hasUsedFirstFreeGunghap') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hasUsedFirstFreeGunghap', String(hasUsedFirstFreeGunghap));
    } catch (e) {}
  }, [hasUsedFirstFreeGunghap]);

  // 궁합 보기 상대방 선택 상태
  const [gunghapViewStep, setGunghapViewStep] = useState<'main' | 'selectTarget'>('main');
  const [selectedGunghapTargetId, setSelectedGunghapTargetId] = useState<string | null>(null);
  const [gunghapTargetSearchTerm, setGunghapTargetSearchTerm] = useState<string>('');
  const [gunghapTargetSelectedGroup, setGunghapTargetSelectedGroup] = useState<string>('전체');
  const [gunghapTargetSortOption, setGunghapTargetSortOption] = useState<'latestRegistered' | 'birthAsc' | 'nameAsc'>('latestRegistered');
  const [isGunghapTargetGroupDropdownOpen, setIsGunghapTargetGroupDropdownOpen] = useState<boolean>(false);
  const [isGunghapTargetSortDropdownOpen, setIsGunghapTargetSortDropdownOpen] = useState<boolean>(false);

  // 궁합 생성 확인 모달, 로딩, 전체화면 결과
  const [isGunghapConfirmModalOpen, setIsGunghapConfirmModalOpen] = useState<boolean>(false);
  const [isGeneratingGunghap, setIsGeneratingGunghap] = useState<boolean>(false);
  const [currentGunghapDetail, setCurrentGunghapDetail] = useState<SavedGunghapResult | null>(null);

  // 상세궁합 개별 삭제 확인 팝업 상태
  const [singleGunghapToDelete, setSingleGunghapToDelete] = useState<SavedGunghapResult | null>(null);

  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

  // 상세궁합 저장 결과 목록 (localStorage 연동)
  const [savedGunghapList, setSavedGunghapList] = useState<SavedGunghapResult[]>(() => {
    try {
      const raw = localStorage.getItem('savedGunghapList');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('savedGunghapList', JSON.stringify(savedGunghapList));
    } catch (e) {}
  }, [savedGunghapList]);

  // 90일 지난 상세 궁합 결과 자동 삭제
  useEffect(() => {
    const now = Date.now();
    setSavedGunghapList(prev => {
      const validList = prev.filter(item => {
        const ts = item.createdAtTimestamp || now;
        return (now - ts) < NINETY_DAYS_MS;
      });
      if (validList.length !== prev.length) {
        return validList;
      }
      return prev;
    });
  }, []);

  // 남은 보관기간 텍스트 계산 함수 (예: 90일 후 삭제, 60일 후 삭제 ... 오늘 삭제)
  const getExpiryDDayText = (createdAtTimestamp?: number) => {
    if (!createdAtTimestamp) return '90일 후 삭제';
    const now = Date.now();
    const expireTime = createdAtTimestamp + NINETY_DAYS_MS;
    const diffMs = expireTime - now;
    if (diffMs <= 0) return '오늘 삭제';
    const daysLeft = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    if (daysLeft <= 1) return '오늘 삭제';
    return `${daysLeft}일 후 삭제`;
  };

  // --- 원국 (상세 사주분석) 전용 상태 및 함수 ---
  const [wongukFreeCount, setWongukFreeCount] = useState<number>(() => {
    try {
      const raw = localStorage.getItem('wongukFreeCount');
      if (raw !== null) {
        return parseInt(raw, 10) || 0;
      }
    } catch (e) {}
    return 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem('wongukFreeCount', String(wongukFreeCount));
    } catch (e) {}
  }, [wongukFreeCount]);

  const remainingFreeWongukCount = Math.max(0, 2 - wongukFreeCount);

  const [isWongukConfirmModalOpen, setIsWongukConfirmModalOpen] = useState<boolean>(false);
  const [isGeneratingWonguk, setIsGeneratingWonguk] = useState<boolean>(false);
  const [currentWongukDetail, setCurrentWongukDetail] = useState<SavedWongukResult | null>(null);
  const [singleWongukToDelete, setSingleWongukToDelete] = useState<SavedWongukResult | null>(null);

  const ONE_HUNDRED_EIGHTY_DAYS_MS = 180 * 24 * 60 * 60 * 1000;

  const [savedWongukList, setSavedWongukList] = useState<SavedWongukResult[]>(() => {
    try {
      const raw = localStorage.getItem('savedWongukList');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('savedWongukList', JSON.stringify(savedWongukList));
    } catch (e) {}
  }, [savedWongukList]);

  // 180일 지난 원국 사주분석 결과 자동 삭제
  useEffect(() => {
    const now = Date.now();
    setSavedWongukList(prev => {
      const validList = prev.filter(item => {
        const ts = item.createdAtTimestamp || now;
        return (now - ts) < ONE_HUNDRED_EIGHTY_DAYS_MS;
      });
      if (validList.length !== prev.length) {
        return validList;
      }
      return prev;
    });
  }, []);

  const getWongukExpiryDDayText = (createdAtTimestamp?: number) => {
    if (!createdAtTimestamp) return '180일 후 삭제';
    const now = Date.now();
    const expireTime = createdAtTimestamp + ONE_HUNDRED_EIGHTY_DAYS_MS;
    const diffMs = expireTime - now;
    if (diffMs <= 0) return '오늘 삭제';
    const daysLeft = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    if (daysLeft <= 1) return '오늘 삭제';
    return `${daysLeft}일 후 삭제`;
  };

  const downloadWongukPdf = (item: SavedWongukResult) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('팝업 차단을 해제한 후 다시 시도해 주세요.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>${item.sajuName} 님 사주 원국 정밀 분석 보고서</title>
        <style>
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
          body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            margin: 0;
            padding: 36px;
            color: #0f172a;
            background-color: #ffffff;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f5f9;
            margin-bottom: 24px;
          }
          .title {
            font-size: 22px;
            font-weight: 800;
            color: #7e22ce;
            margin-bottom: 6px;
          }
          .subtitle {
            font-size: 13px;
            color: #64748b;
          }
          .summary-box {
            background: #faf5ff;
            border: 1.5px solid #e9d5ff;
            border-radius: 14px;
            padding: 18px;
            margin-bottom: 24px;
          }
          .badge {
            display: inline-block;
            background: #7e22ce;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 999px;
            margin-bottom: 8px;
          }
          .summary-text {
            font-size: 13px;
            color: #3b0764;
            line-height: 1.6;
          }
          .section {
            margin-bottom: 24px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            padding: 20px;
          }
          .section-title {
            font-size: 15px;
            font-weight: 700;
            color: #6b21a8;
            margin-bottom: 12px;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 8px;
          }
          .section-content {
            font-size: 13px;
            color: #334155;
            white-space: pre-wrap;
            line-height: 1.7;
          }
          .keypoint {
            background: #f3e8ff;
            border-left: 4px solid #9333ea;
            padding: 10px 14px;
            margin-bottom: 8px;
            font-size: 12.5px;
            color: #4c1d95;
            border-radius: 0 8px 8px 0;
          }
          .footer {
            text-align: center;
            margin-top: 36px;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 16px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">☯️ ${item.sajuName} 님 사주 원국 정밀 분석 보고서</div>
          <div class="subtitle">생년월일: ${item.birthYear}년 ${item.birthMonth}월 ${item.birthDay}일 (${item.gender === 'male' ? '남성' : '여성'}) | 분석종류: ${item.analysisType === 'deep' ? '심층분석' : '상세분석'} | 생성일: ${item.createdAt}</div>
        </div>

        <div class="summary-box">
          <span class="badge">${item.analysisType === 'deep' ? '심층분석' : '상세분석'} 리포트</span>
          <div class="summary-text">${item.summary}</div>
        </div>

        <div class="section">
          <div class="section-title">1. 사주 원국 총평 및 타고난 핵심 본질</div>
          <div class="section-content">${item.overall}</div>
        </div>

        <div class="section">
          <div class="section-title">2. 십성(十神)과 오행(五行) 정밀 해독</div>
          <div class="section-content">${item.tenGodsAndElements}</div>
        </div>

        <div class="section">
          <div class="section-title">3. 타고난 재물운 및 직업적 적성</div>
          <div class="section-content">${item.wealthAndCareer}</div>
        </div>

        <div class="section">
          <div class="section-title">4. 애정운과 인간관계 및 인복</div>
          <div class="section-content">${item.loveAndRelations}</div>
        </div>

        <div class="section">
          <div class="section-title">5. 삶의 대운 흐름 및 대길(大吉) 지혜</div>
          <div class="section-content">${item.lifeFlowAndAdvice}</div>
        </div>

        <div class="section">
          <div class="section-title">6. 핵심 분석 포인트 요약</div>
          ${item.keyPoints.map(pt => `<div class="keypoint">${pt}</div>`).join('')}
        </div>

        <div class="footer">
          본 리포트는 명리학적 사주 원국과 십성/신살 기운을 바탕으로 출력된 정밀 리포트입니다.
        </div>

        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // 상세궁합 결과 PDF 다운로드 함수
  const downloadGunghapPdf = (item: SavedGunghapResult) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('팝업 차단을 해제한 후 다시 시도해 주세요.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>${item.mySajuName} & ${item.targetSajuName} 상세 궁합 분석 보고서</title>
        <style>
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
          body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            margin: 0;
            padding: 36px;
            color: #0f172a;
            background-color: #ffffff;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #f1f5f9;
            margin-bottom: 24px;
          }
          .title {
            font-size: 22px;
            font-weight: 800;
            color: #f43f5e;
            margin-bottom: 6px;
          }
          .subtitle {
            font-size: 13px;
            color: #64748b;
          }
          .score-box {
            background: #fff1f2;
            border: 1.5px solid #fecdd3;
            border-radius: 14px;
            padding: 18px;
            text-align: center;
            margin-bottom: 24px;
          }
          .score-title {
            font-size: 13px;
            font-weight: 700;
            color: #e11d48;
          }
          .score-val {
            font-size: 34px;
            font-weight: 900;
            color: #f43f5e;
            margin: 6px 0 10px 0;
          }
          .summary-text {
            font-size: 12.5px;
            color: #334155;
            text-align: left;
            background: #ffffff;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #ffe4e6;
          }
          .section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 16px;
          }
          .section-title {
            font-size: 14px;
            font-weight: 800;
            color: #1e293b;
            border-bottom: 1px solid #e2e8f0;
            padding-bottom: 6px;
            margin-bottom: 10px;
          }
          .section-desc {
            font-size: 12.5px;
            color: #334155;
            white-space: pre-line;
          }
          .key-points {
            background: #fefce8;
            border: 1px solid #fef08a;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 20px;
          }
          .key-points-title {
            font-size: 13.5px;
            font-weight: 800;
            color: #854d0e;
            margin-bottom: 8px;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            margin-top: 32px;
            border-top: 1px solid #f1f5f9;
            padding-top: 16px;
          }
          @media print {
            body { padding: 16px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">💕 정밀 궁합 상세 분석 보고서</div>
          <div class="subtitle">${item.mySajuName} & ${item.targetSajuName} (${item.targetBirthYear}.${String(item.targetBirthMonth).padStart(2, '0')}.${String(item.targetBirthDay).padStart(2, '0')}) · 생성일: ${item.createdAt}</div>
        </div>

        <div class="score-box">
          <div class="score-title">궁합 결속지수</div>
          <div class="score-val">${item.score}점</div>
          <div class="summary-text">${item.summary}</div>
        </div>

        <div class="section">
          <div class="section-title">1. 전체적인 궁합 (오행과 원국 조화)</div>
          <div class="section-desc">${item.overall}</div>
        </div>

        <div class="section">
          <div class="section-title">2. 성격 및 대화 케미스트리</div>
          <div class="section-desc">${item.personality}</div>
        </div>

        <div class="section">
          <div class="section-title">3. 연애 & 애정 표현 궁합</div>
          <div class="section-desc">${item.love}</div>
        </div>

        <div class="section">
          <div class="section-title">4. 생활 & 가치관 조화</div>
          <div class="section-desc">${item.life}</div>
        </div>

        <div class="key-points">
          <div class="key-points-title">💡 두 사람을 위한 핵심 길잡이</div>
          ${item.keyPoints.map(pt => `<div style="margin-bottom: 4px; font-size: 12.5px; color: #713f12;">• ${pt}</div>`).join('')}
        </div>

        <div class="footer">
          루멘 AI 사주분석 시스템 · 본 리포트는 생성일로부터 90일간 이용 가능합니다.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // 궁합 실행 핸들러 (실제 상세 궁합 생성)
  const executeFullGunghapProcess = () => {
    if (!gunghapRepresentativeSaju || !selectedGunghapTargetId) return;

    const targetItem = savedSajuList.find(i => i.id === selectedGunghapTargetId);
    if (!targetItem) return;

    setIsGunghapConfirmModalOpen(false);
    setIsGeneratingGunghap(true);

    setTimeout(() => {
      // 1. 궁합 리포트 데이터 생성
      const report = generateFullGunghapReport(gunghapRepresentativeSaju, targetItem);

      // 2. 최초 1회 무료 사용 상태 기록
      if (!hasUsedFirstFreeGunghap) {
        setHasUsedFirstFreeGunghap(true);
      }

      // 3. 대상 사주의 최근 궁합 확인 시점(lastGunghapAt) 타임스탬프 갱신
      const nowTs = Date.now();
      setSavedSajuList(prev => prev.map(item => {
        if (item.id === targetItem.id) {
          return { ...item, lastGunghapAt: nowTs };
        }
        return item;
      }));

      // 4. 저장 결과 목록에 추가 (최대 30개 자동 유지)
      setSavedGunghapList(prev => {
        const updated = [report, ...prev];
        if (updated.length > 30) {
          return updated.slice(0, 30);
        }
        return updated;
      });

      setIsGeneratingGunghap(false);
      setGunghapViewStep('main');
      // 5. 생성된 궁합 결과 모바일 전체 화면 열기
      setCurrentGunghapDetail(report);
    }, 1500);
  };

  // 프리미엄 1년 보관 기간 (365일)
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

  // 프리미엄 보관 기간 상태 계산 함수
  const getPremiumExpiryStatus = (purchasedAtTimestamp: number) => {
    const now = Date.now();
    const expireTime = purchasedAtTimestamp + ONE_YEAR_MS;
    const diffMs = expireTime - now;

    if (diffMs <= 0) {
      return { isExpired: true, text: '🔒 보관기간 만료', isImminent: false };
    }

    const daysLeft = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
    if (daysLeft <= 30) {
      return { isExpired: false, text: `⚠️ 보관기간 ${daysLeft}일 남음`, isImminent: true, daysLeft };
    }

    return { isExpired: false, text: `보관기간 ${daysLeft}일 남음`, isImminent: false, daysLeft };
  };

  // 프리미엄 리포트 PDF 다운로드/출력 함수
  const downloadPremiumReportPdf = (item: SavedPremiumReport) => {
    const expiryStatus = getPremiumExpiryStatus(item.purchasedAtTimestamp);
    if (expiryStatus.isExpired) {
      alert('보관기간이 만료된 리포트는 다운로드할 수 없습니다.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('팝업 차단을 해제한 후 다시 시도해 주세요.');
      return;
    }

    const titleText = item.isGunghap 
      ? `${item.targetName} × ${item.partnerName || '상대방'} PREMIUM 궁합 정밀 분석 리포트`
      : `${item.targetName} 님 ${item.productName} 정밀 분석 리포트`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8">
        <title>${titleText}</title>
        <style>
          @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
          body {
            font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
            margin: 0;
            padding: 36px;
            color: #0f172a;
            background-color: #ffffff;
            line-height: 1.65;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #0284c7;
            margin-bottom: 24px;
          }
          .badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            font-weight: 800;
            font-size: 12px;
            padding: 4px 10px;
            border-radius: 9999px;
            margin-bottom: 8px;
          }
          .title {
            font-size: 22px;
            font-weight: 900;
            color: #0f172a;
            margin-bottom: 6px;
          }
          .meta {
            font-size: 12.5px;
            color: #64748b;
          }
          .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 20px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 13px;
          }
          .info-label {
            color: #64748b;
            font-weight: 600;
          }
          .info-val {
            color: #0f172a;
            font-weight: 700;
          }
          .section {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 18px;
          }
          .section-title {
            font-size: 15px;
            font-weight: 800;
            color: #0369a1;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 8px;
            margin-bottom: 12px;
          }
          .content-text {
            font-size: 13.5px;
            color: #334155;
            white-space: pre-line;
            line-height: 1.8;
          }
          .footer {
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            margin-top: 36px;
            border-top: 1px solid #f1f5f9;
            padding-top: 16px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="badge">${item.aiGrade} · ${item.pages}</div>
          <div class="title">${item.productName}</div>
          <div class="meta">구매일: ${item.purchasedAt} · 보관 만료일: ${item.expiresAt}까지</div>
        </div>

        <div class="info-box">
          <div class="info-row">
            <span class="info-label">분석 대상</span>
            <span class="info-val">${item.targetName} ${item.isGunghap && item.partnerName ? `× ${item.partnerName}` : ''}</span>
          </div>
          <div class="info-row">
            <span class="info-label">생년월일 및 출생시</span>
            <span class="info-val">${item.targetBirthYear}.${String(item.targetBirthMonth).padStart(2, '0')}.${String(item.targetBirthDay).padStart(2, '0')} (${item.targetBirthTime}) ${item.isGunghap && item.partnerBirthYear ? `× ${item.partnerBirthYear}.${String(item.partnerBirthMonth).padStart(2, '0')}.${String(item.partnerBirthDay).padStart(2, '0')} (${item.partnerBirthTime || '시간미상'})` : ''}</span>
          </div>
          <div class="info-row">
            <span class="info-label">AI 분석 엔진</span>
            <span class="info-val">${item.aiGrade}</span>
          </div>
          <div class="info-row" style="margin-bottom:0;">
            <span class="info-label">이용 금액</span>
            <span class="info-val">${item.price}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">1. 프리미엄 종합 감명 총평</div>
          <div class="content-text">${item.summary || '명리학적 8자 원국과 대운·세운의 상호작용을 심층 분석한 종합 리포트입니다.'}</div>
        </div>

        <div class="section">
          <div class="section-title">2. 정밀 분석 상세 내역</div>
          <div class="content-text">${item.reportContent || '사주 원국과 십성, 오행의 강약, 대운의 흐름 및 전환점 분석 내용이 수록되어 있습니다.'}</div>
        </div>

        <div class="footer">
          루멘 AI 프리미엄 명리 시스템 · 본 리포트는 구매일로부터 1년간 다시보기 및 출력을 지원합니다.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // 원국 (상세 사주분석) 실행 핸들러
  const startWongukAnalysis = () => {
    if (!gunghapRepresentativeSaju) {
      alert('대표사주가 선택되지 않았습니다.');
      setIsWongukConfirmModalOpen(false);
      return;
    }

    setIsWongukConfirmModalOpen(false);
    setIsGeneratingWonguk(true);

    setTimeout(() => {
      const report = generateFullWongukReport(gunghapRepresentativeSaju, 'detail');

      setSavedWongukList(prev => {
        const updated = [report, ...prev];
        if (updated.length > 30) {
          return updated.slice(0, 30);
        }
        return updated;
      });

      setWongukFreeCount(prev => Math.min(2, prev + 1));

      setIsGeneratingWonguk(false);
      setCurrentWongukDetail(report);
    }, 1500);
  };

  // 궁합 상대 선택 모달 & 궁합 결과 모달 상태
  const [gunghapSajuA, setGunghapSajuA] = useState<SavedSajuItem | null>(null);
  const [isGunghapSelectModalOpen, setIsGunghapSelectModalOpen] = useState(false);
  const [isGunghapSubStorageOpen, setIsGunghapSubStorageOpen] = useState(false);
  const [gunghapSearchTerm, setGunghapSearchTerm] = useState('');
  const [gunghapSelectedGroup, setGunghapSelectedGroup] = useState('전체');

  const [gunghapResultPair, setGunghapResultPair] = useState<{
    sajuA: SavedSajuItem;
    sajuB: SavedSajuItem;
    score: number;
    points: string[];
    summary: string;
  } | null>(null);

  // 모달이 열려있을 때 배경 스크롤 차단 이펙트는 변수 선언 후 아래로 이동

  const gunghapGroupOptions = useMemo(() => {
    const list = ['전체', '일반'];
    customGroups.forEach(g => {
      if (g !== '전체' && g !== '일반' && g !== '미지정') {
        list.push(g);
      }
    });
    return Array.from(new Set(list));
  }, [customGroups]);

  // 브라우저/모바일 캐시 자동 마이그레이션 이펙트 (최초 1회 실행)
  useEffect(() => {
    try {
      const freshGroups = ['가족', '지인', '유명인'];
      const freshColors: Record<string, ColorId> = {
        '가족': 'green',
        '지인': 'yellow',
        '유명인': 'purple',
        '일반': 'gray',
      };

      const rawGroups = localStorage.getItem('customGroups');
      const rawColors = localStorage.getItem('groupColors');
      let needsReset = false;

      if (rawGroups) {
        const parsedG = JSON.parse(rawGroups);
        if (Array.isArray(parsedG) && parsedG.some((g: string) => ['그룹1', '그룹2', '그룹3', '친구', '회사', '연예인', '미지정'].includes(g))) {
          needsReset = true;
        }
      } else {
        needsReset = true;
      }

      if (rawColors) {
        const parsedC = JSON.parse(rawColors);
        if (parsedC && ('그룹1' in parsedC || '그룹2' in parsedC || '그룹3' in parsedC || '친구' in parsedC || '회사' in parsedC || '연예인' in parsedC)) {
          needsReset = true;
        }
      } else {
        needsReset = true;
      }

      if (needsReset) {
        setCustomGroups(freshGroups);
        setGroupColors(freshColors);
        localStorage.setItem('customGroups', JSON.stringify(freshGroups));
        localStorage.setItem('groupColors', JSON.stringify(freshColors));
      }

      const rawSaju = localStorage.getItem('savedSajuList');
      if (rawSaju) {
        const parsedSaju: SavedSajuItem[] = JSON.parse(rawSaju);
        if (Array.isArray(parsedSaju)) {
          let hasChanges = false;
          const updatedSaju = parsedSaju.map(item => {
            const migrated = migrateCategoryName(item.group);
            if (migrated !== item.group) hasChanges = true;
            return { ...item, group: migrated };
          });
          if (hasChanges) {
            setSavedSajuList(updatedSaju);
            localStorage.setItem('savedSajuList', JSON.stringify(updatedSaju));
          }
        }
      }
    } catch (e) {
      console.error('Migration error:', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('customGroups', JSON.stringify(customGroups));
    } catch (e) {
      console.error('Failed to save customGroups to localStorage', e);
    }
  }, [customGroups]);

  useEffect(() => {
    try {
      localStorage.setItem('groupColors', JSON.stringify(groupColors));
    } catch (e) {
      console.error('Failed to save groupColors to localStorage', e);
    }
  }, [groupColors]);

  useEffect(() => {
    try {
      localStorage.setItem('savedSajuList', JSON.stringify(savedSajuList));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [savedSajuList]);

  const getGroupColorStyle = (groupName: string): GroupColorStyle => {
    const normName = (!groupName || groupName === '미지정') ? '일반' : groupName;
    let colorId = groupColors[normName] || (normName === '가족' ? 'green' : normName === '지인' ? 'yellow' : normName === '유명인' ? 'purple' : normName === '일반' ? 'gray' : 'green');
    if ((colorId as string) === 'peach' || (colorId as string) === 'khaki' || (colorId as string) === 'brown') colorId = 'orange';
    if ((colorId as string) === 'lavender') colorId = 'purple';
    if ((colorId as string) === 'cream') colorId = 'yellow';
    return PASTEL_COLOR_MAP[colorId] || PASTEL_COLOR_MAP.green;
  };

  // 그룹 관리 모달 상태 및 그룹 일괄 삭제 팝업 상태
  const [isGroupManageModalOpen, setIsGroupManageModalOpen] = useState(false);
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);
  const [editingGroupValue, setEditingGroupValue] = useState('');
  const [editingGroupColor, setEditingGroupColor] = useState<ColorId>('green');
  const [groupToDeleteConfirm, setGroupToDeleteConfirm] = useState<string | null>(null);

  // 그룹 정보/색상 저장 확인 및 완료 팝업 상태
  const [groupSaveConfirmInfo, setGroupSaveConfirmInfo] = useState<{
    index: number;
    oldName: string;
    newName: string;
    colorId: ColorId;
    colorName: string;
  } | null>(null);
  const [groupSaveSuccessMsg, setGroupSaveSuccessMsg] = useState<string | null>(null);

  // 그룹 카테고리 관리 모달 ref
  const groupManageModalRef = useRef<HTMLDivElement>(null);

  // 모바일 환경 '그룹 카테고리 관리' 모달 터치 포커스 및 배경 스크롤 차단
  useEffect(() => {
    if (isGroupManageModalOpen) {
      // 1. body 스크롤 방지 CSS 적용
      const originalStyle = document.body.style.cssText;
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';

      // 2. touchmove 이벤트 차단
      const preventTouchMove = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null;
        if (target && groupManageModalRef.current?.contains(target)) {
          return;
        }
        if (e.cancelable) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', preventTouchMove, { passive: false });

      // 3. 모달 포커스 자동 할당 (.focus())
      const timer = setTimeout(() => {
        groupManageModalRef.current?.focus();
      }, 50);

      return () => {
        document.body.style.cssText = originalStyle;
        document.removeEventListener('touchmove', preventTouchMove);
        clearTimeout(timer);
      };
    }
  }, [isGroupManageModalOpen]);




  // 사주 저장 확인 팝업 (Confirm Modal)
  const [isSaveConfirmModalOpen, setIsSaveConfirmModalOpen] = useState(false);
  // 사주 저장 완료 안내 팝업 (Alert Modal)
  const [savedSuccessAlertName, setSavedSuccessAlertName] = useState<string | null>(null);

  // 보관함 불러오기/삭제 Confirm 팝업
  const [loadConfirmItem, setLoadConfirmItem] = useState<SavedSajuItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<SavedSajuItem | null>(null);

  // 보관함 항목 편집 모달 상태
  const [editingItem, setEditingItem] = useState<SavedSajuItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editGroup, setEditGroup] = useState<string>('미지정');
  const [editMemo, setEditMemo] = useState('');
  // 모달이 열려있을 때 배경 스크롤 차단 (body overflow: hidden)
  useEffect(() => {
    const isAnyModalOpen = !!pendingGunghapRepItem || isUnlinkGunghapRepConfirmOpen || isSelectGunghapRepModalOpen || isGunghapSelectModalOpen || !!editingItem || !!gunghapResultPair || isSaveConfirmModalOpen || !!loadConfirmItem || !!deleteConfirmItem || isGunghapConfirmModalOpen || isGeneratingGunghap || !!currentGunghapDetail || !!singleGunghapToDelete;
    if (isAnyModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [pendingGunghapRepItem, isUnlinkGunghapRepConfirmOpen, isSelectGunghapRepModalOpen, isGunghapSelectModalOpen, editingItem, gunghapResultPair, isSaveConfirmModalOpen, loadConfirmItem, deleteConfirmItem, isGunghapConfirmModalOpen, isGeneratingGunghap, currentGunghapDetail, singleGunghapToDelete]);
  
  // 궁합 보기 전용 상대 목록 (궁합 대표사주 제외, 검색어, 그룹 필터, 정렬 반영)
  const gunghapTargetList = useMemo(() => {
    const repId = gunghapRepresentativeSaju?.id;
    const searchLower = gunghapTargetSearchTerm.trim().toLowerCase();

    return savedSajuList
      .filter(item => {
        if (repId && item.id === repId) return false;

        const itemGroup = (!item.group || item.group === '미지정' || item.group.trim() === '') ? '일반' : item.group;
        const matchesGroup = gunghapTargetSelectedGroup === '전체' || itemGroup === gunghapTargetSelectedGroup;
        const matchesSearch = !searchLower ||
          item.name.toLowerCase().includes(searchLower) ||
          (item.memo && item.memo.toLowerCase().includes(searchLower));

        return matchesGroup && matchesSearch;
      })
      .sort((a, b) => {
        if (gunghapTargetSortOption === 'latestRegistered') {
          const timeA = Number(a.id) || 0;
          const timeB = Number(b.id) || 0;
          if (timeA && timeB && timeA !== timeB) return timeB - timeA;
          return (b.id || '').localeCompare(a.id || '');
        } else if (gunghapTargetSortOption === 'birthAsc') {
          if (a.birthYear !== b.birthYear) return a.birthYear - b.birthYear;
          if (a.birthMonth !== b.birthMonth) return a.birthMonth - b.birthMonth;
          if (a.birthDay !== b.birthDay) return a.birthDay - b.birthDay;
          return a.name.localeCompare(b.name, 'ko');
        } else if (gunghapTargetSortOption === 'nameAsc') {
          return a.name.localeCompare(b.name, 'ko');
        }
        return 0;
      });
  }, [savedSajuList, gunghapRepresentativeSaju, gunghapTargetSearchTerm, gunghapTargetSelectedGroup, gunghapTargetSortOption]);

  // 폼 입력 상태 (기본값: 김지훈, 1992년 5월 20일, 양력, 남성)
  const [name, setName] = useState('김지훈');
  const [selectedGender, setSelectedGender] = useState<'male' | 'female'>('male');
  const [year, setYear] = useState('1992');
  const [month, setMonth] = useState('5');
  const [day, setDay] = useState('20');
  const [calendar, setCalendar] = useState('양력');
  const [birthTime, setBirthTime] = useState('미시 (13:30 ~ 15:30)');

  // 도움말 모달
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isUnknownTime, setIsUnknownTime] = useState(false);
  const [useYajasi, setUseYajasi] = useState(false);

  // 신살 / 길신 상세 정보 팝업(바텀 시트) 모달 상태
  const [selectedDetailModal, setSelectedDetailModal] = useState<{
    name: string;
    type: 'sinsal' | 'gilsin';
    description: string;
  } | null>(null);

  // 연도 유효성 에러 메시지 팝업 및 에러 테두리 상태
  const [yearErrorMsg, setYearErrorMsg] = useState<string | null>(null);
  const [isYearError, setIsYearError] = useState<boolean>(false);

  const handleOpenDetailModal = (name: string, type: 'sinsal' | 'gilsin') => {
    const description = type === 'sinsal'
      ? (SINSAL_DESC[name] || '타고난 사주 원국의 특수한 작용력으로 본인 성향과 개성에 영향을 주는 주요 살입니다.')
      : (GILSIN_DESC[name] || '하늘과 귀인의 도움을 받아 삶의 난관을 극복하고 안정을 가져다주는 길성입니다.');
    setSelectedDetailModal({ name, type, description });
  };

  // 결과 화면 필터 ('all' | 'action' | 'wuxing' | 'daewoon')
  const [activeFilter, setActiveFilter] = useState<'all' | 'action' | 'wuxing' | 'daewoon'>('all');
  const [openAccordion, setOpenAccordion] = useState<'year' | 'month' | 'day' | 'time' | null>('year');

  // 결과 화면 진입 시 최상단 스크롤 초기화 및 기본 '사주분석(종합)' 탭 고정
  useEffect(() => {
    if (viewMode === 'result') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const resultEl = document.getElementById('view-result');
      if (resultEl) {
        resultEl.scrollTop = 0;
      }
      setOpenAccordion('year');
    }
  }, [viewMode]);

  // 오행분포 아코디언 상태
  const [wuxingElementOpen, setWuxingElementOpen] = useState(true);
  const [wuxingPowerOpen, setWuxingPowerOpen] = useState(true);
  const [wuxingSeasonOpen, setWuxingSeasonOpen] = useState(true);

  // 사주작용력 아코디언 상태
  const [openActionCardIds, setOpenActionCardIds] = useState<Record<string, boolean>>({});
  const [isActionSummaryOpen, setIsActionSummaryOpen] = useState(true);

  const toggleActionCard = (id: string) => {
    setOpenActionCardIds(prev => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id] // 기본값이 true(열림)일 때 첫 클릭 시 false로
    }));
  };

  const toggleAllActionCards = (allIds: string[], expand: boolean) => {
    const next: Record<string, boolean> = {};
    allIds.forEach(id => { next[id] = expand; });
    setOpenActionCardIds(next);
  };

  // 대운/세운 선택 상태
  const [selectedDaeunIdx, setSelectedDaeunIdx] = useState<number>(3); // 33~42 甲戌 (현재)
  const [selectedSewoonIdx, setSelectedSewoonIdx] = useState<number>(4); // 2026 丙午 (올해)

  // 스크롤 박스 Ref
  const daeunScrollRef = useRef<HTMLDivElement>(null);
  const sewoonScrollRef = useRef<HTMLDivElement>(null);

  // 드래그 스크롤 상태
  const isDraggingDaeun = useRef(false);
  const startX = useRef(0);
  const scrollLeftVal = useRef(0);

  // 사주 분석 결과
  const [sajuResult, setSajuResult] = useState<SajuAnalysisResult | null>(null);

  // 성별 변경
  const setGender = (gender: 'male' | 'female') => {
    setSelectedGender(gender);
  };

  // 도움말 모달 토글
  const toggleHelpModal = () => {
    setIsHelpModalOpen(!isHelpModalOpen);
  };

  // 폼 제출 handler
  const submitSajuForm = async () => {
    // 연도 범위 유효성 검증 (1900년 ~ 2050년)
    const numYear = parseInt(year, 10);
    if (!year || isNaN(numYear) || numYear < 1900 || numYear > 2050) {
      setIsYearError(true);
      setYearErrorMsg('지원하지 않는 연도입니다. (1900~2050년 사이만 입력 가능합니다)');
      return;
    }
    setIsYearError(false);

    setViewMode('analyzing');

    const timeMapping: Record<string, string> = {
      '자시 (23:30 ~ 01:30)': '자시 (23:30~01:29)',
      '축시 (01:30 ~ 03:30)': '축시 (01:30~03:29)',
      '인시 (03:30 ~ 05:30)': '인시 (03:30~05:29)',
      '묘시 (05:30 ~ 07:30)': '묘시 (05:30~07:29)',
      '진시 (07:30 ~ 09:30)': '진시 (07:30~09:29)',
      '사시 (09:30 ~ 11:30)': '사시 (09:30~11:29)',
      '오시 (11:30 ~ 13:30)': '오시 (11:30~13:29)',
      '미시 (13:30 ~ 15:30)': '미시 (13:30~15:29)',
      '신시 (15:30 ~ 17:30)': '신시 (15:30~17:29)',
      '유시 (17:30 ~ 19:30)': '유시 (17:30~19:29)',
      '술시 (19:30 ~ 21:30)': '술시 (19:30~21:29)',
      '해시 (21:30 ~ 23:30)': '해시 (21:30~23:29)',
    };

    const isJasi = !isUnknownTime && birthTime.startsWith('자시');
    const effectiveUseYajasi = isJasi && useYajasi && !isUnknownTime;

    const inputPayload = {
      name: name || '김지훈',
      gender: selectedGender,
      birthYear: parseInt(year) || 1992,
      birthMonth: parseInt(month) || 5,
      birthDay: parseInt(day) || 20,
      calendarType: calendar.includes('음력') ? (calendar.includes('윤달') ? 'lunar-leap' : 'lunar') : 'solar',
      birthHour: isUnknownTime ? '시간 미지정 (시간 모름)' : (timeMapping[birthTime] || birthTime),
      isUnknownTime,
      useYajasi: effectiveUseYajasi,
    };

    const getFallbackResult = () => {
      const wonGukData = calculateSajuWonGuk(inputPayload);
      const dayStem = wonGukData.dayStem;
      const stemIdx = STEMS.findIndex(s => s.name === dayStem.name);
      const fallbackCeleb = selectCelebMatch(inputPayload, stemIdx >= 0 ? stemIdx : 0);

      return {
        matchPercentage: 92 + (inputPayload.birthDay % 7),
        celebName: fallbackCeleb.name,
        celebOccupation: fallbackCeleb.occupation,
        celebCategory: selectedGender === 'male' ? '배우·가수' : '아이돌/아티스트',
        celebGender: selectedGender,
        celebAgeGroup: fallbackCeleb.ageGroup,
        sajuPoints: fallbackCeleb.points,
        summary: fallbackCeleb.summary,
        dayMaster: {
          stem: dayStem.name,
          hanja: dayStem.hanja,
          elementName: dayStem.element,
          description: `${dayStem.name}(${dayStem.hanja}) 일간의 타고난 독보적인 매력과 본질`
        },
        dominantTenGod: fallbackCeleb.dominantTrait,
        keySinsal: [wonGukData.dayPillar.sinsal || '도화살', wonGukData.yearPillar.sinsal || '역마살'],
        wonGuk: {
          yearPillar: wonGukData.yearPillar,
          monthPillar: wonGukData.monthPillar,
          dayPillar: wonGukData.dayPillar,
          hourPillar: wonGukData.hourPillar,
        },
        userName: inputPayload.name,
        gender: inputPayload.gender,
        birthYear: inputPayload.birthYear,
        birthMonth: inputPayload.birthMonth,
        birthDay: inputPayload.birthDay,
        calendarType: inputPayload.calendarType,
        isUnknownTime: inputPayload.isUnknownTime,
      };
    };

    try {
      const response = await fetch('/api/saju/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputPayload),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setSajuResult(data.result);
      } else {
        setSajuResult(getFallbackResult());
      }
    } catch {
      setSajuResult(getFallbackResult());
    }

    setActiveFilter('all');
    setActiveTab('saju');
    setViewMode('result');
  };

  // 다시 입력으로 이동
  const goBackToInput = () => {
    setViewMode('input');
  };

  // 아코디언 토글
  const toggleAccordion = (target: 'year' | 'month' | 'day' | 'time') => {
    setOpenAccordion(openAccordion === target ? null : target);
  };

  // 대운/세운 스크롤 버튼
  const scrollDaeun = (dir: number) => {
    if (daeunScrollRef.current) {
      daeunScrollRef.current.scrollBy({ left: dir * 150, behavior: 'smooth' });
    }
  };

  const scrollSewoon = (dir: number) => {
    if (sewoonScrollRef.current) {
      sewoonScrollRef.current.scrollBy({ left: dir * 150, behavior: 'smooth' });
    }
  };

  // 마우스 드래그 스크롤 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    isDraggingDaeun.current = true;
    startX.current = e.pageX - ref.current.offsetLeft;
    scrollLeftVal.current = ref.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement | null>) => {
    if (!isDraggingDaeun.current || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    ref.current.scrollLeft = scrollLeftVal.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingDaeun.current = false;
  };

  const getElementTextColor = (element: string) => {
    switch (element) {
      case 'wood': return 'text-wood';
      case 'fire': return 'text-fire';
      case 'earth': return 'text-earth';
      case 'metal': return 'text-metal';
      case 'water': return 'text-water';
      default: return 'text-gray-200';
    }
  };

  const unknownTime = isUnknownTime || sajuResult?.isUnknownTime || false;
  const totalCharCount = unknownTime ? 6 : 8;

  // 유저 정보 텍스트 연동
  const calTypeStr = calendar.includes('양력') ? '양' : '음';
  const genderStr = selectedGender === 'male' ? '남성' : '여성';
  const isJasi = !unknownTime && birthTime.startsWith('자시');

  let displayYear = parseInt(year) || 1992;
  let displayMonth = parseInt(month) || 5;
  let displayDay = parseInt(day) || 20;

  // '야자시 미체크' 시 자시(23:30~01:30) 선택 즉시 계산 날짜 및 상단 타이틀 날짜 표시를 다음 날(명일)로 변경
  if (isJasi && !useYajasi && !unknownTime) {
    const nextDt = new Date(displayYear, displayMonth - 1, displayDay + 1);
    displayYear = nextDt.getFullYear();
    displayMonth = nextDt.getMonth() + 1;
    displayDay = nextDt.getDate();
  }

  const formattedMonth = String(displayMonth).padStart(2, '0');
  const formattedDay = String(displayDay).padStart(2, '0');
  const yajasiTag = (isJasi && useYajasi && !unknownTime) ? ' (야자시)' : '';
  const timeInfoStr = unknownTime ? '시간 미지정' : `${birthTime.split(' ')[0] || birthTime}${yajasiTag}`;
  const displayUserInfo = `${name || '김지훈'} 님 (${displayYear}.${formattedMonth}.${formattedDay} ${calTypeStr} · ${timeInfoStr} · ${genderStr})`;

  // 사주 원국 정보
  const hourPillar = sajuResult?.wonGuk?.hourPillar || DEFAULT_WON_GUK.hourPillar;
  const dayPillar = sajuResult?.wonGuk?.dayPillar || DEFAULT_WON_GUK.dayPillar;
  const monthPillar = sajuResult?.wonGuk?.monthPillar || DEFAULT_WON_GUK.monthPillar;
  const yearPillar = sajuResult?.wonGuk?.yearPillar || DEFAULT_WON_GUK.yearPillar;

  // 사주 보관함 저장 실행 핸들러
  const handleConfirmSaveSaju = () => {
    const yearStr = `${yearPillar.stemHanja}(${yearPillar.stem})${yearPillar.branchHanja}(${yearPillar.branch})`;
    const monthStr = `${monthPillar.stemHanja}(${monthPillar.stem})${monthPillar.branchHanja}(${monthPillar.branch})`;
    const dayStr = `${dayPillar.stemHanja}(${dayPillar.stem})${dayPillar.branchHanja}(${dayPillar.branch})`;
    const hourStr = unknownTime ? '시주 모름' : `${hourPillar.stemHanja}(${hourPillar.stem})${hourPillar.branchHanja}(${hourPillar.branch})`;

    const savedName = name || '김지훈';

    const newItem: SavedSajuItem = {
      id: Date.now().toString(),
      name: savedName,
      gender: selectedGender,
      birthYear: displayYear,
      birthMonth: parseInt(formattedMonth, 10),
      birthDay: parseInt(formattedDay, 10),
      birthTime: timeInfoStr,
      calendar: calTypeStr,
      group: '일반',
      memo: '',
      savedAt: new Date().toISOString().split('T')[0],
      yearPillarStr: yearStr,
      monthPillarStr: monthStr,
      dayPillarStr: dayStr,
      hourPillarStr: hourStr,
      dayMasterStr: `${dayPillar.stemHanja}(${dayPillar.stem})`,
      isUnknownTime: unknownTime,
    };

    setSavedSajuList(prev => [newItem, ...prev]);
    setIsSaveConfirmModalOpen(false);
    setSavedSuccessAlertName(savedName);
    setActiveTab('storage');
    setViewMode('result');
  };

  const handleLoadSavedSaju = (item: SavedSajuItem) => {
    // 최근 검색(조회) 타임스탬프 갱신
    setSavedSajuList(prev => prev.map(s => s.id === item.id ? { ...s, lastViewedAt: Date.now() } : s));

    setName(item.name);
    setSelectedGender(item.gender);
    setYear(item.birthYear.toString());
    setMonth(item.birthMonth.toString());
    setDay(item.birthDay.toString());

    if (item.calendar.includes('윤달')) {
      setCalendar('음력(윤달)');
    } else if (item.calendar.includes('음')) {
      setCalendar('음력');
    } else {
      setCalendar('양력');
    }

    setBirthTime(item.birthTime);
    setIsUnknownTime(!!item.isUnknownTime);

    const inputPayload = {
      name: item.name,
      gender: item.gender,
      birthYear: item.birthYear,
      birthMonth: item.birthMonth,
      birthDay: item.birthDay,
      calendarType: item.calendar.includes('윤달') ? 'lunar-leap' : item.calendar.includes('음') ? 'lunar' : 'solar',
      birthHour: item.isUnknownTime ? '시간 미지정 (시간 모름)' : item.birthTime,
      isUnknownTime: !!item.isUnknownTime,
      useYajasi,
    };

    const wonGukData = calculateSajuWonGuk(inputPayload);
    const dayStem = wonGukData.dayStem;
    const stemIdx = STEMS.findIndex(s => s.name === dayStem.name);
    const fallbackCeleb = selectCelebMatch(inputPayload, stemIdx >= 0 ? stemIdx : 0);

    setSajuResult({
      matchPercentage: 92 + (inputPayload.birthDay % 7),
      celebName: fallbackCeleb.name,
      celebOccupation: fallbackCeleb.occupation,
      celebCategory: item.gender === 'male' ? '배우·가수' : '아이돌/아티스트',
      celebGender: item.gender,
      celebAgeGroup: fallbackCeleb.ageGroup,
      sajuPoints: fallbackCeleb.points,
      summary: fallbackCeleb.summary,
      dayMaster: {
        stem: dayStem.name,
        hanja: dayStem.hanja,
        elementName: dayStem.element,
        description: `${dayStem.name}(${dayStem.hanja}) 일간의 타고난 독보적인 매력과 본질`
      },
      dominantTenGod: fallbackCeleb.dominantTrait,
      keySinsal: [wonGukData.dayPillar.sinsal || '도화살', wonGukData.yearPillar.sinsal || '역마살'],
      wonGuk: {
        yearPillar: wonGukData.yearPillar,
        monthPillar: wonGukData.monthPillar,
        dayPillar: wonGukData.dayPillar,
        hourPillar: wonGukData.hourPillar,
      },
      userName: inputPayload.name,
      gender: inputPayload.gender,
      birthYear: inputPayload.birthYear,
      birthMonth: inputPayload.birthMonth,
      birthDay: inputPayload.birthDay,
      calendarType: inputPayload.calendarType,
      isUnknownTime: inputPayload.isUnknownTime,
    });

    setActiveFilter('all');
    setActiveTab('saju');
    setViewMode('result');
  };

  // 현재 메인 화면 사주 정보 객체 생성
  const getCurrentMainSajuItem = (): SavedSajuItem => {
    const yearStr = `${yearPillar.stemHanja}(${yearPillar.stem})${yearPillar.branchHanja}(${yearPillar.branch})`;
    const monthStr = `${monthPillar.stemHanja}(${monthPillar.stem})${monthPillar.branchHanja}(${monthPillar.branch})`;
    const dayStr = `${dayPillar.stemHanja}(${dayPillar.stem})${dayPillar.branchHanja}(${dayPillar.branch})`;
    const hourStr = unknownTime ? '시주 모름' : `${hourPillar.stemHanja}(${hourPillar.stem})${hourPillar.branchHanja}(${hourPillar.branch})`;

    return {
      id: 'main-' + Date.now(),
      name: name || '김지훈',
      gender: selectedGender,
      birthYear: displayYear,
      birthMonth: parseInt(formattedMonth, 10),
      birthDay: parseInt(formattedDay, 10),
      birthTime: timeInfoStr,
      calendar: calTypeStr,
      group: '일반',
      memo: '현재 화면 사주',
      savedAt: new Date().toISOString().split('T')[0],
      yearPillarStr: yearStr,
      monthPillarStr: monthStr,
      dayPillarStr: dayStr,
      hourPillarStr: hourStr,
      dayMasterStr: `${dayPillar.stemHanja}(${dayPillar.stem})`,
      isUnknownTime: unknownTime,
    };
  };



  // 궁합 상대 선택 모달 열기 핸들러
  const handleOpenGunghapSelectModal = (cardSaju: SavedSajuItem) => {
    setGunghapSajuA(cardSaju);
    setIsGunghapSubStorageOpen(false);
    setGunghapSearchTerm('');
    setGunghapSelectedGroup('전체');
    setIsGunghapSelectModalOpen(true);
  };

  // 궁합 계산 실행 핸들러 (sajuA, sajuB 확정)
  const executeGunghap = (sajuA: SavedSajuItem, sajuB: SavedSajuItem) => {
    const codeA = (sajuA.name.charCodeAt(0) || 0) + sajuA.birthYear + sajuA.birthDay;
    const codeB = (sajuB.name.charCodeAt(0) || 0) + sajuB.birthYear + sajuB.birthDay;
    const score = 82 + ((codeA + codeB) % 17);

    const points = [
      `1. 천간·일간 성향 조화: ${sajuA.name} 님과 ${sajuB.name} 님의 타고난 기운이 유연하게 맞닿아 서로 편안함을 느낍니다.`,
      `2. 오행 및 원국 보완성: 각자 가지고 있는 강점을 주고받으며 인연의 깊이를 더해주는 상생 구조입니다.`,
      `3. 소통 및 발전 가이드: 서로의 생활 패턴과 가치관을 인정해줄수록 든든한 동반자로 커져갈 인연입니다.`
    ];

    const summary = `${sajuA.name} 님과 ${sajuB.name} 님은 성향과 에너지의 밸런스가 뛰어나 함께할 때 기분 좋은 시너지를 만들어냅니다.`;

    setGunghapResultPair({
      sajuA,
      sajuB,
      score,
      points,
      summary
    });

    setIsGunghapSelectModalOpen(false);
    setIsGunghapSubStorageOpen(false);
  };

  const handleOpenEditModal = (item: SavedSajuItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditGroup((!item.group || item.group === '미지정') ? '일반' : item.group);
    setEditMemo(item.memo || '');
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const updatedItem: SavedSajuItem = {
      ...editingItem,
      name: editName.trim() || editingItem.name,
      group: editGroup,
      memo: editMemo,
    };

    setSavedSajuList(prev => prev.map(item => {
      if (item.id === editingItem.id) {
        return updatedItem;
      }
      return item;
    }));

    setEditingItem(null);
  };

  const handleUpdateGroup = (id: string, group: string) => {
    setSavedSajuList(prev => prev.map(item => item.id === id ? { ...item, group } : item));
  };

  const handleDeleteSavedSaju = (id: string) => {
    if (window.confirm('이 사주 정보를 보관함에서 삭제하시겠습니까?')) {
      setSavedSajuList(prev => prev.filter(item => item.id !== id));
    }
  };

  // 그룹 관리 핸들러 (고정 3개 그룹 이름 및 색상 수정 - 저장 시 확인 팝업 호출)
  const handleSaveEditedGroup = (index: number) => {
    const oldName = customGroups[index];
    const newName = editingGroupValue.trim();
    if (!newName) {
      alert('그룹 이름을 입력해 주세요.');
      return;
    }
    if (newName.length > 3) {
      alert('그룹 이름은 최대 3자까지 입력 가능합니다.');
      return;
    }
    if (newName !== oldName && (customGroups.includes(newName) || newName === '전체' || newName === '일반' || newName === '미지정')) {
      alert('이미 존재하는 그룹 이름입니다.');
      return;
    }
    const colorObj = PASTEL_COLOR_MAP[editingGroupColor];
    const colorName = colorObj ? colorObj.name : '선택한';

    setGroupSaveConfirmInfo({
      index,
      oldName,
      newName,
      colorId: editingGroupColor,
      colorName,
    });
  };

  // 그룹 정보/색상 저장 최종 실행
  const executeGroupSave = () => {
    if (!groupSaveConfirmInfo) return;
    const { index, oldName, newName, colorId } = groupSaveConfirmInfo;

    const newGroups = customGroups.map((g, idx) => (idx === index ? newName : g));
    setCustomGroups(newGroups);

    const newColors = { ...groupColors };
    if (oldName !== newName) {
      delete newColors[oldName];
    }
    newColors[newName] = colorId;
    setGroupColors(newColors);

    try {
      localStorage.setItem('customGroups', JSON.stringify(newGroups));
      localStorage.setItem('groupColors', JSON.stringify(newColors));
    } catch (e) {
      console.error('Failed to sync to localStorage directly', e);
    }

    setSavedSajuList(prev => {
      const updated = prev.map(item => item.group === oldName ? { ...item, group: newName } : item);
      try {
        localStorage.setItem('savedSajuList', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (storageSelectedGroup === oldName) {
      setStorageSelectedGroup(newName);
    }

    setGroupSaveConfirmInfo(null);
    setEditingGroupIndex(null);
    setEditingGroupValue('');
    setGroupSaveSuccessMsg('변경되었습니다.');
  };

  // 해당 그룹에 속한 저장 데이터 전체 삭제
  const handleConfirmDeleteGroupData = (groupName: string) => {
    if (groupName === '일반' || groupName === '미지정') {
      setSavedSajuList(prev => prev.filter(item => item.group !== '일반' && item.group !== '미지정' && item.group !== ''));
    } else {
      setSavedSajuList(prev => prev.filter(item => item.group !== groupName));
    }
    setGroupToDeleteConfirm(null);
  };

  const filteredSavedSajuList = savedSajuList
    .filter(item => {
      const itemGroup = (!item.group || item.group === '미지정') ? '일반' : item.group;
      const matchesGroup = storageSelectedGroup === '전체' || itemGroup === storageSelectedGroup;
      const matchesSearch = !storageSearchTerm.trim() ||
        item.name.toLowerCase().includes(storageSearchTerm.toLowerCase()) ||
        item.memo.toLowerCase().includes(storageSearchTerm.toLowerCase());
      return matchesGroup && matchesSearch;
    })
    .sort((a, b) => {
      if (storageSortOption === 'latestSave') {
        return Number(b.id) - Number(a.id);
      } else if (storageSortOption === 'latestView') {
        const viewA = a.lastViewedAt || 0;
        const viewB = b.lastViewedAt || 0;
        if (viewA !== viewB) return viewB - viewA;
        return Number(b.id) - Number(a.id);
      } else if (storageSortOption === 'nameAsc') {
        return a.name.localeCompare(b.name, 'ko');
      } else if (storageSortOption === 'birthAsc') {
        const dateA = a.birthYear * 10000 + a.birthMonth * 100 + a.birthDay;
        const dateB = b.birthYear * 10000 + b.birthMonth * 100 + b.birthDay;
        return dateA - dateB;
      }
      return 0;
    });

  const availableGunghapCandidates = useMemo(() => {
    const searchLower = gunghapSearchTerm.trim().toLowerCase();

    return savedSajuList.filter(item => {
      if (item.id === gunghapSajuA?.id) return false;

      const itemGroup = (!item.group || item.group === '미지정' || item.group.trim() === '') ? '일반' : item.group;
      const matchesGroup = gunghapSelectedGroup === '전체' || itemGroup === gunghapSelectedGroup;
      const matchesSearch = !searchLower ||
        item.name.toLowerCase().includes(searchLower) ||
        (item.memo && item.memo.toLowerCase().includes(searchLower));

      return matchesGroup && matchesSearch;
    });
  }, [savedSajuList, gunghapSajuA, gunghapSelectedGroup, gunghapSearchTerm]);

  const filteredGunghapRepList = useMemo(() => {
    const searchLower = gunghapRepSearchTerm.trim().toLowerCase();

    return savedSajuList
      .filter(item => {
        const itemGroup = (!item.group || item.group === '미지정' || item.group.trim() === '') ? '일반' : item.group;
        const matchesGroup = gunghapRepSelectedGroup === '전체' || itemGroup === gunghapRepSelectedGroup;
        const matchesSearch = !searchLower ||
          item.name.toLowerCase().includes(searchLower) ||
          (item.memo && item.memo.toLowerCase().includes(searchLower));

        return matchesGroup && matchesSearch;
      })
      .sort((a, b) => {
        if (gunghapRepSortOption === 'latestSave') {
          return Number(b.id) - Number(a.id);
        } else if (gunghapRepSortOption === 'latestView') {
          const viewA = a.lastViewedAt || 0;
          const viewB = b.lastViewedAt || 0;
          if (viewA !== viewB) return viewB - viewA;
          return Number(b.id) - Number(a.id);
        } else if (gunghapRepSortOption === 'nameAsc') {
          return a.name.localeCompare(b.name, 'ko');
        } else if (gunghapRepSortOption === 'birthAsc') {
          const dateA = a.birthYear * 10000 + a.birthMonth * 100 + a.birthDay;
          const dateB = b.birthYear * 10000 + b.birthMonth * 100 + b.birthDay;
          return dateA - dateB;
        }
        return 0;
      });
  }, [savedSajuList, gunghapRepSearchTerm, gunghapRepSelectedGroup, gunghapRepSortOption]);

  // 일간 오행 및 원국 오행 동적 분석
  const dayElement = getElementFromStemBranch(dayPillar.stem || dayPillar.stemHanja || '정');

  const wonGukElements = unknownTime ? [
    getElementFromStemBranch(dayPillar.stem || '정'),
    getElementFromStemBranch(dayPillar.branch || '묘'),
    getElementFromStemBranch(monthPillar.stem || '계'),
    getElementFromStemBranch(monthPillar.branch || '인'),
    getElementFromStemBranch(yearPillar.stem || '계'),
    getElementFromStemBranch(yearPillar.branch || '해'),
  ] : [
    getElementFromStemBranch(hourPillar.stem || '경'),
    getElementFromStemBranch(hourPillar.branch || '자'),
    getElementFromStemBranch(dayPillar.stem || '정'),
    getElementFromStemBranch(dayPillar.branch || '묘'),
    getElementFromStemBranch(monthPillar.stem || '계'),
    getElementFromStemBranch(monthPillar.branch || '인'),
    getElementFromStemBranch(yearPillar.stem || '계'),
    getElementFromStemBranch(yearPillar.branch || '해'),
  ];

  const elementCounts = {
    wood: wonGukElements.filter(e => e === 'wood').length,
    fire: wonGukElements.filter(e => e === 'fire').length,
    earth: wonGukElements.filter(e => e === 'earth').length,
    metal: wonGukElements.filter(e => e === 'metal').length,
    water: wonGukElements.filter(e => e === 'water').length,
  };

  const elementPercentages = {
    wood: Math.round((elementCounts.wood / totalCharCount) * 100),
    fire: Math.round((elementCounts.fire / totalCharCount) * 100),
    earth: Math.round((elementCounts.earth / totalCharCount) * 100),
    metal: Math.round((elementCounts.metal / totalCharCount) * 100),
    water: Math.round((elementCounts.water / totalCharCount) * 100),
  };

  const sortedElements = (['wood', 'fire', 'earth', 'metal', 'water'] as const)
    .map(el => ({ element: el, count: elementCounts[el], percentage: elementPercentages[el] }))
    .sort((a, b) => b.count - a.count);

  const top1 = sortedElements[0];
  const top2 = sortedElements[1];

  const top1Group = getTenGodGroupForElement(dayElement, top1.element);
  const top2Group = getTenGodGroupForElement(dayElement, top2.element);

  const top1Info = tenGodTraitsMap[top1Group] || tenGodTraitsMap['비겁 (비견·겁재)'];
  const top2Info = tenGodTraitsMap[top2Group] || tenGodTraitsMap['식상 (식신·상관)'];

  let wuxingBalanceTitle = '';
  let wuxingBalanceDesc = '';

  if (top1.count >= 2 && top2.count >= 2) {
    if (top1Group === top2Group) {
      wuxingBalanceTitle = `${elementInfoMap[top1.element].kor}(${elementInfoMap[top1.element].hanja})·${elementInfoMap[top2.element].kor}(${elementInfoMap[top2.element].hanja}) 발달형 (${top1Info.shortName} 세력 우세)`;
      wuxingBalanceDesc = `원국 내 ${elementInfoMap[top1.element].kor}(${elementInfoMap[top1.element].hanja})·${elementInfoMap[top2.element].kor}(${elementInfoMap[top2.element].hanja}) 기운이 우세하여 ${top1Info.shortName}의 ${attachEunI(top1Info.coreTrait)} 강조됩니다. ${top1Info.strengthDesc}`;
    } else {
      wuxingBalanceTitle = `${elementInfoMap[top1.element].kor}(${elementInfoMap[top1.element].hanja})·${elementInfoMap[top2.element].kor}(${elementInfoMap[top2.element].hanja}) 발달형 (${top1Info.shortName}·${top2Info.shortName} 중심)`;
      wuxingBalanceDesc = `원국 내 ${elementInfoMap[top1.element].kor}(${top1Info.shortName})와 ${elementInfoMap[top2.element].kor}(${top2Info.shortName}) 기운이 주요 세력을 형성합니다. ${attachGwa(top1Info.coreTrait)} ${attachEunI(top2Info.coreTrait)} 조화를 이루는 구조입니다.`;
    }
  } else {
    wuxingBalanceTitle = `${elementInfoMap[top1.element].kor}(${elementInfoMap[top1.element].hanja}) 중심의 ${top1Info.shortName} 발달 구조`;
    wuxingBalanceDesc = `원국에서 ${elementInfoMap[top1.element].kor}(${elementInfoMap[top1.element].hanja}) 기운이 핵심 세력을 형성하여 ${top1Info.shortName}의 ${attachEunI(top1Info.coreTrait)} 두드러지는 강점을 지닙니다.`;
  }

  // 신강신약 점수 계산 (월지 득령 35, 일지 득지 20, 시지/년지 각 10, 천간 각 8)
  const isSupporting = (el: 'wood' | 'fire' | 'earth' | 'metal' | 'water') => {
    const elements: ('wood' | 'fire' | 'earth' | 'metal' | 'water')[] = ['wood', 'fire', 'earth', 'metal', 'water'];
    const dayIdx = elements.indexOf(dayElement);
    const targetIdx = elements.indexOf(el);
    const diff = (targetIdx - dayIdx + 5) % 5;
    return diff === 0 || diff === 4; // 비겁(0) or 인성(4)
  };

  let shinPowerScore = 0;
  if (isSupporting(getElementFromStemBranch(monthPillar.branch))) shinPowerScore += 35; // 월지
  if (isSupporting(getElementFromStemBranch(dayPillar.branch))) shinPowerScore += 20; // 일지
  if (isSupporting(getElementFromStemBranch(yearPillar.branch))) shinPowerScore += 10; // 년지
  if (isSupporting(getElementFromStemBranch(monthPillar.stem))) shinPowerScore += 8;  // 월간
  if (isSupporting(getElementFromStemBranch(yearPillar.stem))) shinPowerScore += 8;  // 년간

  if (!unknownTime) {
    if (isSupporting(getElementFromStemBranch(hourPillar.branch))) shinPowerScore += 10; // 시지
    if (isSupporting(getElementFromStemBranch(hourPillar.stem))) shinPowerScore += 8;  // 시간
  }

  const maxPowerScore = unknownTime ? 81 : 99;
  const shinPowerRatio = (shinPowerScore / maxPowerScore) * 100;

  let shinBadgeText = '중용 · 균형';
  let shinBadgeBg = 'bg-amber-600 text-white';
  let shinIndicatorPos = '50%';
  let shinDescText = '';

  if (shinPowerRatio >= 66) {
    shinBadgeText = '신강 · 세력 우세';
    shinBadgeBg = 'bg-red-600 text-white';
    shinIndicatorPos = `${Math.min(92, Math.max(80, shinPowerRatio))}%`;
    shinDescText = `일간 ${dayPillar.stem}(${elementInfoMap[dayElement].hanja}) 기운이 인성·비겁의 든든한 세력을 얻어 원국이 매우 강건합니다. 주관이 뚜렷하고 높은 주도권과 추진력으로 환경을 선도하는 신강(身强) 사주입니다.`;
  } else if (shinPowerRatio >= 53) {
    shinBadgeText = '중화신강 · 유연 우세';
    shinBadgeBg = 'bg-orange-600 text-white';
    shinIndicatorPos = `${Math.min(76, Math.max(62, shinPowerRatio))}%`;
    shinDescText = `일간 ${dayPillar.stem}(${elementInfoMap[dayElement].hanja}) 기운이 적절히 우세하여 주도성을 유지하면서도, 타인과 유연하게 협력하며 조화를 이루는 중화신강(中和身强) 사주입니다.`;
  } else if (shinPowerRatio >= 42) {
    shinBadgeText = '중용 · 완전 균형';
    shinBadgeBg = 'bg-amber-600 text-white';
    shinIndicatorPos = `${Math.min(58, Math.max(44, shinPowerRatio))}%`;
    shinDescText = `일간 ${dayPillar.stem}(${elementInfoMap[dayElement].hanja}) 기운을 돕는 세력과 제어하는 세력이 알맞게 균형을 이룹니다. 한쪽으로 치우침 없는 조화와 유연한 균형 감각을 발휘하는 중용(中和) 사주입니다.`;
  } else if (shinPowerRatio >= 28) {
    shinBadgeText = '중화신약 · 유연 보완';
    shinBadgeBg = 'bg-sky-600 text-white';
    shinIndicatorPos = `${Math.min(42, Math.max(26, shinPowerRatio))}%`;
    shinDescText = `일간 ${dayPillar.stem}(${elementInfoMap[dayElement].hanja}) 기운이 다소 수용적이나 중심을 잃지 않는 적정한 선입니다. 주변과의 협력과 내실 기하기를 통해 안정적인 성과를 거두는 중화신약(中和身弱) 사주입니다.`;
  } else {
    shinBadgeText = '신약 · 보완 필요';
    shinBadgeBg = 'bg-blue-600 text-white';
    shinIndicatorPos = `${Math.min(24, Math.max(8, shinPowerRatio))}%`;
    shinDescText = `일간 ${dayPillar.stem}(${elementInfoMap[dayElement].hanja}) 기운보다 에너지 소모 기운(식상·재성·관성)이 우세합니다. 인성과 조력자의 지원을 적극 활용하고 내실을 다질 때 더욱 안정적인 성과를 거두는 신약(身弱) 사주입니다.`;
  }

  // 십성/육친 및 오행 매핑 (억부용신용)
  const elementRelationsMap: Record<string, { resource: string; companion: string; output: string; wealth: string; officer: string }> = {
    wood:  { resource: '수(水)·인성', companion: '목(木)·비겁', output: '화(火)·식상', wealth: '토(土)·재성', officer: '금(金)·관성' },
    fire:  { resource: '목(木)·인성', companion: '화(火)·비겁', output: '토(土)·식상', wealth: '금(金)·재성', officer: '수(水)·관성' },
    earth: { resource: '화(火)·인성', companion: '토(土)·비겁', output: '금(金)·식상', wealth: '수(水)·재성', officer: '목(木)·관성' },
    metal: { resource: '토(土)·인성', companion: '금(金)·비겁', output: '수(水)·식상', wealth: '목(木)·재성', officer: '화(火)·관성' },
    water: { resource: '금(金)·인성', companion: '수(水)·비겁', output: '목(木)·식상', wealth: '화(火)·재성', officer: '토(土)·관성' },
  };

  const rel = elementRelationsMap[dayElement] || elementRelationsMap.earth;
  let eokbuYongsinText = '';

  if (shinPowerRatio >= 66) {
    eokbuYongsinText = `${rel.officer} 용신`;
  } else if (shinPowerRatio >= 53) {
    eokbuYongsinText = `${rel.output} 용신`;
  } else if (shinPowerRatio >= 42) {
    eokbuYongsinText = `${rel.resource} 조율 용신`;
  } else if (shinPowerRatio >= 28) {
    eokbuYongsinText = `${rel.resource} 용신`;
  } else {
    eokbuYongsinText = `${rel.resource} 용신`;
  }

  // 조후용신 계산 (월지 기준)
  const monthBranch = monthPillar.branch || '인';
  let johuBadgeText = '온화 · 소통조율';
  let johuBadgeBg = 'bg-cyan-600 text-white';
  let johuIndicatorPos = '50%';
  let johuSeasonTitle = `봄철 ${monthBranch}월 (온화·생기)`;
  let johuNeededElement = '화(火)/수(수) - 생기 조율';
  let johuYongsinText = '화(火)·수(水) 조후용신';
  let johuDescText = '온화한 봄철 생기를 품어 발전 가능성이 높습니다. 화(火)의 결실과 수(水)의 수용성을 균형 있게 조율하는 것이 핵심 포인트입니다.';

  if (['사', '오', '미', '巳', '午', '未'].includes(monthBranch)) {
    johuBadgeText = '조열 · 수(水) 필요';
    johuBadgeBg = 'bg-red-600 text-white';
    johuIndicatorPos = '80%';
    johuSeasonTitle = `여름철 ${monthBranch}월 (조열·무더움)`;
    johuNeededElement = '수(水) - 시원한 조후';
    johuYongsinText = '수(水)·조후용신';
    johuDescText = `무더운 여름철 열기가 강하여 수(水) 기운과 습토(濕土)의 보완이 필요합니다. 차분한 조후로 열기를 다스릴 때 안정적 성취가 수월해집니다.`;
  } else if (['신', '유', '술', '申', '酉', '戌'].includes(monthBranch)) {
    johuBadgeText = '서늘 · 화(火) 온기';
    johuBadgeBg = 'bg-amber-600 text-white';
    johuIndicatorPos = '35%';
    johuSeasonTitle = `가을철 ${monthBranch}월 (서늘·숙살)`;
    johuNeededElement = '화(火) - 따뜻한 온기';
    johuYongsinText = '화(火)·조후용신';
    johuDescText = `서늘한 가을철에 태어나 금(金) 기운이 차분합니다. 따뜻한 화(火) 온기로 원국을 감싸줄 때 삶의 활력과 수확의 결실이 더욱 배가됩니다.`;
  } else if (['해', '자', '축', '亥', '子', '丑'].includes(monthBranch)) {
    johuBadgeText = '한랭 · 화(火) 조후';
    johuBadgeBg = 'bg-blue-600 text-white';
    johuIndicatorPos = '20%';
    johuSeasonTitle = `겨울철 ${monthBranch}월 (한랭·엄동)`;
    johuNeededElement = '화(火) - 따뜻한 양기';
    johuYongsinText = '화(火)·조후용신';
    johuDescText = `차가운 겨울철 엄동설한에 태어나 따뜻한 화(火) 양기가 필수적입니다. 온화한 기운으로 원국의 동결을 풀어줄 때 운의 흐름이 한층 순탄해집니다.`;
  }

  // Daeun cards definition
  const daeunCards = [
    { age: '3 ~ 12', hanja: '戊申', kor: '무신대운', color: 'text-earth' },
    { age: '13 ~ 22', hanja: '癸酉', kor: '계유대운', color: 'text-fire' },
    { age: '23 ~ 32', hanja: '壬申', kor: '임신대운', color: 'text-water' },
    { age: '33 ~ 42', hanja: '甲戌', kor: '갑술대운', color: 'text-wood', isDefault: true },
    { age: '43 ~ 52', hanja: '乙亥', kor: '을해대운', color: 'text-fire' },
    { age: '53 ~ 62', hanja: '丙子', kor: '병자대운', color: 'text-earth' },
    { age: '63 ~ 72', hanja: '丁丑', kor: '정축대운', color: 'text-metal' },
    { age: '73 ~ 82', hanja: '戊寅', kor: '무인대운', color: 'text-water' },
    { age: '83 ~ 92', hanja: '己卯', kor: '기묘대운', color: 'text-wood' }
  ];

  // Sewoon cards definition
  const sewoonCards = [
    { year: '2022', hanja: '壬寅', kor: '임인년', color: 'text-water' },
    { year: '2023', hanja: '癸卯', kor: '계묘년', color: 'text-wood' },
    { year: '2024', hanja: '甲辰', kor: '갑진년', color: 'text-wood' },
    { year: '2025', hanja: '乙巳', kor: '을사년', color: 'text-fire' },
    { year: '2026', hanja: '丙午', kor: '병오년', color: 'text-fire', isDefault: true },
    { year: '2027', hanja: '丁未', kor: '정미년', color: 'text-metal' },
    { year: '2028', hanja: '戊申', kor: '무신년', color: 'text-metal' },
    { year: '2029', hanja: '己酉', kor: '기유년', color: 'text-water' },
    { year: '2030', hanja: '庚戌', kor: '경술년', color: 'text-water' }
  ];

  const currentDaeunDetail = daeunData[selectedDaeunIdx] || daeunData[3];
  const currentSewoonDetail = sewoonData[selectedSewoonIdx] || sewoonData[4];

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      {/* 화면 0: 랜딩 뷰 (요청받은 exact HTML 구조) */}
      {viewMode === 'landing' && (
        <div className="w-[412px] h-[892px] bg-navy flex flex-col justify-between relative overflow-hidden shadow-2xl border border-gray-800 px-7 pt-6 pb-12">
          {/* 상단 헤더 */}
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold tracking-widest text-gold uppercase"> </span>
            <button
              onClick={() => setViewMode('input')}
              className="text-gray-400 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* 로고와 타이틀 */}
          <div className="flex flex-col items-center text-center space-y-5 my-auto">
            <div className="w-20 h-20 rounded-2xl bg-card border border-gold/40 flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.12)]">
              <svg className="w-10 h-10 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                <path d="M6 3H18L21 8L12 21L3 8L6 3Z" fill="currentColor" fillOpacity="0.25"/>
                <path d="M6 3H18M3 8H21M9 3L12 21L15 3" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-black tracking-wide bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                루멘 사주 만세력
              </h1>
              <p className="text-xs text-gray-400 leading-relaxed max-w-[280px]">
                오차 없는 <strong className="text-gold font-medium">정통 만세력</strong> 기반<br/>
                사주 원국의 <strong className="text-gray-200 font-medium">십성·길신·충합</strong> 정밀 분석<br/>
                <span className="text-gray-200 font-medium mt-1 inline-block">AI 알고리즘을 통한 정밀 분석</span>
              </p>
            </div>
          </div>

          {/* 하단 버튼 및 로그인 영역 */}
          <div className="w-full space-y-3 mb-6">
            <button
              onClick={() => setViewMode('input')}
              className="w-full bg-[#FACC15] hover:bg-[#e0b812] text-black font-extrabold py-3.5 px-4 rounded-xl shadow-[0_4px_20px_rgba(250,204,21,0.25)] transition transform active:scale-98 text-sm cursor-pointer"
            >
              내 사주 원국 분석 시작하기 →
            </button>
            <div className="text-center">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setViewMode('input'); }}
                className="text-xs text-gray-400 hover:text-gold transition"
              >
                이미 계정이 있으신가요? <span className="text-white font-medium underline underline-offset-2">로그인</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 화면 1: 정보 입력 뷰 / 로딩 / 결과 뷰 / 보관함 뷰 */}
      {viewMode !== 'landing' && (
        <div className="w-[412px] h-[892px] bg-navy flex flex-col justify-between relative overflow-hidden shadow-2xl border border-gray-800">
          
          {/* 보관함 탭 뷰 (activeTab이 'storage' 또는 '보관함'일 때 UI) */}
          {(activeTab === 'storage' || activeTab === '보관함') ? (
            <div id="view-storage" className="flex flex-col h-full justify-between bg-navy">
              {/* 상단 영역: 헤더 + 뒤로가기 버튼 + 검색창 + 그룹 필터 탭 */}
              <div className="flex-none p-4 border-b border-gray-800/80 bg-navy/95 backdrop-blur-md">
                {/* 헤더 타이틀 & 뒤로가기 버튼 */}
                <div className="flex items-center justify-between mb-3.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setActiveTab('saju'); setViewMode('result'); }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#131d33] border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 text-xs font-semibold transition cursor-pointer"
                      title="이전 결과 화면으로 돌아가기"
                    >
                      <span>← 뒤로가기</span>
                    </button>
                    <div className="flex items-center gap-1.5 ml-1">
                      <span className="text-xl leading-none">📇</span>
                      <h2 className="text-lg font-bold text-white tracking-tight">사주 보관함</h2>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-medium px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30">
                    저장 {filteredSavedSajuList.length}개
                  </span>
                </div>

                {/* 검색창 및 정렬 드롭다운 */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={storageSearchTerm}
                      onChange={(e) => setStorageSearchTerm(e.target.value)}
                      placeholder="이름 또는 메모 검색..."
                      className="w-full bg-[#131d33] border border-gray-700/80 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
                    />
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {storageSearchTerm && (
                      <button
                        onClick={() => setStorageSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* 커스텀 정렬 드롭다운 (Div UI) */}
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="bg-[#131d33] border border-gray-700/80 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-medium focus:outline-none focus:border-amber-400 transition cursor-pointer flex items-center gap-1.5 shadow-inner"
                    >
                      <span>
                        {storageSortOption === 'latestSave' && '최근저장순'}
                        {storageSortOption === 'latestView' && '최근검색순'}
                        {storageSortOption === 'nameAsc' && '이름순'}
                        {storageSortOption === 'birthAsc' && '생년월일순'}
                      </span>
                      <svg className={`w-3 h-3 text-amber-400 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isSortDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setIsSortDropdownOpen(false)} />
                        <div className="absolute right-0 mt-1 w-28 bg-[#131d33] border border-gray-700/90 rounded-xl shadow-2xl z-30 py-1 overflow-hidden animate-fadeIn">
                          {[
                            { key: 'latestSave', label: '최근저장순' },
                            { key: 'latestView', label: '최근검색순' },
                            { key: 'nameAsc', label: '이름순' },
                            { key: 'birthAsc', label: '생년월일순' },
                          ].map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() => {
                                setStorageSortOption(opt.key as any);
                                setIsSortDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer flex items-center justify-between ${
                                storageSortOption === opt.key
                                  ? 'bg-amber-400/20 text-amber-300 font-bold'
                                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                              }`}
                            >
                              <span>{opt.label}</span>
                              {storageSortOption === opt.key && (
                                <span className="text-amber-400 text-[10px]">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 그룹 필터 탭 [전체, 그룹1, 그룹2, 그룹3, 일반] 및 그룹 편집 버튼 */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {['전체', ...customGroups, '일반'].map((group) => {
                    const isActive = storageSelectedGroup === group;
                    const cStyle = group === '전체' ? null : getGroupColorStyle(group);
                    return (
                      <button
                        key={group}
                        onClick={() => setStorageSelectedGroup(group)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                          isActive
                            ? group === '전체'
                              ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-[0_0_10px_rgba(212,175,55,0.2)] font-extrabold'
                              : 'font-extrabold shadow-sm'
                            : 'bg-[#131d33] text-gray-400 border-gray-800 hover:text-gray-200 hover:bg-gray-800/50'
                        }`}
                        style={
                          isActive && group !== '전체' && cStyle
                            ? {
                                backgroundColor: cStyle.bgHex,
                                color: cStyle.textHex,
                                borderColor: cStyle.borderHex,
                              }
                            : undefined
                        }
                      >
                        {group}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setIsGroupManageModalOpen(true)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap bg-gray-800/80 hover:bg-gray-700 text-amber-300/90 border border-gray-700/80 transition-all cursor-pointer flex items-center gap-1 shrink-0 ml-auto"
                    title="그룹 관리 및 편집"
                  >
                    <span>⚙️ 편집</span>
                  </button>
                </div>
              </div>

              {/* 중앙 영역: 저장 목록 또는 Empty State */}
              <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-3.5 no-scrollbar">

                {/* 일반 보관함 목록 또는 Empty State */}
                {filteredSavedSajuList.length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-[#131d33] border border-amber-400/20 flex items-center justify-center mb-3 shadow-lg shadow-black/20">
                      <span className="text-2xl">📇</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1 tracking-tight">
                      보관함 사주가 없습니다.
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                      사주 분석 결과 화면에서 '사주 저장하기'를 누르면 보관함에 저장됩니다.
                    </p>
                  </div>
                ) : (
                  filteredSavedSajuList.map((item) => {
                    const calendarShort = item.calendar.includes('윤달') ? '음-윤달' : item.calendar.includes('음') ? '음' : '양';
                    const itemGroup = (!item.group || item.group === '미지정') ? '일반' : item.group;
                    const cStyle = getGroupColorStyle(itemGroup);
                    return (
                      <div
                        key={item.id}
                        className="bg-[#131d33] border border-gray-800/90 rounded-xl p-3.5 shadow-md space-y-2 hover:border-amber-400/30 transition duration-200"
                      >
                        {/* 1. 첫 번째 줄 */}
                        <div className="flex items-center justify-between gap-2 border-b border-gray-800/60 pb-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="text-sm font-bold text-white tracking-tight">{item.name}</h3>
                            <span
                              className="text-[10.5px] px-2.5 py-0.5 rounded-md font-extrabold shrink-0 border"
                              style={{
                                backgroundColor: cStyle.bgHex,
                                color: cStyle.textHex,
                                borderColor: cStyle.borderHex,
                              }}
                            >
                              {itemGroup}
                            </span>
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="px-2 py-0.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] font-medium border border-gray-700 transition cursor-pointer flex items-center gap-1 shrink-0"
                            >
                              <span>✏️</span>
                              <span>수정</span>
                            </button>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 ml-auto flex-wrap justify-end">
                            <button
                              onClick={() => setLoadConfirmItem(item)}
                              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow-md shadow-blue-900/30 transition cursor-pointer flex items-center gap-0.5 shrink-0 active:scale-95"
                            >
                              <span>📂 불러오기</span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirmItem(item)}
                              className="px-2 py-1 rounded-lg bg-transparent hover:bg-rose-500/10 text-rose-300/80 hover:text-rose-300 text-[11px] font-medium border border-rose-400/30 transition cursor-pointer flex items-center gap-0.5 shrink-0 active:scale-95"
                            >
                              <span>🗑️ 삭제</span>
                            </button>
                          </div>
                        </div>

                        {/* 2. 두 번째 줄: 📅 生年月日(양/음) | 성별 | 태어난시간 */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-300">
                          <span className="text-amber-400 shrink-0">📅</span>
                          <span className="truncate">
                            {item.birthYear}.{String(item.birthMonth).padStart(2, '0')}.{String(item.birthDay).padStart(2, '0')}({calendarShort})
                            {' '}<span className="text-gray-600">|</span>{' '}
                            {item.gender === 'male' ? '남성' : '여성'}
                            {' '}<span className="text-gray-600">|</span>{' '}
                            {item.isUnknownTime ? '시간 모름' : item.birthTime}
                          </span>
                        </div>

                        {/* 3. 세 번째 줄: 💬 메모 한 줄 표시 */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-amber-400 shrink-0">💬</span>
                          {item.memo ? (
                            <span className="text-gray-200 truncate font-normal">{item.memo}</span>
                          ) : (
                            <span className="text-gray-500 italic font-normal">등록된 메모 없음</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* 하단 고정 탭바 (공통 - 5개 탭 균등 배치) */}
              <div className="bg-navy border-t border-gray-800/80 px-2 py-3 grid grid-cols-5 items-center w-full z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
                <button
                  onClick={() => { setActiveTab('saju'); setViewMode('input'); }}
                  className="flex flex-col items-center justify-center gap-1.5 cursor-pointer min-w-0 py-1 text-gray-300 hover:text-white transition"
                >
                  <div>
                    <svg className="w-6 h-6 overflow-visible" viewBox="0 0 24 24" fill="#3B82F6">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M12 12.5c-4.5 0-7.5 2.5-7.5 5.5 0 1.4 1.1 2.5 2.5 2.5h10c1.4 0 2.5-1.1 2.5-2.5 0-3-3-5.5-7.5-5.5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">정보입력</span>
                </button>
                <button
                  onClick={() => setActiveTab('storage')}
                  className="flex flex-col items-center justify-center gap-1.5 cursor-pointer min-w-0 py-1"
                >
                  <div className="text-gold filter drop-shadow-[0_0_6px_rgba(212,175,55,0.4)]">
                    <span className="text-xl leading-none">📇</span>
                  </div>
                  <span className="text-xs font-bold text-gold whitespace-nowrap">보관함</span>
                </button>
                <button
                  onClick={() => { setActiveTab('gunghap'); setGunghapSubTab('wonguk'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-rose-400 hover:text-rose-300 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_6px_rgba(251,113,133,0.5)] transform group-hover:scale-110 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-rose-300 whitespace-nowrap">궁합</span>
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className="flex flex-col items-center justify-center gap-1.5 text-cyan-400 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transform group-hover:scale-110 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 2L3 8l9 13L21 8l-3-6H6z" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M3 8h18M6 2l3 6M18 2l-3 6M9 8l3 13 3-13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-cyan-400 whitespace-nowrap">프리미엄</span>
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setViewMode('input'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer min-w-0 py-1"
                >
                  <div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">설정</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'gunghap' ? (
            /* --- 신규 독립 [궁합] 탭 뷰 --- */
            <div id="view-gunghap" className="flex flex-col h-full bg-[#0a0f1d] text-white relative">
              {/* 상단 타이틀 헤더 */}
              <div className="px-5 pt-4 pb-3 border-b border-gray-800/80 bg-[#131d33] shadow-md shrink-0">
                <div className="relative flex items-center justify-center mb-3 min-h-[36px]">
                  <button
                    onClick={() => { setActiveTab('saju'); setViewMode('result'); }}
                    className="absolute left-0 p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
                    aria-label="뒤로가기"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="text-base font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
                    <span className="text-rose-400 text-lg">❤️</span>
                    <span>사주 궁합</span>
                  </h2>
                </div>

                {/* 상단 2개 서브 탭 (원국 분석 / 궁합 분석) */}
                <div className="grid grid-cols-2 gap-2 bg-[#0a0f1d] p-1.5 rounded-2xl border border-gray-800/90 shadow-inner">
                  <button
                    onClick={() => setGunghapSubTab('wonguk')}
                    className={`py-3 px-3.5 text-sm font-black rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                      gunghapSubTab === 'wonguk'
                        ? 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white shadow-lg shadow-pink-950/40 border border-pink-300/40 ring-1 ring-pink-400/30 scale-[1.01]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent font-bold'
                    }`}
                  >
                    <span className="text-base">☯️</span>
                    <span>원국 분석</span>
                  </button>
                  <button
                    onClick={() => setGunghapSubTab('view')}
                    className={`py-3 px-3.5 text-sm font-black rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                      gunghapSubTab === 'view'
                        ? 'bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white shadow-lg shadow-pink-950/40 border border-pink-300/40 ring-1 ring-pink-400/30 scale-[1.01]'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent font-bold'
                    }`}
                  >
                    <span className="text-base">🔮</span>
                    <span>궁합 분석</span>
                  </button>
                </div>
              </div>

              {/* 콘텐츠 영역 */}
              {gunghapSubTab === 'wonguk' ? (
                /* --- 원국 분석 전용 화면 --- */
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4.5 no-scrollbar">
                  {/* (1) 상단 대표사주 영역 */}
                  <div className="bg-[#131d33] border border-gray-800/80 rounded-2xl p-4 space-y-3 transition shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-800/70 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span className="text-purple-400">☯️</span>
                          <span>내 대표사주</span>
                        </span>
                        {gunghapRepresentativeSaju && (
                          <span className="text-[10.5px] font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-400/25">
                            분석 대상
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSelectGunghapRepModalOpen(true)}
                        className="text-xs text-purple-300 hover:text-purple-200 font-bold bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-xl border border-purple-500/30 transition cursor-pointer active:scale-95 flex items-center gap-1"
                      >
                        <span>{gunghapRepresentativeSaju ? '대표사주 변경' : '대표사주 설정'}</span>
                        <span>⚙️</span>
                      </button>
                    </div>

                    {gunghapRepresentativeSaju ? (
                      <div className="flex items-center justify-between bg-navy/60 p-3 rounded-xl border border-gray-800/80">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{gunghapRepresentativeSaju.name} 님</span>
                            <span className="text-[11px] text-gray-400">({gunghapRepresentativeSaju.gender === 'male' ? '남성' : '여성'})</span>
                          </div>
                          <p className="text-[11.5px] text-gray-400 font-medium">
                            📅 {gunghapRepresentativeSaju.birthYear}.{String(gunghapRepresentativeSaju.birthMonth).padStart(2, '0')}.{String(gunghapRepresentativeSaju.birthDay).padStart(2, '0')} {gunghapRepresentativeSaju.calendar?.includes('음') || gunghapRepresentativeSaju.calendar === 'lunar' || gunghapRepresentativeSaju.calendar === 'lunar-leap' ? '(음)' : '(양)'} | {gunghapRepresentativeSaju.isUnknownTime ? '시간 모름' : gunghapRepresentativeSaju.birthTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-purple-300 block bg-purple-500/15 px-2.5 py-1 rounded-lg border border-purple-400/25 shadow-sm">
                            {getDayMasterFullDisplay(gunghapRepresentativeSaju.dayMasterStr, gunghapRepresentativeSaju.dayPillarStr)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-navy/60 p-4 rounded-xl border border-dashed border-gray-700/80 text-center space-y-2">
                        <p className="text-xs text-gray-300 font-medium">
                          설정된 대표사주가 없습니다.<br />
                          보관함 사주 중 대표사주를 지정해 주세요.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsSelectGunghapRepModalOpen(true)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600/80 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer active:scale-95 inline-flex items-center gap-1 shadow-sm"
                        >
                          <span>👉</span>
                          <span>대표사주 선택하기</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* (2) 무료 상세 사주분석 메인 버튼 영역 */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!gunghapRepresentativeSaju) {
                          setIsSelectGunghapRepModalOpen(true);
                          return;
                        }
                        setIsWongukConfirmModalOpen(true);
                      }}
                      className="w-full py-4 px-5 rounded-2xl font-black text-base transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 text-white shadow-purple-950/20 hover:brightness-105 active:scale-[0.98]"
                    >
                      <span className="text-xl">☯️</span>
                      <span>
                        {!gunghapRepresentativeSaju
                          ? '대표사주 설정 후 정밀 사주분석 보기'
                          : '상세 사주분석 보기'}
                      </span>
                      <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full ml-1 font-bold">
                        {remainingFreeWongukCount > 0 ? `무료 ${remainingFreeWongukCount}회 남음` : '정밀분석'}
                      </span>
                    </button>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                      <span>✨ 최초 2회 무료 제공 (약 4,000자 분량 상세분석)</span>
                      <span className="text-purple-300 font-semibold">
                        사용 {wongukFreeCount}/2회
                      </span>
                    </div>
                  </div>

                  {/* (3) 사주분석 특징 가이드 */}
                  <div className="bg-[#131d33] border border-gray-800/80 rounded-2xl p-4 space-y-2 text-xs text-gray-300">
                    <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                      <span className="text-purple-400">💡</span>
                      <span>사주분석 특징</span>
                    </div>
                    <ul className="space-y-1.5 text-gray-400 text-[11.5px] list-disc list-inside leading-relaxed">
                      <li>대표사주의 일간과 음양오행, 십성, 핵심 신살을 다각도로 정밀 해독합니다.</li>
                      <li>성격, 타고난 재물운, 직업 적성, 애정운, 대운의 흐름 등 사주의 주요 영역을 종합적으로 분석합니다.</li>
                      <li>입력된 사주 정보를 바탕으로 개인의 성향과 인생의 흐름을 다양한 관점에서 상세하게 풀이합니다.</li>
                    </ul>
                  </div>

                  {/* (4) 사주분석 결과 보관함 */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span className="text-purple-300">☯️</span>
                          <span>사주 상세분석 보관함</span>
                        </span>
                        <span className="text-[10.5px] font-bold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-400/25">
                          {savedWongukList.length}개
                        </span>
                      </div>
                      <span className="text-[10.5px] text-gray-400">생성일로부터 180일 보관</span>
                    </div>

                    {savedWongukList.length === 0 ? (
                      <div className="bg-[#131d33] border border-gray-800/80 rounded-2xl p-6 text-center space-y-2">
                        <div className="text-2xl">☯️</div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          저장된 사주 상세분석 결과가 없습니다.<br />
                          상단 '상세 사주분석 보기'를 통해 나만의 정밀 사주분석을 진행해 보세요!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {savedWongukList.map((item) => {
                          const expiryDDayText = getWongukExpiryDDayText(item.createdAtTimestamp);
                          const badge = getWongukBadgeInfo(item);
                          const birthStr = item.birthYear
                            ? `${item.birthYear}.${String(item.birthMonth).padStart(2, '0')}.${String(item.birthDay).padStart(2, '0')}`
                            : '';
                          return (
                            <div
                              key={item.id}
                              className="bg-[#131d33] border border-gray-800/80 hover:border-purple-400/30 rounded-2xl p-4 space-y-3 transition shadow-sm"
                            >
                              {/* 상단 Header: 3단 구조 (①분석 유형 배지, ②이름, ③생년월일+생성일) 및 보관기간 D-Day */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1 min-w-0 flex-1">
                                  {/* ① 분석 유형 (미니박스/배지) */}
                                  <div className="flex items-center">
                                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border tracking-tight ${badge.className}`}>
                                      {badge.label}
                                    </span>
                                  </div>

                                  {/* ② 분석 대상 이름 (긴 이름도 깨지지 않도록 break-all 및 깔끔한 줄바꿈) */}
                                  <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5 break-all pt-0.5 leading-snug">
                                    <span className="text-purple-400 shrink-0">☯️</span>
                                    <span>{item.sajuName}</span>
                                  </h4>

                                  {/* ③ 생년월일 + 생성일 (이름 중복 제거) */}
                                  <p className="text-[11px] text-gray-400 font-medium break-all leading-normal">
                                    👤 {birthStr ? `${birthStr} ` : ''}(생성일 {item.createdAt})
                                  </p>
                                </div>

                                {/* 남은기간 뱃지 (180일 기준 - 우측 상단 위치 그대로 유지) */}
                                <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-lg bg-purple-950/40 text-purple-200 border border-purple-500/25 shrink-0 shadow-sm mt-0.5 whitespace-nowrap">
                                  ⏳ {expiryDDayText}
                                </span>
                              </div>

                              {/* 하단 우측 배치 기능 버튼 3개 (다시보기, 다운로드, 삭제) */}
                              <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-800/50">
                                <button
                                  type="button"
                                  onClick={() => setCurrentWongukDetail(item)}
                                  className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-400/30 text-xs font-bold transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                                >
                                  <span>📄</span>
                                  <span>다시보기</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => downloadWongukPdf(item)}
                                  className="px-3 py-1.5 rounded-xl bg-navy border border-amber-400/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-200 text-xs font-bold transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                                >
                                  <span>📥</span>
                                  <span>다운로드</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSingleWongukToDelete(item)}
                                  className="px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-rose-950/40 text-gray-300 hover:text-rose-300 border border-gray-700/80 hover:border-rose-500/40 text-xs font-semibold transition cursor-pointer active:scale-95 flex items-center gap-1"
                                >
                                  <span>🗑️</span>
                                  <span>삭제</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : gunghapViewStep === 'main' ? (
                  /* --- 1. 궁합 메인 화면 --- */
                  <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4.5 no-scrollbar">
                    {/* (1) 대표사주 고정 영역 */}
                    {gunghapRepresentativeSaju ? (
                      <div className="bg-gradient-to-r from-amber-500/15 via-[#131d33] to-amber-500/10 border-2 border-amber-400/80 rounded-2xl p-4 shadow-xl space-y-2.5 relative">
                        <div className="flex items-center justify-between border-b border-amber-400/20 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded text-[11px] shadow-sm flex items-center gap-1 shrink-0">
                              ⭐ 대표사주
                            </span>
                            <h3 className="text-base font-extrabold text-white tracking-tight">{gunghapRepresentativeSaju.name}</h3>
                          </div>
                          {/* ✎ 수정 버튼 */}
                          <button
                            onClick={() => setIsSelectGunghapRepModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-300/30 text-amber-300 border border-amber-400/50 text-xs font-extrabold transition cursor-pointer flex items-center gap-1 active:scale-95 shrink-0 shadow-sm"
                          >
                            <span>✎</span>
                            <span>수정</span>
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-amber-200/90 font-medium flex-wrap">
                          <span className="text-amber-400 shrink-0">📅</span>
                          <span>
                            {gunghapRepresentativeSaju.birthYear}.{String(gunghapRepresentativeSaju.birthMonth).padStart(2, '0')}.{String(gunghapRepresentativeSaju.birthDay).padStart(2, '0')}
                            {' '}({gunghapRepresentativeSaju.calendar.includes('윤달') ? '음-윤달' : gunghapRepresentativeSaju.calendar.includes('음') ? '음' : '양'})
                            {' '}<span className="text-gray-600">|</span>{' '}
                            {gunghapRepresentativeSaju.gender === 'male' ? '남성' : '여성'}
                            {' '}<span className="text-gray-600">|</span>{' '}
                            {gunghapRepresentativeSaju.isUnknownTime ? '시간 모름' : gunghapRepresentativeSaju.birthTime}
                          </span>
                        </div>
                        {gunghapRepresentativeSaju.memo && (
                          <p className="text-xs text-gray-300 italic truncate font-normal">💬 {gunghapRepresentativeSaju.memo}</p>
                        )}
                      </div>
                    ) : (
                      <div className="bg-[#131d33] border border-amber-400/40 rounded-2xl p-5 text-center space-y-3 shadow-lg">
                        <div className="text-amber-400 text-2xl">⚠️</div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-white">등록된 대표사주가 없습니다.</h4>
                          <p className="text-xs text-gray-300 font-medium leading-relaxed">
                            궁합 분석을 시작하려면 대표사주를 설정해주세요.
                          </p>
                        </div>
                        <button
                          onClick={() => setIsSelectGunghapRepModalOpen(true)}
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-extrabold text-xs rounded-xl hover:brightness-110 transition cursor-pointer shadow-md active:scale-95"
                        >
                          👑 대표사주 설정하기
                        </button>
                      </div>
                    )}

                    {/* (2) 최초 1회 무료 상세 궁합 사용 상태 배너 */}
                    <div className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-sm ${
                      hasUsedFirstFreeGunghap
                        ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                        : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{hasUsedFirstFreeGunghap ? '🔒' : '🎁'}</span>
                        <div>
                          <div className="font-bold text-xs">
                            {hasUsedFirstFreeGunghap ? '최초 1회 무료 혜택 사용 완료 (유료 전환)' : '최초 1회 무료 상세 궁합 혜택 적용 가능'}
                          </div>
                          <div className="text-[10.5px] opacity-80 font-normal mt-0.5">
                            {hasUsedFirstFreeGunghap
                              ? '최초 1회 무료 혜택이 사용되어 상세 궁합보기는 유료 서비스로 제공됩니다.'
                              : '로그인 후 최초 1회에 한해 약 2,000자 분량의 전문 상세 분석 리포트를 무료로 제공합니다.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* (3) 현재 선택된 상대방이 있는 경우 미리보기 카드 */}
                    {selectedGunghapTargetId && (() => {
                      const targetObj = savedSajuList.find(i => i.id === selectedGunghapTargetId);
                      if (!targetObj) return null;
                      const calendarShort = targetObj.calendar.includes('윤달') ? '음-윤달' : targetObj.calendar.includes('음') ? '음' : '양';
                      const targetGroupTag = (!targetObj.group || targetObj.group === '미지정' || targetObj.group.trim() === '') ? '일반' : targetObj.group;
                      const cStyle = getGroupColorStyle(targetGroupTag);
                      return (
                        <div className="bg-[#131d33] border border-rose-500/40 rounded-2xl p-4 shadow-lg space-y-2.5 relative">
                          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                            <span className="text-xs font-bold text-rose-300 flex items-center gap-1">
                              <span>💕</span> 선택된 궁합 상대
                            </span>
                            <button
                              onClick={() => setGunghapViewStep('selectTarget')}
                              className="text-[11px] font-bold text-gray-400 hover:text-white transition cursor-pointer underline"
                            >
                              상대 변경하기 →
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-extrabold text-white">{targetObj.name}</h4>
                                <span
                                  className="text-[10.5px] px-2 py-0.5 rounded-md font-extrabold shrink-0 border"
                                  style={{
                                    backgroundColor: cStyle.bgHex,
                                    color: cStyle.textHex,
                                    borderColor: cStyle.borderHex,
                                  }}
                                >
                                  {targetGroupTag}
                                </span>
                              </div>
                              <p className="text-xs text-gray-300 mt-1">
                                📅 {targetObj.birthYear}.{String(targetObj.birthMonth).padStart(2, '0')}.{String(targetObj.birthDay).padStart(2, '0')}({calendarShort})
                                {' '}<span className="text-gray-600">|</span>{' '}
                                {targetObj.gender === 'male' ? '남성' : '여성'}
                              </p>
                            </div>
                            <span className="text-xl">✨</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* (4) 메인 「궁합 보기」 핵심 Action 버튼 */}
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          if (!gunghapRepresentativeSaju) {
                            setIsSelectGunghapRepModalOpen(true);
                            return;
                          }
                          setGunghapViewStep('selectTarget');
                        }}
                        className="w-full py-4 px-5 rounded-2xl font-black text-base transition-all shadow-xl cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white shadow-pink-950/20 hover:brightness-105 active:scale-[0.98]"
                      >
                        <span className="text-xl">🔮</span>
                        <span>
                          {!gunghapRepresentativeSaju
                            ? '대표사주 설정 후 궁합 보기'
                            : selectedGunghapTargetId
                            ? '궁합 상대 변경 / 보기'
                            : '궁합 보기 (상대방 선택)'}
                        </span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full ml-1">→</span>
                      </button>
                    </div>

                    {/* (5) 서비스 가이드 안내 */}
                    <div className="bg-[#131d33] border border-gray-800/80 rounded-2xl p-4 space-y-2 text-xs text-gray-300">
                      <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                        <span>💡</span>
                        <span>궁합 분석 특징</span>
                      </div>
                      <ul className="space-y-1.5 text-gray-400 text-[11.5px] list-disc list-inside leading-relaxed">
                        <li>보관함에 저장된 대상 중 한 명을 선택하여 정밀 궁합을 분석합니다.</li>
                        <li>두 사람의 사주 원국, 십성, 오행의 상생상극을 종합 계산합니다.</li>
                        <li>생성된 고급 리포트는 아래 보관함에 저장되어 생성일로부터 90일간 이용할 수 있습니다.</li>
                      </ul>
                    </div>

                    {/* (6) 「궁합 상세분석」 결과 카드 목록 */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span className="text-pink-300">📜</span>
                            <span>궁합 상세분석 보관함</span>
                          </span>
                          <span className="text-[10.5px] font-bold text-pink-300 bg-pink-500/15 px-2.5 py-0.5 rounded-full border border-pink-400/25">
                            {savedGunghapList.length}개
                          </span>
                        </div>
                        <span className="text-[10.5px] text-gray-400">생성일로부터 90일 보관</span>
                      </div>

                      {savedGunghapList.length === 0 ? (
                        <div className="bg-[#131d33] border border-gray-800/80 rounded-2xl p-6 text-center space-y-2">
                          <div className="text-2xl">📜</div>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            저장된 궁합 상세분석 결과가 없습니다.<br />
                            상단 '궁합 보기'를 통해 정밀 궁합 분석을 진행해 보세요!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {savedGunghapList.map((item) => {
                            const expiryDDayText = getExpiryDDayText(item.createdAtTimestamp);
                            return (
                              <div
                                key={item.id}
                                className="bg-[#131d33] border border-gray-800/80 hover:border-pink-400/30 rounded-2xl p-4 space-y-3 transition shadow-sm"
                              >
                                {/* 상단 Header: 3단 구조 (①분석 유형 배지, ②분석 대상, ③생년월일+생성일) 및 보관기간 D-Day */}
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1 min-w-0 flex-1">
                                    {/* ① 분석 유형 */}
                                    <div className="flex items-center">
                                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md border tracking-tight bg-pink-500/20 text-pink-300 border-pink-400/35">
                                        궁합 상세분석
                                      </span>
                                    </div>

                                    {/* ② 분석 대상 이름 (긴 이름도 자연스럽게 줄바꿈) */}
                                    <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5 break-all pt-0.5 leading-snug">
                                      <span className="text-pink-400 shrink-0">💕</span>
                                      <span>{item.mySajuName} & {item.targetSajuName}</span>
                                    </h4>

                                    {/* ③ 상대 정보 + 생년월일 + 생성일 */}
                                    <p className="text-[11px] text-gray-400 font-medium break-all leading-normal">
                                      👤 {item.targetBirthYear ? `${item.targetBirthYear}.${String(item.targetBirthMonth).padStart(2, '0')}.${String(item.targetBirthDay).padStart(2, '0')} ` : ''}({item.targetGender === 'male' ? '남성' : '여성'}) · 생성일 {item.createdAt}
                                    </p>
                                  </div>

                                  {/* 남은기간 뱃지 (90일 기준 - 우측 상단 유지) */}
                                  <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-lg bg-pink-950/30 text-pink-200 border border-pink-500/25 shrink-0 shadow-sm mt-0.5 whitespace-nowrap">
                                    ⏳ {expiryDDayText}
                                  </span>
                                </div>

                                {/* 하단 우측 배치 기능 버튼 3개 (다시보기, 다운로드, 삭제) */}
                                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-800/50">
                                  <button
                                    type="button"
                                    onClick={() => setCurrentGunghapDetail(item)}
                                    className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-200 border border-pink-400/30 text-xs font-bold transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                                  >
                                    <span>📄</span>
                                    <span>다시보기</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => downloadGunghapPdf(item)}
                                    className="px-3 py-1.5 rounded-xl bg-navy border border-amber-400/30 hover:border-amber-400/60 text-amber-300 hover:text-amber-200 text-xs font-bold transition cursor-pointer shadow-sm active:scale-95 flex items-center gap-1"
                                  >
                                    <span>📥</span>
                                    <span>다운로드</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setSingleGunghapToDelete(item)}
                                    className="px-3 py-1.5 rounded-xl bg-gray-800/80 hover:bg-rose-950/40 text-gray-300 hover:text-rose-300 border border-gray-700/80 hover:border-rose-500/40 text-xs font-semibold transition cursor-pointer active:scale-95 flex items-center gap-1"
                                  >
                                    <span>🗑️</span>
                                    <span>삭제</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* --- 2. 상대방 선택 화면 (별도 스텝) --- */
                  <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                    {/* 스크롤 영역 (상단 타이틀, 검색창, 정렬/그룹, 상대 목록) */}
                    <div className="flex-1 overflow-y-auto px-4 pt-3 pb-6 space-y-3.5 no-scrollbar">
                      {/* 상단 이전 헤더 (차분한 그레이 계열 '이전' 버튼) */}
                      <div className="flex items-center border-b border-gray-800/80 pb-2.5">
                        <button
                          onClick={() => setGunghapViewStep('main')}
                          className="text-xs font-semibold text-gray-300 hover:text-white flex items-center gap-1.5 active:scale-95 cursor-pointer py-1.5 px-3 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700/70 transition shadow-sm"
                        >
                          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                          </svg>
                          <span>이전</span>
                        </button>
                      </div>

                      {/* 검색창 & 그룹 필터/정렬 옵션 */}
                      <div className="space-y-2.5 shrink-0">
                        {/* 검색창 */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="이름 또는 메모 검색..."
                            value={gunghapTargetSearchTerm}
                            onChange={(e) => setGunghapTargetSearchTerm(e.target.value)}
                            className="w-full bg-[#131d33] border border-gray-700/80 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition shadow-inner"
                          />
                          <svg
                            className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          {gunghapTargetSearchTerm && (
                            <button
                              onClick={() => setGunghapTargetSearchTerm('')}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>

                        {/* 그룹 필터 & 정렬 선택 */}
                        <div className="flex items-center gap-2">
                          {/* 그룹 필터 인라인 드롭다운 */}
                          <div className="relative flex-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsGunghapTargetGroupDropdownOpen(!isGunghapTargetGroupDropdownOpen);
                                setIsGunghapTargetSortDropdownOpen(false);
                              }}
                              className="w-full bg-[#131d33] border border-gray-700/80 hover:border-amber-400/60 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold focus:outline-none transition cursor-pointer flex items-center justify-between shadow-inner"
                            >
                              <span className="truncate">
                                {gunghapTargetSelectedGroup === '전체' ? '전체 그룹' : gunghapTargetSelectedGroup}
                              </span>
                              <svg className={`w-3 h-3 text-amber-400 shrink-0 ml-1 transition-transform ${isGunghapTargetGroupDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {isGunghapTargetGroupDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={() => setIsGunghapTargetGroupDropdownOpen(false)} />
                                <div className="absolute left-0 mt-1 w-full min-w-[120px] max-h-56 overflow-y-auto bg-[#131d33] border border-amber-500/50 rounded-xl shadow-2xl z-30 py-1 no-scrollbar animate-fadeIn">
                                  {['전체', ...customGroups, '일반'].map((grp) => {
                                    const isSelected = gunghapTargetSelectedGroup === grp;
                                    const cStyle = grp === '전체' ? null : getGroupColorStyle(grp);
                                    return (
                                      <button
                                        key={grp}
                                        type="button"
                                        onClick={() => {
                                          setGunghapTargetSelectedGroup(grp);
                                          setIsGunghapTargetGroupDropdownOpen(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer flex items-center justify-between ${
                                          isSelected
                                            ? 'bg-amber-400/20 text-amber-300 font-bold'
                                            : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                                        }`}
                                      >
                                        <div className="flex items-center gap-1.5 truncate">
                                          {cStyle && (
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cStyle.borderHex }} />
                                          )}
                                          <span className="truncate">{grp}</span>
                                        </div>
                                        {isSelected && (
                                          <span className="text-amber-400 text-xs font-bold shrink-0 ml-1">✓</span>
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>

                          {/* 정렬 옵션 커스텀 드롭다운 */}
                          <div className="relative flex-1">
                            <button
                              type="button"
                              onClick={() => {
                                setIsGunghapTargetSortDropdownOpen(!isGunghapTargetSortDropdownOpen);
                                setIsGunghapTargetGroupDropdownOpen(false);
                              }}
                              className="w-full bg-[#131d33] border border-gray-700/80 hover:border-amber-400/60 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold focus:outline-none transition cursor-pointer flex items-center justify-between shadow-inner"
                            >
                              <span className="truncate">
                                {gunghapTargetSortOption === 'latestRegistered' && '최근 등록순'}
                                {gunghapTargetSortOption === 'birthAsc' && '생년월일순'}
                                {gunghapTargetSortOption === 'nameAsc' && '이름순'}
                              </span>
                              <svg className={`w-3 h-3 text-amber-400 shrink-0 ml-1 transition-transform ${isGunghapTargetSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {isGunghapTargetSortDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-20" onClick={() => setIsGunghapTargetSortDropdownOpen(false)} />
                                <div className="absolute right-0 mt-1 w-full min-w-[125px] bg-[#131d33] border border-amber-500/50 rounded-xl shadow-2xl z-30 py-1 overflow-hidden animate-fadeIn">
                                  {[
                                    { key: 'latestRegistered', label: '최근 등록순' },
                                    { key: 'birthAsc', label: '생년월일순' },
                                    { key: 'nameAsc', label: '이름순' },
                                  ].map((opt) => (
                                    <button
                                      key={opt.key}
                                      type="button"
                                      onClick={() => {
                                        setGunghapTargetSortOption(opt.key as any);
                                        setIsGunghapTargetSortDropdownOpen(false);
                                      }}
                                      className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer flex items-center justify-between ${
                                        gunghapTargetSortOption === opt.key
                                          ? 'bg-amber-400/20 text-amber-300 font-bold'
                                          : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                                      }`}
                                    >
                                      <span>{opt.label}</span>
                                      {gunghapTargetSortOption === opt.key && (
                                        <span className="text-amber-400 text-xs font-bold">✓</span>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 상대 목록 */}
                      <div className="space-y-2 pt-1 pb-4">
                        {gunghapTargetList.length === 0 ? (
                          <div className="bg-[#131d33] border border-gray-800 rounded-xl p-6 text-center space-y-2">
                            <p className="text-xs text-gray-400 leading-relaxed">
                              {gunghapTargetSearchTerm || gunghapTargetSelectedGroup !== '전체'
                                ? '검색어 또는 선택한 그룹 조건에 부합하는 대상이 없습니다.'
                                : '궁합을 볼 수 있는 보관함 대상이 없습니다. 보관함에서 새로운 사주를 저장해주세요.'}
                            </p>
                          </div>
                        ) : (
                          gunghapTargetList.map((item) => {
                            const calendarShort = item.calendar.includes('윤달') ? '음-윤달' : item.calendar.includes('음') ? '음' : '양';
                            const itemGroupTag = (!item.group || item.group === '미지정' || item.group.trim() === '') ? '일반' : item.group;
                            const cStyle = getGroupColorStyle(itemGroupTag);

                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  setSelectedGunghapTargetId(item.id);
                                  setIsGunghapConfirmModalOpen(true);
                                }}
                                className="rounded-xl p-3.5 transition duration-200 cursor-pointer relative flex items-center justify-between gap-3 border border-gray-800 bg-[#131d33] hover:border-rose-400/50 hover:bg-[#16223b]"
                              >
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-sm font-bold text-white">{item.name}</h4>
                                    <span
                                      className="text-[10.5px] px-2 py-0.5 rounded-md font-extrabold shrink-0 border"
                                      style={{
                                        backgroundColor: cStyle.bgHex,
                                        color: cStyle.textHex,
                                        borderColor: cStyle.borderHex,
                                      }}
                                    >
                                      {itemGroupTag}
                                    </span>
                                  </div>
                                  <div className="text-xs text-gray-300 truncate">
                                    📅 {item.birthYear}.{String(item.birthMonth).padStart(2, '0')}.{String(item.birthDay).padStart(2, '0')}({calendarShort})
                                    {' '}<span className="text-gray-600">|</span>{' '}
                                    {item.gender === 'male' ? '남성' : '여성'}
                                  </div>
                                  <div className="text-[11px] text-gray-400">
                                    {item.lastGunghapAt
                                      ? `최근 궁합: ${new Date(item.lastGunghapAt).toLocaleDateString('ko-KR')}`
                                      : '궁합 실행 기록 없음'}
                                  </div>
                                </div>

                                {/* [선택] 버튼 */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGunghapTargetId(item.id);
                                    setIsGunghapConfirmModalOpen(true);
                                  }}
                                  className="py-1.5 px-3.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:brightness-110 active:scale-95 transition shadow-sm cursor-pointer shrink-0"
                                >
                                  선택
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

              {/* 궁합 탭 전용 하단 고정 탭바 */}
              <div className="bg-navy border-t border-gray-800/80 px-2 py-3 grid grid-cols-5 items-center w-full z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]">
                <button
                  onClick={() => { setActiveTab('saju'); setViewMode('input'); }}
                  className="flex flex-col items-center justify-center gap-1.5 cursor-pointer min-w-0 py-1 text-gray-300 hover:text-white transition"
                >
                  <div>
                    <svg className="w-6 h-6 overflow-visible" viewBox="0 0 24 24" fill="#3B82F6">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M12 12.5c-4.5 0-7.5 2.5-7.5 5.5 0 1.4 1.1 2.5 2.5 2.5h10c1.4 0 2.5-1.1 2.5-2.5 0-3-3-5.5-7.5-5.5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">정보입력</span>
                </button>
                <button
                  onClick={() => setActiveTab('storage')}
                  className="flex flex-col items-center justify-center gap-1.5 cursor-pointer min-w-0 py-1"
                >
                  <div className="text-gray-300 hover:text-white">
                    <span className="text-xl leading-none">📇</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">보관함</span>
                </button>
                <button
                  onClick={() => { setActiveTab('gunghap'); setGunghapSubTab('wonguk'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-rose-400 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_8px_rgba(251,113,133,0.7)] transform scale-105 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-rose-300 whitespace-nowrap">궁합</span>
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className="flex flex-col items-center justify-center gap-1.5 text-cyan-400 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transform group-hover:scale-110 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 2L3 8l9 13L21 8l-3-6H6z" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M3 8h18M6 2l3 6M18 2l-3 6M9 8l3 13 3-13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-cyan-400 whitespace-nowrap">프리미엄</span>
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setViewMode('input'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer min-w-0 py-1"
                >
                  <div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">설정</span>
                </button>
              </div>
            </div>
          ) : activeTab === 'premium' ? (
            /* --- 신규 독립 [프리미엄] 탭 전용 화면 --- */
            <div id="view-premium" className="flex flex-col h-full bg-[#0a0f1d] text-white relative">
              {/* 상단 타이틀 헤더 */}
              <div className="px-5 pt-4 pb-3 border-b border-gray-800/80 bg-[#131d33] shadow-md shrink-0">
                <div className="relative flex items-center justify-center min-h-[36px]">
                  {premiumSubView === 'storage' ? (
                    <button
                      onClick={() => setPremiumSubView('products')}
                      className="absolute left-0 p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
                      aria-label="상품목록으로 돌아가기"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => { setActiveTab('saju'); setViewMode('result'); }}
                      className="absolute left-0 p-2 rounded-xl bg-gray-800/60 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer flex items-center justify-center active:scale-95 shadow-sm"
                      aria-label="뒤로가기"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}
                  <h2 className="text-base font-extrabold text-white tracking-tight flex items-center justify-center gap-1.5">
                    <span className="text-cyan-400 text-lg">
                      {premiumSubView === 'storage' ? '📁' : '💎'}
                    </span>
                    <span>
                      {premiumSubView === 'storage' ? '프리미엄 보관함' : '프리미엄 사주'}
                    </span>
                  </h2>
                </div>
              </div>

              {premiumSubView === 'storage' ? (
                /* === [프리미엄 보관함] 전용 독립 화면 === */
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4 no-scrollbar">
                  {/* 상단 보관함 요약 헤더 바 */}
                  <div className="flex items-center justify-between bg-[#11192e] border border-cyan-500/30 rounded-2xl p-3.5 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📁</span>
                      <div>
                        <span className="text-xs font-bold text-white block">구매한 PREMIUM 리포트</span>
                        <span className="text-[11px] text-gray-400">
                          구매일로부터 1년간 다시보기 및 다운로드 지원
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                      총 {savedPremiumReportList.length}건
                    </span>
                  </div>

                  {/* 정렬된 프리미엄 리포트 목록 (구매일시 내림차순 -> 완료시간 내림차순) */}
                  {savedPremiumReportList.length === 0 ? (
                    <div className="bg-[#121c33]/70 border border-dashed border-gray-800 rounded-2xl p-8 text-center space-y-3 my-4">
                      <div className="w-12 h-12 rounded-2xl bg-gray-800/80 flex items-center justify-center mx-auto text-2xl text-gray-400">
                        📁
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-gray-200">보관된 프리미엄 리포트가 없습니다</h4>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-[260px] mx-auto">
                          프리미엄 탭에서 원하시는 상품을 구매하시면 이곳에 1년간 안전하게 보관됩니다.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setPremiumSubView('products')}
                          className="px-4 py-2 rounded-xl bg-cyan-600/90 hover:bg-cyan-500 text-black font-bold text-xs transition cursor-pointer shadow-md active:scale-95"
                        >
                          프리미엄 상품 보러가기 →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {savedPremiumReportList
                        .slice()
                        .sort((a, b) => {
                          if (b.purchasedAtTimestamp !== a.purchasedAtTimestamp) {
                            return b.purchasedAtTimestamp - a.purchasedAtTimestamp;
                          }
                          return (b.completedAtTimestamp || 0) - (a.completedAtTimestamp || 0);
                        })
                        .map((report) => {
                          const expiryStatus = getPremiumExpiryStatus(report.purchasedAtTimestamp);
                          return (
                            <div
                              key={report.id}
                              className="bg-[#121c33] border border-cyan-500/30 hover:border-cyan-400/60 rounded-2xl p-4 space-y-3 transition shadow-md relative overflow-hidden"
                            >
                              {/* 1. 상품명 & AI 분석 등급 */}
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-sm font-extrabold text-white">
                                      {report.productName}
                                    </h4>
                                    <span className="text-[10.5px] font-semibold text-cyan-300 bg-[#0c1424] px-2 py-0.5 rounded-md border border-cyan-800/50">
                                      {report.pages}
                                    </span>
                                  </div>
                                  <div className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                                    <span>{report.productType === 'gunghap' ? '⚡' : '🌟'}</span>
                                    <span>{report.aiGrade}</span>
                                  </div>
                                </div>

                                {/* 보관 만료 및 삭제 ⋮ 메뉴 영역 */}
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {expiryStatus.isExpired ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-red-950/80 text-red-400 border border-red-800/60">
                                      🔒 보관기간 만료
                                    </span>
                                  ) : expiryStatus.isImminent ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10.5px] font-extrabold bg-amber-950/80 text-amber-300 border border-amber-800/60">
                                      {expiryStatus.text}
                                    </span>
                                  ) : null}
                                  <button
                                    type="button"
                                    onClick={() => setReportToDelete(report)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800/80 transition cursor-pointer"
                                    title="리포트 삭제"
                                    aria-label="리포트 삭제"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>

                              {/* 2. 대상자 정보 (궁합인 경우 두 사람 표시) */}
                              <div className="bg-[#0c1424] rounded-xl p-3 border border-gray-800/80 space-y-1.5 text-xs">
                                {report.isGunghap ? (
                                  <>
                                    <div className="flex items-center gap-1.5 text-white font-bold">
                                      <span className="text-rose-400 font-extrabold">💕</span>
                                      <span>{report.targetName}</span>
                                      <span className="text-gray-400 font-normal">×</span>
                                      <span>{report.partnerName || '상대방'}</span>
                                    </div>
                                    <div className="text-gray-300 text-[11.5px] flex items-center gap-1.5">
                                      <span>📅</span>
                                      <span>
                                        {report.targetBirthYear}.{String(report.targetBirthMonth).padStart(2, '0')}.{String(report.targetBirthDay).padStart(2, '0')} ({report.targetBirthTime})
                                      </span>
                                      <span className="text-gray-500">×</span>
                                      <span>
                                        {report.partnerBirthYear ? `${report.partnerBirthYear}.${String(report.partnerBirthMonth).padStart(2, '0')}.${String(report.partnerBirthDay).padStart(2, '0')}` : ''}
                                        {report.partnerBirthTime ? ` (${report.partnerBirthTime})` : ''}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="flex items-center gap-1.5 text-white font-bold">
                                      <span className="text-cyan-400">👤</span>
                                      <span>{report.targetName} 님</span>
                                    </div>
                                    <div className="text-gray-300 text-[11.5px] flex items-center gap-1.5">
                                      <span>📅</span>
                                      <span>
                                        {report.targetBirthYear}.{String(report.targetBirthMonth).padStart(2, '0')}.{String(report.targetBirthDay).padStart(2, '0')} ({report.targetCalendar || '양력'}) · {report.targetBirthTime}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>

                              {/* 3. 구매일 및 보관기간 */}
                              <div className="grid grid-cols-2 gap-2 text-[11.5px] pt-1">
                                <div className="text-gray-400">
                                  구매일 · <span className="text-gray-200 font-medium">{report.purchasedAt}</span>
                                </div>
                                <div className="text-right text-gray-400">
                                  보관기간 · <span className="text-gray-200 font-medium">{report.expiresAt}까지</span>
                                </div>
                              </div>

                              {/* 4. 액션 버튼 3종: "다시보기", "다운로드", "삭제" */}
                              <div className="pt-2.5 border-t border-gray-800/80 flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setReportToDelete(report)}
                                  className="px-3 py-1.5 rounded-xl bg-gray-800/70 hover:bg-red-950/50 text-gray-400 hover:text-red-300 text-xs font-semibold transition cursor-pointer border border-gray-700/60"
                                >
                                  삭제
                                </button>
                                <button
                                  type="button"
                                  disabled={expiryStatus.isExpired}
                                  onClick={() => downloadPremiumReportPdf(report)}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 border ${
                                    expiryStatus.isExpired
                                      ? 'bg-gray-800/40 text-gray-500 border-gray-800 cursor-not-allowed'
                                      : 'bg-[#101b2f] hover:bg-cyan-950/60 text-cyan-300 hover:text-cyan-200 border-cyan-800/60 shadow-sm'
                                  }`}
                                >
                                  <span>다운로드</span>
                                </button>
                                <button
                                  type="button"
                                  disabled={expiryStatus.isExpired}
                                  onClick={() => setActiveViewingReport(report)}
                                  className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center gap-1 shadow-sm ${
                                    expiryStatus.isExpired
                                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                      : 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-black active:scale-95'
                                  }`}
                                >
                                  <span>다시보기</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              ) : (
                /* === [프리미엄 상품 목록] 화면 === */
                <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28 space-y-4 no-scrollbar">
                  {/* 1. 상단 간결해진 프리미엄 핵심 안내 배너 */}
                  <div className="bg-gradient-to-br from-[#13233b] via-[#101b2f] to-[#0c1322] border border-cyan-500/30 rounded-2xl p-4 shadow-lg relative overflow-hidden space-y-2">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                        <span className="text-cyan-400">💎</span>
                        <span>프리미엄 사주</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                        PREMIUM AI SERVICE
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      «고급 AI와 플래그십 AI를 활용한 심층 명리 분석 리포트를 제공합니다.»
                    </p>

                    {/* 무료 vs 프리미엄 간결 비교 바 */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80 text-[11px]">
                      <div className="bg-[#090e1a]/80 rounded-xl p-2 border border-gray-800">
                        <span className="text-gray-400 font-semibold block mb-0.5">무료 기본 분석</span>
                        <span className="text-gray-200">원국 4기둥 & 기초 요약</span>
                      </div>
                      <div className="bg-cyan-950/40 rounded-xl p-2 border border-cyan-500/30">
                        <span className="text-cyan-300 font-bold block mb-0.5">PREMIUM 서비스</span>
                        <span className="text-cyan-100">AI 정밀 분석 & 최대 32장</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. 「프리미엄 보관함 바로가기」 박스 */}
                  <div
                    onClick={() => setPremiumSubView('storage')}
                    className="bg-gradient-to-r from-[#111c33] via-[#0e172a] to-[#122238] border border-cyan-500/40 hover:border-cyan-400/80 rounded-2xl p-4 cursor-pointer transition shadow-md active:scale-[0.99] group relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition">
                          📁
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition">
                              프리미엄 보관함
                            </h4>
                            {savedPremiumReportList.length > 0 && (
                              <span className="text-[10.5px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                                구매한 리포트 {savedPremiumReportList.length}건
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            구매한 프리미엄 리포트를 다시 확인하세요.
                          </p>
                        </div>
                      </div>
                      <div className="text-cyan-400 font-bold text-xs shrink-0 flex items-center gap-1 group-hover:translate-x-1 transition">
                        <span>바로가기</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. PREMIUM 상품 3종 카드 목록 (기존 유지) */}
                  <div className="space-y-4">
                    {/* === 상품 1: 💎 PREMIUM 궁합 분석 (궁합 전용) === */}
                    <div className="bg-[#121c33] border border-pink-400/35 hover:border-pink-300/60 rounded-2xl p-4.5 space-y-3.5 transition shadow-md relative overflow-hidden">
                      {/* 상단 뱃지 & 상품명 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-400/30">
                            궁합 전용
                          </span>
                          <span className="text-[11.5px] font-semibold text-pink-300 bg-[#161224] px-2 py-0.5 rounded-md border border-pink-500/30">
                            📄 A4 약 10장 분량
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                          <span className="text-pink-300">💎</span>
                          <span>PREMIUM 궁합 분석</span>
                        </h4>
                      </div>

                      {/* AI 분석 등급 */}
                      <div className="bg-[#0d1627] rounded-xl p-2.5 border border-pink-500/20 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">AI 분석 등급</span>
                        <span className="text-xs font-bold text-pink-300 flex items-center gap-1">
                          <span>⚡</span>
                          <span>고급 AI 기반 궁합 분석</span>
                        </span>
                      </div>

                      {/* 핵심 분석 내용 */}
                      <div className="space-y-2 text-xs">
                        <p className="text-gray-300 leading-relaxed">
                          두 사람의 오행·십성·충합 등을 기반으로 성향과 관계의 흐름을 심층적으로 분석하는 프리미엄 궁합 서비스입니다.
                        </p>
                        <div className="bg-[#0a101d]/70 rounded-xl p-2.5 border border-pink-500/20 space-y-1.5 text-gray-200">
                          <div className="flex items-center gap-1.5 text-pink-300 font-medium">
                            <span>🔹</span>
                            <span>성향·오행·십성·충합·관계 흐름 분석</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-pink-300/80 font-medium pt-0.5">
                          ※ 이 상품은 2인 사주 기반 궁합 전용 분석 상품입니다. (개인 사주총운 제외)
                        </p>
                      </div>

                      {/* 가격 및 구매하기 버튼 */}
                      <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] text-gray-400 block">이용 금액</span>
                          <span className="text-lg font-black text-pink-300">6,900원</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPremiumProduct({
                            name: '💎 PREMIUM 궁합 분석',
                            grade: '고급 AI 기반 궁합 분석',
                            pages: 'A4 약 10장 분량',
                            desc: '두 사람의 오행·십성·충합 등을 기반으로 성향과 관계의 흐름을 심층적으로 분석하는 프리미엄 궁합 서비스입니다.',
                            highlights: ['성향·오행·십성·충합·관계 흐름 분석'],
                            price: '6,900원',
                            badge: '궁합 전용',
                            isGunghap: true
                          })}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-400 to-pink-300 hover:from-pink-300 hover:to-pink-200 text-black font-extrabold text-xs transition cursor-pointer shadow-lg shadow-pink-500/20 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <span>구매하기</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </div>

                    {/* === 상품 2: 💎 PREMIUM 고급 사주총운 (개인 종합) === */}
                    <div className="bg-[#121c33] border border-amber-500/50 hover:border-amber-400/80 rounded-2xl p-4.5 space-y-3.5 transition shadow-md relative overflow-hidden">
                      {/* 상단 뱃지 & 상품명 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              고급 사주총운
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-sm">
                              인기 추천
                            </span>
                          </div>
                          <span className="text-[11.5px] font-semibold text-amber-300 bg-[#0c1424] px-2 py-0.5 rounded-md border border-amber-800/60">
                            📄 A4 약 16장 분량
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                          <span className="text-amber-400">💎</span>
                          <span>PREMIUM 고급 사주총운</span>
                        </h4>
                      </div>

                      {/* AI 분석 등급 */}
                      <div className="bg-[#0d1627] rounded-xl p-2.5 border border-gray-800/90 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">AI 분석 등급</span>
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <span>⚡</span>
                          <span>고급 AI 기반 심층 분석</span>
                        </span>
                      </div>

                      {/* 핵심 분석 내용 */}
                      <div className="space-y-2 text-xs">
                        <p className="text-gray-300 leading-relaxed">
                          개인의 사주를 기반으로 성격, 재물, 직업, 애정, 대운 등 인생 전반을 종합적으로 분석합니다.
                        </p>
                        <div className="bg-[#0a101d]/70 rounded-xl p-2.5 border border-gray-800 space-y-1.5 text-gray-200">
                          <div className="flex items-center gap-1.5 text-amber-300 font-medium">
                            <span>🔹</span>
                            <span>성격·재물·직업·애정·대운 종합 분석</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-amber-400/90 font-medium pt-0.5">
                          ※ 1인 사주의 인생 전반을 조망하는 종합 총운 보고서입니다.
                        </p>
                      </div>

                      {/* 가격 및 구매하기 버튼 */}
                      <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] text-gray-400 block">이용 금액</span>
                          <span className="text-lg font-black text-amber-300">9,900원</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPremiumProduct({
                            name: '💎 PREMIUM 고급 사주총운',
                            grade: '고급 AI 기반 심층 분석',
                            pages: 'A4 약 16장 분량',
                            desc: '개인의 사주를 기반으로 성격, 재물, 직업, 애정, 대운 등 인생 전반을 종합적으로 분석합니다.',
                            highlights: ['성격·재물·직업·애정·대운 종합 분석'],
                            price: '9,900원',
                            badge: '고급 사주총운',
                            isGunghap: false
                          })}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold text-xs transition cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <span>구매하기</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </div>

                    {/* === 상품 3: 💎 PREMIUM 심층 사주총운 (최고급 플래그십) === */}
                    <div className="bg-[#121c33] border border-purple-500/50 hover:border-purple-400/80 rounded-2xl p-4.5 space-y-3.5 transition shadow-md relative overflow-hidden">
                      {/* 상단 뱃지 & 상품명 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                              최고급 심층 사주총운
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-sm">
                              플래그십
                            </span>
                          </div>
                          <span className="text-[11.5px] font-semibold text-purple-300 bg-[#0c1424] px-2 py-0.5 rounded-md border border-purple-800/60">
                            📄 A4 약 32장 분량
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-white flex items-center gap-1.5">
                          <span className="text-purple-400">💎</span>
                          <span>PREMIUM 심층 사주총운</span>
                        </h4>
                      </div>

                      {/* AI 분석 등급 */}
                      <div className="bg-[#0d1627] rounded-xl p-2.5 border border-gray-800/90 flex items-center justify-between">
                        <span className="text-xs text-gray-400 font-medium">AI 분석 등급</span>
                        <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                          <span>🌟</span>
                          <span>플래그십 AI 기반 심층 분석</span>
                        </span>
                      </div>

                      {/* 핵심 분석 내용 */}
                      <div className="space-y-2 text-xs">
                        <p className="text-gray-300 leading-relaxed">
                          상위 프리미엄 상품으로, 사주팔자의 구조와 대운·세운 및 인생의 주요 시기를 더욱 깊이 분석합니다.
                        </p>
                        <div className="bg-[#0a101d]/70 rounded-xl p-2.5 border border-gray-800 space-y-1 text-gray-200">
                          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                            <span>🔹</span>
                            <span>사주팔자 심층 분석</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                            <span>🔹</span>
                            <span>대운·세운 및 중요 시기별 분석</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                            <span>🔹</span>
                            <span>인생의 주요 전환점 분석</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-purple-300 font-medium">
                            <span>🔹</span>
                            <span>주의해야 할 시기 및 행동 방향</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-purple-400/90 font-medium pt-0.5">
                          ※ 1인 사주의 대운·세운 및 인생 전환점을 총망라한 최고급 심층 보고서입니다.
                        </p>
                      </div>

                      {/* 가격 및 구매하기 버튼 */}
                      <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] text-gray-400 block">이용 금액</span>
                          <span className="text-lg font-black text-purple-300">18,900원</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPremiumProduct({
                            name: '💎 PREMIUM 심층 사주총운',
                            grade: '플래그십 AI 기반 심층 분석',
                            pages: 'A4 약 32장 분량',
                            desc: '상위 프리미엄 상품으로, 사주팔자의 구조와 대운·세운 및 인생의 주요 시기를 더욱 깊이 분석합니다.',
                            highlights: [
                              '사주팔자 심층 분석',
                              '대운·세운 및 중요 시기별 분석',
                              '인생의 주요 전환점 분석',
                              '주의해야 할 시기 및 행동 방향'
                            ],
                            price: '18,900원',
                            badge: '최고급 심층 사주총운',
                            isGunghap: false
                          })}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-extrabold text-xs transition cursor-pointer shadow-lg shadow-purple-500/20 active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          <span>구매하기</span>
                          <span>➔</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 하단 안내 카드 */}
                  <div className="bg-[#0f172a]/60 border border-gray-800/70 rounded-xl p-3.5 text-center">
                    <p className="text-xs text-gray-400 leading-relaxed">
                      ✨ 프리미엄 상품 구매 시 정밀 AI 분석 보고서가 보관함에 1년간 안전하게 저장됩니다.
                    </p>
                  </div>
                </div>
              )}

              {/* 프리미엄 구매 프로세스 사전 안내 모달 */}
              {selectedPremiumProduct && (
                <div
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn"
                  onClick={() => setSelectedPremiumProduct(null)}
                >
                  <div
                    className="bg-[#131d33] border border-cyan-500/50 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 relative text-left"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💎</span>
                        <h3 className="text-sm font-extrabold text-white">프리미엄 구매 안내</h3>
                      </div>
                      <button
                        onClick={() => setSelectedPremiumProduct(null)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {/* 선택한 상품 요약 */}
                    <div className="bg-[#0d1627] rounded-xl p-3.5 border border-gray-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-300">{selectedPremiumProduct.badge}</span>
                        <span className="text-xs font-bold text-white bg-gray-800 px-2 py-0.5 rounded">{selectedPremiumProduct.pages}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{selectedPremiumProduct.name}</h4>
                      <div className="text-xs text-gray-400">
                        엔진: <span className="text-gray-200 font-semibold">{selectedPremiumProduct.grade}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between">
                        <span className="text-xs text-gray-400">결제 금액</span>
                        <span className="text-base font-black text-cyan-300">{selectedPremiumProduct.price}</span>
                      </div>
                    </div>

                    {/* 향후 결제 흐름 안내 */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-gray-400 block">구매 진행 단계 안내</span>
                      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                        <div className="bg-[#0a101d] rounded-lg p-2 border border-cyan-500/40 text-cyan-300">
                          1. 상품 선택 (완료)
                        </div>
                        <div className="bg-[#0a101d] rounded-lg p-2 border border-gray-800 text-gray-400">
                          2. 대상 사주 선택
                        </div>
                        <div className="bg-[#0a101d] rounded-lg p-2 border border-gray-800 text-gray-400">
                          3. 구매 확인 & 결제
                        </div>
                        <div className="bg-[#0a101d] rounded-lg p-2 border border-gray-800 text-gray-400">
                          4. 심층 감명 발급
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      ※ 구매 완료된 리포트는 「프리미엄 보관함」에서 언제든지 다시 확인 및 다운로드하실 수 있습니다.
                    </p>

                    <div className="pt-2 border-t border-gray-800">
                      <button
                        type="button"
                        onClick={() => setSelectedPremiumProduct(null)}
                        className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs transition cursor-pointer shadow-md active:scale-95"
                      >
                        확인
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 프리미엄 리포트 개별 삭제 확인 모달 */}
              {reportToDelete && (
                <div
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn"
                  onClick={() => setReportToDelete(null)}
                >
                  <div
                    className="bg-[#131d33] border border-red-500/40 rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-3.5 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-11 h-11 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center mx-auto text-xl">
                      🗑️
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-white">리포트를 삭제할까요?</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        삭제 후에는 다시 확인할 수 없습니다.
                      </p>
                    </div>
                    <div className="bg-[#0c1424] rounded-xl p-2.5 border border-gray-800 text-xs text-gray-300">
                      <div className="font-bold text-white">{reportToDelete.productName}</div>
                      <div className="text-gray-400 text-[11px]">
                        {reportToDelete.targetName} {reportToDelete.isGunghap && reportToDelete.partnerName ? `× ${reportToDelete.partnerName}` : ''}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setReportToDelete(null)}
                        className="py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs transition cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSavedPremiumReportList(prev => prev.filter(r => r.id !== reportToDelete.id));
                          setReportToDelete(null);
                        }}
                        className="py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition cursor-pointer shadow-md shadow-red-900/40"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 프리미엄 리포트 다시보기 풀스크린 모달 */}
              {activeViewingReport && (
                <div
                  className="fixed inset-0 bg-[#080d1a] z-[99999] flex flex-col animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 상단 헤더 */}
                  <div className="px-4 py-3.5 bg-[#101b2f] border-b border-gray-800 flex items-center justify-between shrink-0 shadow-md">
                    <button
                      type="button"
                      onClick={() => setActiveViewingReport(null)}
                      className="p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      <span>닫기</span>
                    </button>
                    <div className="text-center">
                      <h3 className="text-xs font-bold text-cyan-300">{activeViewingReport.productName}</h3>
                      <p className="text-[11px] text-gray-400">{activeViewingReport.targetName} {activeViewingReport.isGunghap && activeViewingReport.partnerName ? `× ${activeViewingReport.partnerName}` : ''}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => downloadPremiumReportPdf(activeViewingReport)}
                      className="px-2.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs transition cursor-pointer shadow-sm"
                    >
                      PDF 출력
                    </button>
                  </div>

                  {/* 리포트 본문 내용 */}
                  <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 text-white no-scrollbar max-w-xl mx-auto w-full">
                    <div className="bg-[#121c33] border border-cyan-500/40 rounded-2xl p-4.5 space-y-3 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                          {activeViewingReport.aiGrade}
                        </span>
                        <span className="text-xs text-gray-400">{activeViewingReport.pages}</span>
                      </div>
                      <h2 className="text-base font-black text-white">{activeViewingReport.productName}</h2>
                      <div className="text-xs text-gray-300 bg-[#0c1424] p-3 rounded-xl border border-gray-800 space-y-1">
                        <div><strong className="text-gray-400 font-semibold">대상:</strong> {activeViewingReport.targetName} {activeViewingReport.isGunghap && activeViewingReport.partnerName ? `× ${activeViewingReport.partnerName}` : ''}</div>
                        <div><strong className="text-gray-400 font-semibold">구매일:</strong> {activeViewingReport.purchasedAt} (보관 만료: {activeViewingReport.expiresAt})</div>
                      </div>
                    </div>

                    <div className="bg-[#101b2f] border border-gray-800 rounded-2xl p-4.5 space-y-2">
                      <h4 className="text-xs font-bold text-cyan-300 border-b border-gray-800 pb-2">1. 프리미엄 종합 감명 총평</h4>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                        {activeViewingReport.summary || '명리학적 정밀 원국과 운의 상호작용을 심층 분석한 종합 리포트입니다.'}
                      </p>
                    </div>

                    <div className="bg-[#101b2f] border border-gray-800 rounded-2xl p-4.5 space-y-2">
                      <h4 className="text-xs font-bold text-cyan-300 border-b border-gray-800 pb-2">2. 정밀 분석 상세 내역</h4>
                      <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                        {activeViewingReport.reportContent || '사주 원국과 십성, 오행의 강약, 대운의 흐름 및 전환점 분석 내용이 수록되어 있습니다.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 하단 고정 네비게이션 */}
              <div
                className="fixed bottom-0 left-0 right-0 w-full max-w-[412px] mx-auto bg-[#0b1120] opacity-100 border-t border-gray-700/80 px-2 pt-2.5 grid grid-cols-5 items-center z-[9999] shadow-[0_-4px_20px_rgba(0,0,0,0.8)]"
                style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
              >
                <button
                  onClick={() => { setActiveTab('saju'); setViewMode('input'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer min-w-0 py-1"
                >
                  <div>
                    <span className="text-xl leading-none">🔮</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">
                    정보입력
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('storage')}
                  className="flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer min-w-0 py-1"
                >
                  <div>
                    <span className="text-xl leading-none">📇</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">보관함</span>
                </button>
                <button
                  onClick={() => { setActiveTab('gunghap'); setGunghapSubTab('wonguk'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-rose-400 hover:text-rose-300 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_6px_rgba(251,113,133,0.5)] transform group-hover:scale-110 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-rose-300 whitespace-nowrap">궁합</span>
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className="flex flex-col items-center justify-center gap-1.5 text-cyan-400 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] transform scale-105 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 2L3 8l9 13L21 8l-3-6H6z" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M3 8h18M6 2l3 6M18 2l-3 6M9 8l3 13 3-13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-cyan-400 whitespace-nowrap">프리미엄</span>
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setViewMode('input'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer min-w-0 py-1"
                >
                  <div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">설정</span>
                </button>
              </div>
            </div>
          ) : (
            <>
          {viewMode === 'input' && (
            <div id="view-input" className="flex flex-col h-full">
              {/* 상단 헤더 */}
              <div className="px-5 py-4 border-b border-gray-800/80 flex justify-between items-center text-center">
                <button onClick={() => setViewMode('landing')} className="text-xs text-gray-400 hover:text-gold transition">
                  ← 홈으로
                </button>
                <h1 className="text-sm font-bold text-white tracking-wide pr-8">사주 분석</h1>
                <div></div>
              </div>

              {/* 메인 스크롤 영역 */}
              <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28 space-y-5 no-scrollbar">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">사주 정보 입력</h2>
                  <p className="text-xs text-gray-400">정확한 만세력 분석을 위해 정보를 입력해주세요.</p>
                </div>

                <div className="bg-card border border-gray-800 rounded-2xl p-4 space-y-4 shadow-lg relative">
                  {/* 이름 */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-300">이름 또는 닉네임</label>
                    <input
                      type="text"
                      id="input-name"
                      value={name}
                      maxLength={8}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="이름 입력 (최대 8자)"
                      className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition"
                    />
                  </div>

                  {/* 성별 */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-gray-300">성별</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="btn-male"
                        onClick={() => setGender('male')}
                        className={`py-2.5 rounded-xl text-xs font-bold transition ${
                          selectedGender === 'male'
                            ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                            : 'bg-navy border border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        남성
                      </button>
                      <button
                        type="button"
                        id="btn-female"
                        onClick={() => setGender('female')}
                        className={`py-2.5 rounded-xl text-xs font-bold transition ${
                          selectedGender === 'female'
                            ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                            : 'bg-navy border border-gray-700 text-gray-400 hover:border-gray-500'
                        }`}
                      >
                        여성
                      </button>
                    </div>
                  </div>

                  {/* 생년월일 */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-medium text-gray-300">생년월일</label>
                      <span className="text-[10px] text-gray-400 font-normal">(1900년 ~ 2050년 가능)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          id="input-year"
                          min="1900"
                          max="2050"
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            if (isYearError) setIsYearError(false);
                            if (yearErrorMsg) setYearErrorMsg(null);
                          }}
                          onBlur={() => {
                            const y = parseInt(year, 10);
                            if (year && (isNaN(y) || y < 1900 || y > 2050)) {
                              setIsYearError(true);
                              setYearErrorMsg('지원하지 않는 연도입니다. (1900~2050년 사이만 입력 가능합니다)');
                            } else if (year) {
                              setIsYearError(false);
                            }
                          }}
                          placeholder="YYYY"
                          className={`w-full bg-navy border ${
                            isYearError
                              ? 'border-red-500 focus:border-red-400'
                              : 'border-gray-700 focus:border-gold'
                          } rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none transition`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">년</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          id="input-month"
                          value={month}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setMonth('');
                              return;
                            }
                            if (!/^\d+$/.test(val)) return;
                            if (val.length > 2) return;
                            if (val === '0') {
                              setMonth('0');
                              return;
                            }
                            const num = parseInt(val, 10);
                            if (!isNaN(num) && num >= 1 && num <= 12) {
                              setMonth(val);
                            }
                          }}
                          placeholder="MM"
                          className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">월</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          inputMode="numeric"
                          id="input-day"
                          value={day}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setDay('');
                              return;
                            }
                            if (!/^\d+$/.test(val)) return;
                            if (val.length > 2) return;
                            if (val === '0') {
                              setDay('0');
                              return;
                            }
                            const num = parseInt(val, 10);
                            if (!isNaN(num) && num >= 1 && num <= 31) {
                              setDay(val);
                            }
                          }}
                          placeholder="DD"
                          className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">일</span>
                      </div>
                    </div>
                  </div>

                  {/* 역법 및 시간 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-medium text-gray-300">태어난 시간</label>
                      <button
                        type="button"
                        onClick={toggleHelpModal}
                        className="flex items-center gap-1.5 text-[10px] text-gold/90 hover:text-gold transition cursor-pointer"
                      >
                        <span>표준시 및 진태양시 자동 보정</span>
                        <span className="w-3.5 h-3.5 rounded-full border border-gold/60 flex items-center justify-center font-bold text-[9px] ml-0.5">?</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        id="input-calendar"
                        value={calendar}
                        onChange={(e) => setCalendar(e.target.value)}
                        className="bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition cursor-pointer"
                      >
                        <option>양력</option>
                        <option>음력 (평달)</option>
                        <option>음력 (윤달)</option>
                      </select>
                      <select
                        id="input-time"
                        value={birthTime}
                        disabled={isUnknownTime}
                        onChange={(e) => setBirthTime(e.target.value)}
                        className={`bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition cursor-pointer ${
                          isUnknownTime ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        {isUnknownTime ? (
                          <option>시간 미지정 (시간 모름)</option>
                        ) : (
                          <>
                            <option>자시 (23:30 ~ 01:30)</option>
                            <option>축시 (01:30 ~ 03:30)</option>
                            <option>인시 (03:30 ~ 05:30)</option>
                            <option>묘시 (05:30 ~ 07:30)</option>
                            <option>진시 (07:30 ~ 09:30)</option>
                            <option>사시 (09:30 ~ 11:30)</option>
                            <option>오시 (11:30 ~ 13:30)</option>
                            <option>미시 (13:30 ~ 15:30)</option>
                            <option>신시 (15:30 ~ 17:30)</option>
                            <option>유시 (17:30 ~ 19:30)</option>
                            <option>술시 (19:30 ~ 21:30)</option>
                            <option>해시 (21:30 ~ 23:30)</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* 태어난 시간 옵션 체크박스 2개 */}
                    <div className="pt-2.5 space-y-2 border-t border-gray-800/80 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          id="chk-unknown-time"
                          checked={isUnknownTime}
                          onChange={(e) => {
                            setIsUnknownTime(e.target.checked);
                            if (e.target.checked) setUseYajasi(false);
                          }}
                          className="w-4 h-4 rounded border-gray-700 bg-navy text-gold focus:ring-gold focus:ring-offset-gray-900 accent-[#D4AF37] cursor-pointer"
                        />
                        <span className="text-xs text-gray-300 group-hover:text-white transition">
                          태어난 시간 모름 <span className="text-gray-400 text-[11px]">(시간 제외후 분석)</span>
                        </span>
                      </label>

                      <div className="pt-0.5">
                        {(() => {
                          const isJasiSelect = !isUnknownTime && birthTime.startsWith('자시');
                          return (
                            <label className="flex items-center gap-2 cursor-pointer select-none group">
                              <input
                                type="checkbox"
                                id="chk-yajasi"
                                checked={useYajasi && isJasiSelect}
                                disabled={isUnknownTime || !isJasiSelect}
                                onChange={(e) => setUseYajasi(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-700 bg-navy text-gold focus:ring-gold focus:ring-offset-gray-900 accent-[#D4AF37] disabled:opacity-40 cursor-pointer"
                              />
                              <span className={`text-xs transition ${isUnknownTime || !isJasiSelect ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'}`}>
                                야자시 사용 <span className={`${isUnknownTime || !isJasiSelect ? 'text-gray-600' : 'text-gray-400'} text-[11px]`}>(밤 23:00 이후 적용)</span>
                              </span>
                            </label>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 확인 버튼 */}
                <button
                  onClick={submitSajuForm}
                  className="w-full bg-gold text-black font-bold py-3.5 rounded-xl text-xs shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:brightness-110 transition active:scale-[0.98]"
                >
                  내 만세력 확인하기 →
                </button>
              </div>
            </div>
          )}

          {/* 로딩 분석 상태 */}
          {viewMode === 'analyzing' && (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-8 my-auto p-6">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-gold/30 animate-ping"></div>
                <div className="w-24 h-24 rounded-3xl bg-card border-2 border-gold flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.35)] animate-pulse">
                  <svg className="w-12 h-12 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M6 3H18L21 8L12 21L3 8L6 3Z" fill="currentColor" fillOpacity="0.25"/>
                    <path d="M6 3H18M3 8H21M9 3L12 21L15 3" stroke="currentColor" strokeWidth="1.2"/>
                  </svg>
                </div>
              </div>

              <div className="max-w-[380px] w-full space-y-2.5 px-2">
                <p className="text-lg sm:text-xl font-bold text-gold animate-pulse tracking-wide leading-relaxed whitespace-nowrap">
                  루멘 AI가 사주를 정밀 분석중..
                </p>
                <p className="text-xs sm:text-xs text-amber-100/90 font-medium tracking-tight whitespace-nowrap">
                  십성을 바탕으로 사주원국을 정밀하게 분석하고 있습니다
                </p>
              </div>
            </div>
          )}

          {/* 화면 2: 결과 뷰 */}
          {viewMode === 'result' && (
            <div id="view-result" className="flex flex-col h-full">
              
              {/* 사주작용력 (형충관계) 필터 모드일 때 (사용자 원국 맞춤형 아코디언 UI 적용) */}
              {activeFilter === 'action' ? (
                (() => {
                  const detectedInteractions = detectSajuWonGukInteractions({
                    hourPillar,
                    dayPillar,
                    monthPillar,
                    yearPillar,
                    isUnknownTime: unknownTime,
                  });

                  const allIds = detectedInteractions.map(item => item.id);

                  return (
                    <>
                      {/* 상단 헤더 */}
                      <div className="px-5 pt-4 pb-2.5 flex justify-between items-center border-b border-gray-800/80">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h1 className="text-base font-bold text-white tracking-wide">{name || '김지훈'} 님</h1>
                          </div>
                          <p className="text-[11px] text-gray-400">
                            {displayYear}.{formattedMonth}.{formattedDay} ({calTypeStr}) {timeInfoStr} · {genderStr}
                          </p>
                        </div>
                        <button
                          onClick={goBackToInput}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 active:scale-95 text-xs font-semibold shadow-sm transition cursor-pointer shrink-0"
                        >
                          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>정보다시입력</span>
                        </button>
                      </div>

                      {/* 메인 스크롤 영역 */}
                      <div className="flex-1 overflow-y-auto px-4 pt-2.5 pb-28 space-y-3 no-scrollbar">
                        {/* 0. 사주 원국 요약 미니 카드 */}
                        <div className="bg-card border border-gray-800 rounded-xl p-2.5 shadow-md space-y-2">
                          <div className="flex items-center px-0.5">
                            <span className="font-bold text-gold text-xs flex items-center gap-1.5">
                              <span className="w-1.5 h-3 bg-gold rounded-full inline-block"></span>
                              사주 원국 요약
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-center border-collapse">
                              <thead>
                                <tr className="bg-navy/80 text-xs border-b border-gray-800/80">
                                  <th className="py-1.5 px-1 font-semibold text-gray-400 text-[11px] w-12">구분</th>
                                  <th className="py-1.5 px-1 font-semibold text-gray-200 text-xs">시주</th>
                                  <th className="py-1.5 px-1 font-semibold text-gold text-xs bg-gold/5">일주</th>
                                  <th className="py-1.5 px-1 font-semibold text-gray-200 text-xs">월주</th>
                                  <th className="py-1.5 px-1 font-semibold text-gray-200 text-xs">년주</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-800/50 text-xs">
                                {/* 천간 Row */}
                                <tr>
                                  <td className="py-2 text-[11px] font-medium text-gray-400 bg-navy/40">천간</td>
                                  <td className="py-2">
                                    {unknownTime ? (
                                      <span className="text-gray-500 text-[11px]">-</span>
                                    ) : (
                                      <div>
                                        <span className={`text-sm font-bold ${getElementTextColor(hourPillar.elementStem)}`}>
                                          {hourPillar.stemHanja}({hourPillar.stem})
                                        </span>
                                        <span className="block text-[10.5px] text-gray-400 mt-0.5">
                                          {hourPillar.tenGodStem || '일원'}
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-2 bg-gold/5">
                                    <div>
                                      <span className={`text-sm font-extrabold ${getElementTextColor(dayPillar.elementStem)}`}>
                                        {dayPillar.stemHanja}({dayPillar.stem})
                                      </span>
                                      <span className="block text-[10.5px] text-gold font-medium mt-0.5">
                                        {dayPillar.tenGodStem || '비견'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    <div>
                                      <span className={`text-sm font-bold ${getElementTextColor(monthPillar.elementStem)}`}>
                                        {monthPillar.stemHanja}({monthPillar.stem})
                                      </span>
                                      <span className="block text-[10.5px] text-gray-400 mt-0.5">
                                        {monthPillar.tenGodStem}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    <div>
                                      <span className={`text-sm font-bold ${getElementTextColor(yearPillar.elementStem)}`}>
                                        {yearPillar.stemHanja}({yearPillar.stem})
                                      </span>
                                      <span className="block text-[10.5px] text-gray-400 mt-0.5">
                                        {yearPillar.tenGodStem}
                                      </span>
                                    </div>
                                  </td>
                                </tr>

                                {/* 지지 Row */}
                                <tr>
                                  <td className="py-2 text-[11px] font-medium text-gray-400 bg-navy/40">지지</td>
                                  <td className="py-2">
                                    {unknownTime ? (
                                      <span className="text-gray-500 text-[11px]">-</span>
                                    ) : (
                                      <div>
                                        <span className={`text-sm font-bold ${getElementTextColor(hourPillar.elementBranch)}`}>
                                          {hourPillar.branchHanja}({hourPillar.branch})
                                        </span>
                                        <span className="block text-[10.5px] text-gray-400 mt-0.5">
                                          {hourPillar.tenGodBranch}
                                        </span>
                                      </div>
                                    )}
                                  </td>
                                  <td className="py-2 bg-gold/5">
                                    <div>
                                      <span className={`text-sm font-extrabold ${getElementTextColor(dayPillar.elementBranch)}`}>
                                        {dayPillar.branchHanja}({dayPillar.branch})
                                      </span>
                                      <span className="block text-[10.5px] text-gold font-medium mt-0.5">
                                        {dayPillar.tenGodBranch}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    <div>
                                      <span className={`text-sm font-bold ${getElementTextColor(monthPillar.elementBranch)}`}>
                                        {monthPillar.branchHanja}({monthPillar.branch})
                                      </span>
                                      <span className="block text-[10.5px] text-gray-400 mt-0.5">
                                        {monthPillar.tenGodBranch}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-2">
                                    <div>
                                      <span className={`text-sm font-bold ${getElementTextColor(yearPillar.elementBranch)}`}>
                                        {yearPillar.branchHanja}({yearPillar.branch})
                                      </span>
                                      <span className="block text-[10.5px] text-gray-400 mt-0.5">
                                        {yearPillar.tenGodBranch}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* 1. 필터 칩 ('사주작용력' 활성화 상태) */}
                        <div className="grid grid-cols-4 gap-2 w-full mt-1 mb-4.5">
                          <button
                            onClick={() => setActiveFilter('all')}
                            className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                          >
                            종합 분석
                          </button>
                          <button className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)] cursor-pointer text-center flex items-center justify-center whitespace-nowrap">
                            사주작용력
                          </button>
                          <button
                            onClick={() => setActiveFilter('wuxing')}
                            className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                          >
                            오행 분포
                          </button>
                          <button
                            onClick={() => setActiveFilter('daewoon')}
                            className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                          >
                            대운 흐름
                          </button>
                        </div>


                        {/* 4. 개별 상세 풀이 아코디언 리스트 섹션 */}
                        <div className="space-y-3 pb-2">
                          {detectedInteractions.length > 0 ? (
                            (() => {
                              const CATEGORY_META: Record<string, {
                                kor: string;
                                hanja: string;
                                desc: string;
                                borderColor: string;
                                bgColor: string;
                                textColor: string;
                              }> = {
                                chung: {
                                  kor: '충',
                                  hanja: '沖',
                                  desc: '서로 대립하여 정체된 흐름을 깨뜨리고 변화를 일으키는 개혁 에너지입니다. 빠른 환경 적응력과 과감한 결단력에 강점이 있습니다.',
                                  borderColor: 'border-red-500/40',
                                  bgColor: 'bg-red-500/10',
                                  textColor: 'text-red-400',
                                },
                                hap: {
                                  kor: '합',
                                  hanja: '合',
                                  desc: '서로 끌어당겨 조화를 이루는 연대 에너지입니다. 친밀감 형성과 협상 능력, 유연한 커뮤니케이션에 강점이 있습니다.',
                                  borderColor: 'border-blue-500/40',
                                  bgColor: 'bg-blue-500/10',
                                  textColor: 'text-blue-400',
                                },
                                hyeong: {
                                  kor: '형',
                                  hanja: '刑',
                                  desc: '불필요한 요소를 다듬어 완성도를 높이는 전문 조율 에너지입니다. 정밀한 사리분별과 완벽주의적 검증 능력에 강점이 있습니다.',
                                  borderColor: 'border-amber-500/40',
                                  bgColor: 'bg-amber-500/10',
                                  textColor: 'text-amber-400',
                                },
                                pa: {
                                  kor: '파',
                                  hanja: '破',
                                  desc: '고착된 틀을 깨고 시스템을 새롭게 개편하는 쇄신 에너지입니다. 트렌드 변화 대응과 프로세스 혁신 역량에 강점이 있습니다.',
                                  borderColor: 'border-purple-500/40',
                                  bgColor: 'bg-purple-500/10',
                                  textColor: 'text-purple-400',
                                },
                                hae: {
                                  kor: '해',
                                  hanja: '害',
                                  desc: '허점과 위험 요소를 선제 파악하는 리스크 관리 에너지입니다. 미세한 오차를 잡아내는 세심한 모니터링 검증 능력에 강점이 있습니다.',
                                  borderColor: 'border-orange-500/40',
                                  bgColor: 'bg-orange-500/10',
                                  textColor: 'text-orange-400',
                                },
                                wonjin: {
                                  kor: '원진',
                                  hanja: '怨嗔',
                                  desc: '사물의 본질과 상대의 이면을 단번에 읽어내는 직관 에너지입니다. 남다른 영감과 예리한 감성, 심리 통찰 능력에 강점이 있습니다.',
                                  borderColor: 'border-cyan-500/40',
                                  bgColor: 'bg-cyan-500/10',
                                  textColor: 'text-cyan-400',
                                },
                              };

                              const categoriesOrder: ('chung' | 'hap' | 'hyeong' | 'pa' | 'hae' | 'wonjin')[] = ['chung', 'hap', 'hyeong', 'pa', 'hae', 'wonjin'];
                              const grouped = categoriesOrder
                                .map(catKey => ({
                                  category: catKey,
                                  meta: CATEGORY_META[catKey],
                                  items: detectedInteractions.filter(item => item.category === catKey)
                                }))
                                .filter(group => group.items.length > 0);

                              const allCatKeys = grouped.map(g => g.category);

                              return (
                                <>
                                  <div className="flex items-center justify-between px-1 py-1">
                                    <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                                      <span className="w-1.5 h-3 bg-gold rounded-full inline-block"></span>
                                      원국 작용력 분석 (총 {detectedInteractions.length}개 성립)
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[10.5px]">
                                      <button
                                        onClick={() => toggleAllActionCards(allCatKeys, true)}
                                        className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition cursor-pointer"
                                      >
                                        전체 펼치기
                                      </button>
                                      <button
                                        onClick={() => toggleAllActionCards(allCatKeys, false)}
                                        className="px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition cursor-pointer"
                                      >
                                        전체 접기
                                      </button>
                                    </div>
                                  </div>

                                  {grouped.map(group => {
                                    const isExpanded = !!openActionCardIds[group.category];

                                    return (
                                      <div
                                        key={group.category}
                                        className={`bg-card ${group.meta.borderColor} border rounded-xl overflow-hidden shadow-md transition-all`}
                                      >
                                        {/* 카테고리 아코디언 헤더 */}
                                        <button
                                          onClick={() => toggleActionCard(group.category)}
                                          className={`w-full p-3.5 ${group.meta.bgColor} flex justify-between items-center text-left hover:brightness-110 transition cursor-pointer select-none`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className={`text-xs sm:text-sm font-bold ${group.meta.textColor}`}>
                                              [ {group.meta.hanja} ({group.meta.kor}) ]
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-2 shrink-0 ml-2">
                                            <span className="text-[10px] text-gray-300 font-medium bg-navy/60 px-2 py-0.5 rounded border border-gray-800">
                                              {group.items.length}개 성립
                                            </span>
                                            <span className="text-xs font-bold text-gray-300 px-1">
                                              {isExpanded ? '▲' : '▼'}
                                            </span>
                                          </div>
                                        </button>

                                        {/* 펼쳐진 상태 (클릭 시 토글) */}
                                        {isExpanded && (
                                          <div className="p-3.5 space-y-2.5 border-t border-gray-800/80 bg-navy/30">
                                            {/* 상단 설명 단 1~2줄 */}
                                            <p className="text-xs text-gray-200 leading-relaxed font-normal">
                                              {group.meta.desc}
                                            </p>

                                            {/* 성립 조합 텍스트 리스트 */}
                                            <div className="pt-1 space-y-1.5">
                                              {group.items.map((item) => (
                                                <div
                                                  key={item.id}
                                                  className="text-xs text-gray-200 font-medium flex items-center gap-2 pl-1"
                                                >
                                                  <span className={`${group.meta.textColor} font-bold text-sm`}>•</span>
                                                  <span>{item.comboText || item.locationDesc}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </>
                              );
                            })()
                          ) : (
                            <div className="bg-card border border-emerald-500/40 rounded-xl p-5 text-center space-y-2.5 shadow-md">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 text-lg flex items-center justify-center mx-auto border border-emerald-500/40">
                                ✨
                              </div>
                              <h3 className="text-sm font-bold text-emerald-300">원국 충·형·파·해 마찰 무결점 사주</h3>
                              <p className="text-[11.5px] text-gray-300 leading-relaxed max-w-sm mx-auto">
                                {name || '김지훈'} 님의 사주 원국({unknownTime ? '년·월·일' : '년·월·일·시'})에는 극단적 충돌이나 왜곡을 일으키는 충, 형, 파, 해, 원진의 날카로운 작용력이 존재하지 않습니다.
                              </p>
                              <p className="text-[10.5px] text-gray-400">
                                {unknownTime ? '3주' : '4주'} 오행의 기운이 평온하고 순탄하게 이어져 마찰 없이 고유의 개성과 결실을 발휘할 수 있는 원만한 사주 구조입니다.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()
              ) : activeFilter === 'wuxing' ? (
                <>
                  {/* 상단 헤더 */}
                  <div className="px-5 pt-4 pb-2.5 flex justify-between items-center border-b border-gray-800/80">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h1 className="text-base font-bold text-white tracking-wide">{name || '김지훈'} 님</h1>
                        <span className="text-[11px] text-gold font-medium">오행 분포 상세 분석</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {displayYear}.{formattedMonth}.{formattedDay} ({calTypeStr}) {timeInfoStr} · {genderStr}
                      </p>
                    </div>
                    <button
                      onClick={goBackToInput}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 active:scale-95 text-xs font-semibold shadow-sm transition cursor-pointer shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>정보다시입력</span>
                    </button>
                  </div>

                  {/* 메인 스크롤 영역 */}
                  <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-3 no-scrollbar">
                    {/* 탭 메뉴 */}
                    <div className="grid grid-cols-4 gap-2 w-full mt-1 mb-4.5">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                      >
                        종합 분석
                      </button>
                      <button
                        onClick={() => setActiveFilter('action')}
                        className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                      >
                        사주작용력
                      </button>
                      <button className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)] cursor-pointer text-center flex items-center justify-center whitespace-nowrap">
                        오행 분포
                      </button>
                      <button
                        onClick={() => setActiveFilter('daewoon')}
                        className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                      >
                        대운 흐름
                      </button>
                    </div>
                    {/* 오행 밸런스 분석 3개 카드 */}
                    {/* 1. 오행 분포 카드 (아코디언) */}
                    <div className="bg-card border border-gray-800 rounded-xl overflow-hidden shadow">
                      <button
                        onClick={() => setWuxingElementOpen(!wuxingElementOpen)}
                        className="w-full p-4 flex justify-between items-center text-left focus:outline-none hover:bg-white/[0.02] transition cursor-pointer"
                      >
                        <span className="text-xs font-bold text-gold flex items-center gap-2">
                          <span className="w-1.5 h-3.5 rounded-full bg-gold inline-block"></span>
                          오행 밸런스 분석
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transform transition-transform duration-300 ${
                            wuxingElementOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>

                          {wuxingElementOpen && (
                            <div id="element-box" className="px-4 pb-4 space-y-3 border-t border-gray-800/65 pt-3">
                              <div className="bg-navy/60 border border-gray-800 rounded-lg p-3 space-y-2">
                                <div className="flex flex-col items-start gap-1.5 w-full">
                                  <span className="bg-gray-800 text-gray-200 border border-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded shrink-0">
                                    균형 분석
                                  </span>
                                  <h3 className="text-xs font-bold text-white leading-snug break-words w-full">
                                    {wuxingBalanceTitle}
                                  </h3>
                                </div>
                                <p className="text-[11px] text-gray-300 leading-relaxed break-words">
                                  {wuxingBalanceDesc}
                                </p>
                              </div>

                              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                                <span className="font-bold text-gray-200">오행 밸런스 차트</span>
                                <span>총 {totalCharCount}글자 기준</span>
                              </div>

                              {(['wood', 'fire', 'earth', 'metal', 'water'] as const).map((el) => {
                                const info = elementInfoMap[el];
                                const tenGodLabel = getTenGodGroupForElement(dayElement, el);
                                const count = elementCounts[el];
                                const pct = elementPercentages[el];

                                return (
                                  <div key={el} className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span className={`${info.colorClass} font-medium flex items-center gap-1.5`}>
                                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: info.bgHex }}></span>
                                        {info.kor} ({info.hanja}) - {tenGodLabel}
                                      </span>
                                      <span className="text-gray-300 font-semibold">{count}개 ({Math.round(pct)}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-900/80 h-2 rounded-full overflow-hidden border border-gray-800">
                                      <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${Math.round(pct)}%`, backgroundColor: info.bgHex, boxShadow: `0 0 6px ${info.bgHex}` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* 2. 신강신약 및 억부용신 카드 */}
                        <div className="bg-card border border-gray-800 rounded-xl overflow-hidden shadow">
                          <button
                            onClick={() => setWuxingPowerOpen(!wuxingPowerOpen)}
                            className="w-full p-4 flex justify-between items-center text-left focus:outline-none hover:bg-white/[0.02] transition cursor-pointer"
                          >
                            <span className="text-xs font-bold text-gold flex items-center gap-2">
                              <span className="w-1.5 h-3.5 rounded-full bg-gold inline-block"></span>
                              신강신약 분석
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`${shinBadgeBg} font-bold text-[11px] px-2.5 py-0.5 rounded-md shadow`}>
                                {shinBadgeText}
                              </span>
                              <svg
                                className={`w-4 h-4 text-gray-400 transform transition-transform duration-300 ${
                                  wuxingPowerOpen ? 'rotate-180' : 'rotate-0'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </button>
                          {wuxingPowerOpen && (
                            <div id="power-box" className="px-4 pb-4 space-y-3 border-t border-gray-800/60 pt-3">
                              <div className="space-y-1.5 bg-navy/60 p-3 rounded-lg border border-gray-800">
                                <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-400 font-medium px-0.5">
                                  <span className="text-blue-400">신약</span>
                                  <span className="text-sky-300">중화신약</span>
                                  <span className="text-amber-400 font-bold">중용(중화)</span>
                                  <span className="text-orange-400">중화신강</span>
                                  <span className="text-red-400">신강</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2.5 rounded-full relative p-0.5">
                                  <div className="bg-gradient-to-r from-blue-500 via-sky-400 via-amber-400 via-orange-400 to-red-500 h-full rounded-full w-full"></div>
                                  <div className="absolute top-0.5 bottom-0.5 w-2 bg-white rounded-full shadow-[0_0_6px_#fff] transition-all duration-300" style={{ left: shinIndicatorPos }}></div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {shinDescText}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 3. 조후용신 분석 카드 */}
                        <div className="bg-card border border-gray-800 rounded-xl overflow-hidden shadow">
                          <button
                            onClick={() => setWuxingSeasonOpen(!wuxingSeasonOpen)}
                            className="w-full p-4 flex justify-between items-center text-left focus:outline-none hover:bg-white/[0.02] transition cursor-pointer"
                          >
                            <span className="text-xs font-bold text-gold flex items-center gap-2">
                              <span className="w-1.5 h-3.5 rounded-full bg-gold inline-block"></span>
                              조후 분석
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`${johuBadgeBg} font-bold text-[11px] px-2.5 py-0.5 rounded-md shadow`}>
                                {johuBadgeText}
                              </span>
                              <svg
                                className={`w-4 h-4 text-gray-400 transform transition-transform duration-300 ${
                                  wuxingSeasonOpen ? 'rotate-180' : 'rotate-0'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </button>
                          {wuxingSeasonOpen && (
                            <div id="season-box" className="px-4 pb-4 space-y-3 border-t border-gray-800/60 pt-3">

                              <div className="space-y-1.5 bg-navy/60 p-3 rounded-lg border border-gray-800">
                                <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                                  <span className="text-blue-400">한랭 (추움)</span>
                                  <span className="text-cyan-300 font-bold">중용 (적정 기후)</span>
                                  <span className="text-red-400">조열 (더움)</span>
                                </div>
                                <div className="w-full bg-gray-800 h-2.5 rounded-full relative p-0.5">
                                  <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-red-500 h-full rounded-full w-full"></div>
                                  <div className="absolute top-0.5 bottom-0.5 w-2 bg-white rounded-full shadow-[0_0_6px_#fff]" style={{ left: johuIndicatorPos }}></div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="bg-navy/60 border border-gray-800 p-2.5 rounded-lg">
                                  <span className="text-[10px] text-gray-400 block mb-0.5">태어난 계절 기후</span>
                                  <span className="text-xs font-bold text-white">{johuSeasonTitle}</span>
                                </div>
                                <div className="bg-navy/60 border border-gray-800 p-2.5 rounded-lg">
                                  <span className="text-[10px] text-gray-400 block mb-0.5">필요한 조후 기운</span>
                                  <span className="text-xs font-bold text-gold">{johuNeededElement}</span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {johuDescText}
                              </p>
                            </div>
                          )}
                        </div>

                  </div>
                </>
              ) : activeFilter === 'daewoon' ? (
                <>
                  {/* 상단 헤더 */}
                  <div className="px-5 pt-4 pb-2.5 flex justify-between items-center border-b border-gray-800/80">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h1 className="text-base font-bold text-white tracking-wide">{name || '김지훈'} 님</h1>
                        <span className="text-[11px] text-gold font-medium">대운·세운 흐름 상세 분석</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {displayYear}.{formattedMonth}.{formattedDay} ({calTypeStr}) {timeInfoStr} · {genderStr}
                      </p>
                    </div>
                    <button
                      onClick={goBackToInput}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 active:scale-95 text-xs font-semibold shadow-sm transition cursor-pointer shrink-0"
                    >
                      <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>정보다시입력</span>
                    </button>
                  </div>

                  {/* 메인 스크롤 영역 */}
                  <div className="flex-1 overflow-y-auto px-4 pt-2.5 pb-28 space-y-3.5 no-scrollbar">
                    
                    {/* 1. 필터 칩 */}
                    <div className="grid grid-cols-4 gap-2 w-full mt-1 mb-4.5">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                      >
                        종합 분석
                      </button>
                      <button
                        onClick={() => setActiveFilter('action')}
                        className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                      >
                        사주작용력
                      </button>
                      <button
                        onClick={() => setActiveFilter('wuxing')}
                        className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap"
                      >
                        오행 분포
                      </button>
                      <button className="w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)] cursor-pointer text-center flex items-center justify-center whitespace-nowrap">
                        대운 흐름
                      </button>
                    </div>

                    {/* 2. 현재 대운 요약 인포박스 */}
                    <div className="bg-gradient-to-r from-amber-500/10 via-card to-cyan-500/10 border border-gold/30 rounded-xl p-3.5 shadow-lg">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="bg-gold/20 text-gold text-[10px] font-bold px-2 py-0.5 rounded border border-gold/40">현재 대운 (33세 ~ 42세)</span>
                        <span className="text-xs font-bold text-white">갑술(甲戌) 대운 진행 중</span>
                      </div>
                      <p className="text-[11px] text-gray-300 leading-relaxed">
                        사회적 성취와 활동 영역이 넓어지는 시기입니다. <span className="text-wood font-semibold">목(木)</span>과 <span class="text-earth font-semibold">토(土)</span>의 기운이 조화를 이루며 새로운 기회가 찾아옵니다.
                      </p>
                    </div>

                    {/* 3. 10년 주기 대운 타임라인 카드 */}
                    <div className="bg-card border border-gray-800 rounded-xl p-4 shadow-lg space-y-3 relative">
                      <div className="text-xs font-bold text-gold flex items-center justify-between">
                        <span>10년 주기 대운 흐름 (전체 평생 보기)</span>
                        <span className="text-[10px] text-gray-400 font-normal">순행 (대운수: 3)</span>
                      </div>

                      <div className="relative flex items-center">
                        <button
                          onClick={() => scrollDaeun(-1)}
                          className="absolute -left-3 z-10 bg-gray-900/80 hover:bg-gold hover:text-black text-gray-300 border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow transition cursor-pointer"
                        >
                          ‹
                        </button>
                        
                        {/* 드래그 스크롤 컨테이너 */}
                        <div
                          ref={daeunScrollRef}
                          onMouseDown={(e) => handleMouseDown(e, daeunScrollRef)}
                          onMouseMove={(e) => handleMouseMove(e, daeunScrollRef)}
                          onMouseUp={handleMouseUpOrLeave}
                          onMouseLeave={handleMouseUpOrLeave}
                          className="flex gap-1.5 overflow-x-auto no-scrollbar smooth-scroll w-full px-1 pt-1 pb-1 draggable-box"
                        >
                          {daeunCards.map((card, idx) => {
                            const isSelected = selectedDaeunIdx === idx;
                            return (
                              <div
                                key={idx}
                                onClick={() => setSelectedDaeunIdx(idx)}
                                className={`daeun-card flex-shrink-0 w-[72px] p-2 text-center rounded-lg cursor-pointer transition relative ${
                                  isSelected
                                    ? 'bg-navy border-2 border-gold shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                                    : 'bg-navy/70 border border-gray-800 hover:border-gray-600'
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gold text-black text-[8px] font-extrabold px-1.5 py-0.2 rounded-full whitespace-nowrap">
                                    {card.isDefault ? '현재' : '선택'}
                                  </span>
                                )}
                                <span className={`text-[9px] block mb-0.5 ${isSelected ? 'text-gold font-bold mt-0.5' : 'text-gray-400'}`}>
                                  {card.age}
                                </span>
                                <div className={`text-xs font-bold ${card.color}`}>
                                  {card.hanja}
                                </div>
                                <span className={`text-[9px] block mt-1 ${isSelected ? 'text-gold font-semibold' : 'text-gray-500'}`}>
                                  {card.kor}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => scrollDaeun(1)}
                          className="absolute -right-3 z-10 bg-gray-900/80 hover:bg-gold hover:text-black text-gray-300 border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow transition cursor-pointer"
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* 4. 1년 주기 세운(연운) 타임라인 카드 */}
                    <div className="bg-card border border-gray-800 rounded-xl p-4 shadow-lg space-y-3 relative">
                      <div className="text-xs font-bold text-cyan-400 flex items-center justify-between">
                        <span>1년 주기 세운 흐름 (확장 연도 보기)</span>
                        <span className="text-[10px] text-gray-400 font-normal">기준: 2026년</span>
                      </div>

                      <div className="relative flex items-center">
                        <button
                          onClick={() => scrollSewoon(-1)}
                          className="absolute -left-3 z-10 bg-gray-900/80 hover:bg-cyan-400 hover:text-black text-gray-300 border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow transition cursor-pointer"
                        >
                          ‹
                        </button>
                        
                        {/* 드래그 스크롤 컨테이너 */}
                        <div
                          ref={sewoonScrollRef}
                          onMouseDown={(e) => handleMouseDown(e, sewoonScrollRef)}
                          onMouseMove={(e) => handleMouseMove(e, sewoonScrollRef)}
                          onMouseUp={handleMouseUpOrLeave}
                          onMouseLeave={handleMouseUpOrLeave}
                          className="flex gap-1.5 overflow-x-auto no-scrollbar smooth-scroll w-full px-1 pt-1 pb-1 draggable-box"
                        >
                          {sewoonCards.map((card, idx) => {
                            const isSelected = selectedSewoonIdx === idx;
                            return (
                              <div
                                key={idx}
                                onClick={() => setSelectedSewoonIdx(idx)}
                                className={`sewoon-card flex-shrink-0 w-[72px] p-2 text-center rounded-lg cursor-pointer transition relative ${
                                  isSelected
                                    ? 'bg-navy border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                                    : 'bg-navy/70 border border-gray-800 hover:border-gray-600'
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-[8px] font-extrabold px-1.5 py-0.2 rounded-full whitespace-nowrap">
                                    {card.isDefault ? '올해' : '선택'}
                                  </span>
                                )}
                                <span className={`text-[9px] block mb-0.5 ${isSelected ? 'text-cyan-400 font-bold mt-0.5' : 'text-gray-400'}`}>
                                  {card.year}
                                </span>
                                <div className={`text-xs font-bold ${card.color}`}>
                                  {card.hanja}
                                </div>
                                <span className={`text-[9px] block mt-1 ${isSelected ? 'text-cyan-400 font-semibold' : 'text-gray-500'}`}>
                                  {card.kor}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <button
                          onClick={() => scrollSewoon(1)}
                          className="absolute -right-3 z-10 bg-gray-900/80 hover:bg-cyan-400 hover:text-black text-gray-300 border border-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow transition cursor-pointer"
                        >
                          ›
                        </button>
                      </div>
                    </div>

                    {/* 5. 상세 풀이 동적 아코디언 리스트 */}
                    <div className="space-y-2 pb-1">
                      <div className="bg-card border border-gold/40 rounded-xl overflow-hidden shadow">
                        <div className="p-3.5 bg-gold/5 flex justify-between items-center text-left">
                          <span className="text-xs font-bold text-gold flex items-center gap-2">
                            <span className="w-1.5 h-3.5 rounded-full bg-gold inline-block"></span>
                            {currentDaeunDetail.title}
                          </span>
                        </div>
                        <div className="px-3.5 pb-3.5 text-[11px] text-gray-300 space-y-2 border-t border-gray-800/60 pt-2.5">
                          {currentDaeunDetail.items.map((item, idx) => (
                            <div key={idx}>
                              <span className={`${item.color} font-semibold`}>• {item.label} </span>
                              {item.text}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-card border border-cyan-500/40 rounded-xl overflow-hidden shadow">
                        <div className="p-3.5 bg-cyan-500/5 flex justify-between items-center text-left">
                          <span className="text-xs font-bold text-cyan-400 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 rounded-full bg-cyan-400 inline-block"></span>
                            {currentSewoonDetail.title}
                          </span>
                        </div>
                        <div className="px-3.5 pb-3.5 text-[11px] text-gray-300 space-y-2 border-t border-gray-800/60 pt-2.5">
                          {currentSewoonDetail.items.map((item, idx) => (
                            <div key={idx}>
                              <span className={`${item.color} font-semibold`}>• {item.label} </span>
                              {item.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              ) : (
                /* 종합 분석 / 사주작용력 / 오행분포 뷰 */
                <>
                  {/* 상단 헤더: 최상단 좌측 브랜드 타이틀 완전 삭제 & 사용자 이름 및 생년월일 정보 직접 노출 */}
                  <div className="px-5 pt-3.5 pb-2.5 flex justify-between items-center border-b border-gray-800/80 bg-navy/80">
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h1 className="text-sm font-bold text-white tracking-wide truncate">{name || '김지훈'} 님</h1>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">
                        {displayYear}.{formattedMonth}.{formattedDay} ({calTypeStr}) {timeInfoStr} · {genderStr}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {activeFilter === 'all' && (
                        <button
                          onClick={() => setIsSaveConfirmModalOpen(true)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-[11px] shadow-[0_0_12px_rgba(250,204,21,0.35)] transition cursor-pointer shrink-0 active:scale-95"
                        >
                          <span>💾 내 사주 저장</span>
                        </button>
                      )}
                      <button
                        onClick={goBackToInput}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-navy border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/10 active:scale-95 text-[11px] font-semibold shadow-sm transition cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>정보다시입력</span>
                      </button>
                    </div>
                  </div>

                  {/* 메인 스크롤 영역 */}
                  <div className="flex-1 overflow-y-auto px-4 pt-3 pb-28 space-y-3.5 no-scrollbar">
                    
                    {/* 사주 명식 테이블 박스 */}
                    {(() => {
                      const wonGukCtx = { monthBranch: monthPillar.branch, yearBranch: yearPillar.branch, yearStem: yearPillar.stem };
                      const hourSG = getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, hourPillar.stem, hourPillar.branch, 'hour', wonGukCtx);
                      const daySG = getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, dayPillar.stem, dayPillar.branch, 'day', wonGukCtx);
                      const monthSG = getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, monthPillar.stem, monthPillar.branch, 'month', wonGukCtx);
                      const yearSG = getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, yearPillar.stem, yearPillar.branch, 'year', wonGukCtx);

                      return (
                        <>
                          <div className="bg-card border border-gray-800 rounded-xl p-3.5 shadow-lg text-center">
                          <div className={`grid ${unknownTime ? 'grid-cols-4' : 'grid-cols-5'} text-xs font-semibold text-gray-400 pb-2 border-b border-gray-800`}>
                            <div className="text-left pl-1">구분</div>
                            {!unknownTime && <div>시주</div>}
                            <div>일주</div>
                            <div>월주</div>
                            <div>년주</div>
                          </div>

                          {/* 천간 */}
                          <div className={`grid ${unknownTime ? 'grid-cols-4' : 'grid-cols-5'} items-center py-3 border-b border-gray-800/60 text-xs`}>
                            <div className="text-left pl-1 text-gray-400 font-medium">천간</div>
                            {!unknownTime && (
                              <div className="flex flex-col items-center justify-center py-0.5">
                                <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(hourPillar.stem))}`}>
                                  {hourPillar.stemHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({hourPillar.stem})</span>
                                </div>
                                <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(hourPillar.stem))}`}>
                                  {hourPillar.tenGodStem}
                                </div>
                              </div>
                            )}
                            <div className="flex flex-col items-center justify-center py-0.5">
                              <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(dayPillar.stem))}`}>
                                {dayPillar.stemHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({dayPillar.stem})</span>
                              </div>
                              <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(dayPillar.stem))}`}>
                                {dayPillar.tenGodStem || '비견'}
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center py-0.5">
                              <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(monthPillar.stem))}`}>
                                {monthPillar.stemHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({monthPillar.stem})</span>
                              </div>
                              <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(monthPillar.stem))}`}>
                                {monthPillar.tenGodStem}
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center py-0.5">
                              <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(yearPillar.stem))}`}>
                                {yearPillar.stemHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({yearPillar.stem})</span>
                              </div>
                              <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(yearPillar.stem))}`}>
                                {yearPillar.tenGodStem}
                              </div>
                            </div>
                          </div>

                          {/* 지지 */}
                          <div className={`grid ${unknownTime ? 'grid-cols-4' : 'grid-cols-5'} items-center py-3 border-b border-gray-800/60 text-xs`}>
                            <div className="text-left pl-1 text-gray-400 font-medium">지지</div>
                            {!unknownTime && (
                              <div className="flex flex-col items-center justify-center py-0.5">
                                <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(hourPillar.branch))}`}>
                                  {hourPillar.branchHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({hourPillar.branch})</span>
                                </div>
                                <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(hourPillar.branch))}`}>
                                  {hourPillar.tenGodBranch}
                                </div>
                              </div>
                            )}
                            <div className="flex flex-col items-center justify-center py-0.5">
                              <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(dayPillar.branch))}`}>
                                {dayPillar.branchHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({dayPillar.branch})</span>
                              </div>
                              <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(dayPillar.branch))}`}>
                                {dayPillar.tenGodBranch}
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center py-0.5">
                              <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(monthPillar.branch))}`}>
                                {monthPillar.branchHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({monthPillar.branch})</span>
                              </div>
                              <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(monthPillar.branch))}`}>
                                {monthPillar.tenGodBranch}
                              </div>
                            </div>
                            <div className="flex flex-col items-center justify-center py-0.5">
                              <div className={`font-extrabold text-[19px] leading-tight tracking-tight ${getElementTextColor(getElementFromStemBranch(yearPillar.branch))}`}>
                                {yearPillar.branchHanja}<span className="text-xs font-bold opacity-90 ml-0.5">({yearPillar.branch})</span>
                              </div>
                              <div className={`text-[11px] font-semibold mt-0.5 ${getElementTextColor(getElementFromStemBranch(yearPillar.branch))}`}>
                                {yearPillar.tenGodBranch}
                              </div>
                            </div>
                          </div>

                          {/* 지장간 */}
                          <div className={`grid ${unknownTime ? 'grid-cols-4' : 'grid-cols-5'} items-center py-3 border-b border-gray-800/60 text-xs`}>
                            <div className="text-left pl-1 text-gray-400 font-medium">지장간</div>
                            {(unknownTime ? [dayPillar, monthPillar, yearPillar] : [hourPillar, dayPillar, monthPillar, yearPillar]).map((pillar, pIdx) => {
                              const list = getJijangganList(pillar.branch);
                              return (
                                <div key={pIdx} className="flex flex-col items-center justify-center gap-1 py-0.5">
                                  {list.map((item, idx) => {
                                    const tenGod = calculateTenGodForChar(dayPillar.stem, item.hanja);
                                    return (
                                      <div key={idx} className="flex items-center gap-0.5 leading-tight">
                                        <span className="font-extrabold text-xs text-gray-300">
                                          {item.hanja}
                                        </span>
                                        <span className="text-[10.5px] font-semibold text-amber-200/90">
                                          ({tenGod})
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              );
                            })}
                          </div>

                          {/* 12운성 */}
                          <div className={`grid ${unknownTime ? 'grid-cols-4' : 'grid-cols-5'} items-center py-3 text-xs`}>
                            <div className="text-left pl-1 text-gray-400 font-medium">12운성</div>
                            {!unknownTime && (
                              <div className="flex flex-col items-center justify-center">
                                <span className="bg-[#1e293b] border border-amber-500/40 text-amber-200 font-bold text-xs px-2 py-0.5 rounded shadow-sm">
                                  {calculate12Unseong(dayPillar.stem, hourPillar.branch)}
                                </span>
                              </div>
                            )}
                            <div className="flex flex-col items-center justify-center">
                              <span className="bg-[#1e293b] border border-amber-500/40 text-amber-200 font-bold text-xs px-2 py-0.5 rounded shadow-sm">
                                {calculate12Unseong(dayPillar.stem, dayPillar.branch)}
                              </span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <span className="bg-[#1e293b] border border-amber-500/40 text-amber-200 font-bold text-xs px-2 py-0.5 rounded shadow-sm">
                                {calculate12Unseong(dayPillar.stem, monthPillar.branch)}
                              </span>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                              <span className="bg-[#1e293b] border border-amber-500/40 text-amber-200 font-bold text-xs px-2 py-0.5 rounded shadow-sm">
                                {calculate12Unseong(dayPillar.stem, yearPillar.branch)}
                              </span>
                            </div>
                          </div>
                        </div>

                    {/* 필터 칩 탭 */}
                    <div className="grid grid-cols-4 gap-2 w-full mt-1 mb-4.5">
                      <button
                        onClick={() => setActiveFilter('all')}
                        className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
                          activeFilter === 'all'
                            ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                            : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
                        }`}
                      >
                        종합 분석
                      </button>
                      <button
                        onClick={() => setActiveFilter('action')}
                        className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
                          activeFilter === 'action'
                            ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                            : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
                        }`}
                      >
                        사주작용력
                      </button>
                      <button
                        onClick={() => setActiveFilter('wuxing')}
                        className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
                          activeFilter === 'wuxing'
                            ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                            : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
                        }`}
                      >
                        오행 분포
                      </button>
                      <button
                        onClick={() => setActiveFilter('daewoon')}
                        className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
                          activeFilter === 'daewoon'
                            ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                            : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
                        }`}
                      >
                        대운 흐름
                      </button>
                    </div>

                    {/* 상세 분석 리스트 */}
                    <div className="space-y-2 pb-1" id="accordion-group">
                      {/* 년주 아코디언 */}
                      <div className={`border rounded-xl overflow-hidden transition ${openAccordion === 'year' ? 'bg-[#182238] border-gold shadow-md' : 'bg-card border-gray-800 shadow'}`}>
                        <button
                          onClick={() => toggleAccordion('year')}
                          className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none transition ${openAccordion === 'year' ? 'bg-gold/10' : 'hover:bg-gray-800/40'}`}
                        >
                          <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 rounded-full bg-purple-400 inline-block"></span>
                            [년주] 초년운 신살 및 길신 ({yearPillar.stem}{yearPillar.branch})
                          </span>
                          <svg className={`w-4 h-4 transform transition-transform duration-200 ${openAccordion === 'year' ? 'rotate-180 text-gold' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                        {openAccordion === 'year' && renderPillarAnalysisContent('year', yearSG, handleOpenDetailModal)}
                      </div>

                      {/* 월주 아코디언 */}
                      <div className={`border rounded-xl overflow-hidden transition ${openAccordion === 'month' ? 'bg-[#182238] border-gold shadow-md' : 'bg-card border-gray-800 shadow'}`}>
                        <button
                          onClick={() => toggleAccordion('month')}
                          className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none transition ${openAccordion === 'month' ? 'bg-gold/10' : 'hover:bg-gray-800/40'}`}
                        >
                          <span className="text-xs font-bold text-blue-300 flex items-center gap-2">
                            <span className="w-1.5 h-3.5 rounded-full bg-blue-400 inline-block"></span>
                            [월주] 청년운 신살 및 길신 ({monthPillar.stem}{monthPillar.branch})
                          </span>
                          <svg className={`w-4 h-4 transform transition-transform duration-200 ${openAccordion === 'month' ? 'rotate-180 text-gold' : 'text-blue-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                        {openAccordion === 'month' && renderPillarAnalysisContent('month', monthSG, handleOpenDetailModal)}
                      </div>

                      {/* 일주 아코디언 */}
                      <div className={`border rounded-xl overflow-hidden transition ${openAccordion === 'day' ? 'bg-[#182238] border-gold shadow-md' : 'bg-card border-gray-800 shadow'}`}>
                        <button
                          onClick={() => toggleAccordion('day')}
                          className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none transition ${openAccordion === 'day' ? 'bg-gold/10' : 'hover:bg-gray-800/40'}`}
                        >
                          <span className="text-xs font-bold text-gold flex items-center gap-2">
                            <span className="w-1.5 h-3.5 rounded-full bg-gold inline-block"></span>
                            [일주] 중년운 신살 및 길신 ({dayPillar.stem}{dayPillar.branch})
                          </span>
                          <svg className={`w-4 h-4 transform transition-transform duration-200 ${openAccordion === 'day' ? 'rotate-180 text-gold' : 'text-gold/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                        {openAccordion === 'day' && renderPillarAnalysisContent('day', daySG, handleOpenDetailModal)}
                      </div>

                      {/* 시주 아코디언 */}
                      {!unknownTime && (
                        <div className={`border rounded-xl overflow-hidden transition ${openAccordion === 'time' ? 'bg-[#182238] border-gold shadow-md' : 'bg-card border-gray-800 shadow'}`}>
                          <button
                            onClick={() => toggleAccordion('time')}
                            className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none transition ${openAccordion === 'time' ? 'bg-gold/10' : 'hover:bg-gray-800/40'}`}
                          >
                            <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                              <span className="w-1.5 h-3.5 rounded-full bg-emerald-400 inline-block"></span>
                              [시주] 말년운 신살 및 길신 ({hourPillar.stem}{hourPillar.branch})
                            </span>
                            <svg className={`w-4 h-4 transform transition-transform duration-200 ${openAccordion === 'time' ? 'rotate-180 text-gold' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          </button>
                          {openAccordion === 'time' && renderPillarAnalysisContent('hour', hourSG, handleOpenDetailModal)}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

                  </div>
                </>
              )}

              {/* 하단 고정 탭바 (공통 - 5개 탭 균등 배치) */}
              <div
                className="fixed bottom-0 left-0 right-0 w-full max-w-[412px] mx-auto bg-[#0b1120] opacity-100 border-t border-gray-700/80 px-2 pt-2.5 grid grid-cols-5 items-center z-[9999] shadow-[0_-4px_20px_rgba(0,0,0,0.8)]"
                style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
              >
                <button
                  onClick={() => { setActiveTab('saju'); setViewMode('input'); }}
                  className={`flex flex-col items-center justify-center gap-1.5 cursor-pointer min-w-0 py-1 ${
                    activeTab === 'saju' && viewMode === 'input'
                      ? 'text-gold'
                      : 'text-gray-300 hover:text-white transition'
                  }`}
                >
                  <div className={activeTab === 'saju' && viewMode === 'input' ? 'filter drop-shadow-[0_0_6px_rgba(59,130,246,0.4)]' : ''}>
                    <svg className="w-6 h-6 overflow-visible" viewBox="0 0 24 24" fill="#3B82F6">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M12 12.5c-4.5 0-7.5 2.5-7.5 5.5 0 1.4 1.1 2.5 2.5 2.5h10c1.4 0 2.5-1.1 2.5-2.5 0-3-3-5.5-7.5-5.5z" />
                    </svg>
                  </div>
                  <span className={`text-xs font-bold whitespace-nowrap ${activeTab === 'saju' && viewMode === 'input' ? 'text-gold' : 'text-gray-300'}`}>
                    정보입력
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('storage')}
                  className="flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer min-w-0 py-1"
                >
                  <div>
                    <span className="text-xl leading-none">📇</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">보관함</span>
                </button>
                <button
                  onClick={() => { setActiveTab('gunghap'); setGunghapSubTab('wonguk'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-rose-400 hover:text-rose-300 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_6px_rgba(212,175,55,0.5)] transform group-hover:scale-110 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-rose-300 whitespace-nowrap">궁합</span>
                </button>
                <button
                  onClick={() => setActiveTab('premium')}
                  className="flex flex-col items-center justify-center gap-1.5 text-cyan-400 group cursor-pointer min-w-0 py-1"
                >
                  <div className="filter drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] transform group-hover:scale-110 transition duration-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 2L3 8l9 13L21 8l-3-6H6z" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M3 8h18M6 2l3 6M18 2l-3 6M9 8l3 13 3-13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight text-cyan-400 whitespace-nowrap">프리미엄</span>
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setViewMode('input'); }}
                  className="flex flex-col items-center justify-center gap-1.5 text-gray-300 hover:text-white transition cursor-pointer min-w-0 py-1"
                >
                  <div>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">설정</span>
                </button>
              </div>

            </div>
          )}
        </>
      )}

          {/* 신살 / 길신 상세 정보 팝업 (화면 정중앙 센터 팝업) */}
          {selectedDetailModal && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[10000] p-4 animate-fadeIn"
              onClick={() => setSelectedDetailModal(null)}
            >
              <div
                className="bg-[#131B2E] border border-gray-700/80 rounded-2xl p-5 w-full max-w-sm space-y-3.5 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded border ${
                      selectedDetailModal.type === 'sinsal'
                        ? 'bg-[#8C3B2B] text-orange-100 border-orange-500/40'
                        : 'bg-[#4C205E] text-purple-100 border-purple-500/40'
                    }`}>
                      {selectedDetailModal.type === 'sinsal' ? '신살' : '길신'}
                    </span>
                    <h3 className="text-sm font-extrabold text-white">
                      {selectedDetailModal.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDetailModal(null)}
                    className="text-gray-400 hover:text-white text-xl font-bold px-2 py-0.5 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <div className="bg-navy/70 border border-gray-800 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-[11px] font-bold text-gold flex items-center gap-1">
                    <span>✨</span> 핵심 성향 및 작용 풀이
                  </span>
                  <p className="text-xs text-gray-200 leading-relaxed font-medium pt-0.5">
                    {selectedDetailModal.description}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedDetailModal(null)}
                  className="w-full bg-gold hover:bg-[#e0b812] text-black font-extrabold py-3 rounded-xl text-xs shadow-[0_4px_15px_rgba(212,175,55,0.3)] transition cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* 도움말 모달 팝업 */}
          {isHelpModalOpen && (
            <div id="help-modal" className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-5 z-[10000]">
              <div className="bg-[#131B2E] border border-gray-700/80 rounded-2xl p-5 w-full space-y-4 shadow-2xl relative max-h-[85%] overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-center border-b border-gray-800 pb-3">
                  <h3 className="text-sm font-bold text-gold flex items-center gap-1.5">
                    <span>⏰</span> 시간 보정 시스템 안내
                  </h3>
                  <button onClick={toggleHelpModal} className="text-gray-400 hover:text-white text-lg font-bold px-1 cursor-pointer">&times;</button>
                </div>
                
                <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                  <div className="bg-navy/70 border border-gray-800 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                      1. 표준시 보정 (KST 오차 보정)
                    </span>
                    <p className="text-[11px] text-gray-400 pl-3">
                      대한민국 표준시는 동경 135도(일본 아카시시)를 사용하므로, 실제 우리나라 입기시각과의 30분 시차를 자동 정밀 보정합니다.
                    </p>
                  </div>

                  <div className="bg-navy/70 border border-gray-800 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                      2. 진태양시 보정 (경도 보정)
                    </span>
                    <p className="text-[11px] text-gray-400 pl-3">
                      출생 지역별 실제 태양의 위치(경도)를 반영하여 사주 시주(時柱)의 경계선 판단 오차를 완벽하게 차단합니다.
                    </p>
                  </div>

                  <div className="bg-navy/70 border border-gray-800 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                      3. 썸머타임 (일광절약시간) 자동 적용
                    </span>
                    <p className="text-[11px] text-gray-400 pl-3">
                      1948~1951년, 1954~1960년, 1987~1988년에 시행된 썸머타임 적용 기간 출생자의 시각을 역사적 기준에 따라 자동 보정합니다.
                    </p>
                  </div>

                  <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 space-y-1">
                    <span className="text-[11px] font-bold text-gold flex items-center gap-1">
                      💡 루멘 AI 만세력 보정 안내
                    </span>
                    <p className="text-[10px] text-gray-300 leading-normal">
                      루멘 AI 만세력은 사용자가 입력한 생년월일시와 출생지를 바탕으로 위 3대 보정을 자동 계산하므로, 별도의 시간 계산 없이 태어난 시각 그대로 입력하시면 됩니다.
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleHelpModal}
                  className="w-full bg-gold hover:bg-[#e0b812] text-black font-extrabold py-3 rounded-xl text-xs shadow-[0_4px_15px_rgba(212,175,55,0.3)] transition cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* 연도 유효성 예외 안내 센터 팝업 모달 */}
          {yearErrorMsg && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setYearErrorMsg(null)}
            >
              <div
                className="bg-[#131B2E] border border-amber-500/60 rounded-2xl p-5 w-full max-w-xs space-y-4 shadow-2xl relative text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ⚠️
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white">연도 입력 범위 오류</h3>
                  <p className="text-xs text-gray-200 leading-relaxed break-keep">
                    {yearErrorMsg}
                  </p>
                </div>
                <button
                  onClick={() => setYearErrorMsg(null)}
                  className="w-full bg-gold hover:bg-[#e0b812] text-black font-extrabold py-2.5 rounded-xl text-xs shadow-[0_4px_15px_rgba(212,175,55,0.3)] transition cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* 사주 저장 확인 Confirm 팝업 모달 */}
          {isSaveConfirmModalOpen && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setIsSaveConfirmModalOpen(false)}
            >
              <div
                className="bg-[#131d33] border border-amber-400/50 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300 text-2xl shadow-lg">
                  💾
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">사주 보관함 저장</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    현재 사주 정보를 저장하기 위해 보관함으로 이동하시겠습니까?
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setIsSaveConfirmModalOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-semibold transition cursor-pointer"
                  >
                    아니오
                  </button>
                  <button
                    onClick={handleConfirmSaveSaju}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] transition cursor-pointer"
                  >
                    예
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 보관함 정보 편집 모달 */}
          {editingItem && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setEditingItem(null)}
            >
              <div
                className="bg-[#131d33] border border-amber-400/40 rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-gray-800 pb-2.5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>✏️</span>
                    <span>보관함 정보 수정</span>
                  </h3>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="text-gray-400 hover:text-white text-sm font-bold px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* 이름 수정 */}
                  <div>
                    <label className="block text-gray-400 font-medium mb-1">이름</label>
                    <input
                      type="text"
                      value={editName}
                      maxLength={8}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 text-xs"
                      placeholder="이름 입력 (최대 8자)"
                    />
                  </div>

                  {/* 그룹 선택 */}
                  <div>
                    <label className="block text-gray-400 font-medium mb-1">그룹 선택</label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto no-scrollbar pt-0.5">
                      {Array.from(new Set(['일반', ...customGroups])).map(grp => {
                        const isSel = (editGroup === grp) || (!editGroup && grp === '일반') || (editGroup === '미지정' && grp === '일반');
                        const cStyle = getGroupColorStyle(grp);
                        return (
                          <button
                            key={grp}
                            type="button"
                            onClick={() => setEditGroup(grp)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer border ${
                              isSel
                                ? 'shadow-md font-extrabold'
                                : 'bg-navy border-gray-700 text-gray-300 hover:border-gray-500'
                            }`}
                            style={
                              isSel
                                ? {
                                    backgroundColor: cStyle.bgHex,
                                    color: cStyle.textHex,
                                    borderColor: cStyle.borderHex,
                                  }
                                : undefined
                            }
                          >
                            {grp}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 메모 작성 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-gray-400 font-medium">메모</label>
                      <span className="text-[10.5px] text-amber-400/90 font-medium">
                        {editMemo.length} / 20자
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editMemo}
                      maxLength={20}
                      onChange={(e) => setEditMemo(e.target.value.replace(/[\r\n]/g, '').slice(0, 20))}
                      className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 placeholder-gray-500 text-xs"
                      placeholder="특징이나 메모 입력 (최대 20자, 1줄)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setEditingItem(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] transition cursor-pointer"
                  >
                    저장 완료
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 저장 완료 안내 Alert 팝업 모달 */}
          {savedSuccessAlertName && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setSavedSuccessAlertName(null)}
            >
              <div
                className="bg-[#131d33] border border-amber-400/50 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300 text-2xl shadow-lg">
                  ✅
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">저장 완료</h3>
                  <div className="text-xs text-gray-100 font-medium leading-relaxed space-y-0.5">
                    <p>[{savedSuccessAlertName}] 님의</p>
                    <p>사주정보가 저장되었습니다.</p>
                    <p className="text-xs text-white font-medium pt-1">'수정' 버튼을 통해 그룹지정이 가능합니다.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSavedSuccessAlertName(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)] transition cursor-pointer"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* 불러오기 Confirm 팝업 모달 */}
          {loadConfirmItem && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setLoadConfirmItem(null)}
            >
              <div
                className="bg-[#131d33] border border-blue-400/50 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/15 border border-blue-400/40 flex items-center justify-center mx-auto text-blue-300 text-2xl shadow-lg">
                  📂
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">사주 정보 불러오기</h3>
                  <div className="text-xs text-gray-200 leading-relaxed space-y-0.5">
                    <p>[{loadConfirmItem.name}] 님의</p>
                    <p>사주정보로 변경하시겠습니까?</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setLoadConfirmItem(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-semibold transition cursor-pointer"
                  >
                    아니오
                  </button>
                  <button
                    onClick={() => {
                      const itemToLoad = loadConfirmItem;
                      setLoadConfirmItem(null);
                      handleLoadSavedSaju(itemToLoad);
                    }}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] transition cursor-pointer"
                  >
                    예
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 삭제 Confirm 팝업 모달 */}
          {deleteConfirmItem && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setDeleteConfirmItem(null)}
            >
              <div
                className="bg-[#131d33] border rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                style={{ borderColor: 'rgba(229, 115, 115, 0.4)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-rose-200 text-2xl shadow-sm border"
                  style={{ borderColor: 'rgba(229, 115, 115, 0.3)', backgroundColor: 'transparent' }}
                >
                  🗑️
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">사주 정보 삭제</h3>
                  <div className="text-xs text-gray-200 leading-relaxed space-y-0.5">
                    <p>[{deleteConfirmItem.name}] 님의</p>
                    <p>사주정보를 삭제하시겠습니까?</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setDeleteConfirmItem(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-semibold transition cursor-pointer"
                  >
                    아니오
                  </button>
                  <button
                    onClick={() => {
                      const idToDelete = deleteConfirmItem.id;
                      setDeleteConfirmItem(null);
                      setSavedSajuList(prev => prev.filter(item => item.id !== idToDelete));
                    }}
                    style={{ backgroundColor: '#E57373', color: '#FFFFFF' }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm hover:opacity-90"
                  >
                    예
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 1. 궁합 보기 확인 팝업 모달 */}
          {isGunghapConfirmModalOpen && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setIsGunghapConfirmModalOpen(false)}
            >
              <div
                className="bg-[#131d33] border border-rose-400/60 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/50 flex items-center justify-center mx-auto text-rose-300 text-2xl shadow-lg">
                  🔮
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-white tracking-tight">상세 궁합 확인</h3>
                  <div className="text-xs text-gray-200 leading-relaxed space-y-1">
                    <p className="font-extrabold text-rose-300 text-sm">
                      [{savedSajuList.find(i => i.id === selectedGunghapTargetId)?.name}] 님과의
                    </p>
                    <p>상세 궁합을 확인하시겠습니까?</p>
                    {hasUsedFirstFreeGunghap ? (
                      <p className="text-[11px] text-rose-300 bg-rose-950/60 p-2 rounded-lg border border-rose-500/30 mt-2">
                        💳 최초 1회 무료 혜택이 이미 사용되었습니다. 유료 이용(상세 분석 서비스)으로 전환됩니다.
                      </p>
                    ) : (
                      <p className="text-[11px] text-emerald-300 bg-emerald-950/60 p-2 rounded-lg border border-emerald-500/30 mt-2">
                        ✨ 최초 1회 무료 혜택을 사용합니다. (약 2,000자 상세 분석 리포트 제공)
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setIsGunghapConfirmModalOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      if (hasUsedFirstFreeGunghap) {
                        alert('최초 1회 무료 혜택이 사용 완료되었습니다. 유료 결제 후 상세 궁합 서비스 이용이 가능합니다.');
                        return;
                      }
                      executeFullGunghapProcess();
                    }}
                    className={`w-full py-2.5 rounded-xl text-xs font-extrabold shadow-lg transition cursor-pointer ${
                      hasUsedFirstFreeGunghap
                        ? 'bg-amber-600/90 hover:bg-amber-500 text-white shadow-amber-950/40'
                        : 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-rose-900/40 hover:brightness-110 active:scale-95'
                    }`}
                  >
                    {hasUsedFirstFreeGunghap ? '유료 상세보기' : '상세 궁합 보기'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. 궁합 분석 생성 중 로딩 오버레이 */}
          {isGeneratingGunghap && (
            <div className="fixed inset-0 z-[250] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(244,63,94,0.5)]"></div>
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-white">상세 궁합 분석 보고서 생성 중...</h3>
                <p className="text-xs text-rose-200/90 max-w-xs leading-relaxed">
                  사주 원국과 십성/신살 오행 기운을 정밀하게 대조하여 약 2,000자 전문 상세 궁합 결과를 작성하고 있습니다.
                </p>
              </div>
            </div>
          )}

          {/* 3. 모바일 전체 화면 상세 궁합 결과 모달 */}
          {currentGunghapDetail && (
            <div className="fixed inset-0 z-[200] bg-[#0a0f1d] flex flex-col text-white overflow-y-auto no-scrollbar animate-fadeIn">
              {/* 상단 고정 헤더 */}
              <div className="sticky top-0 bg-[#131d33]/95 backdrop-blur-md border-b border-gray-800 px-4 py-3 flex items-center justify-between z-10 shadow-md">
                <button
                  onClick={() => setCurrentGunghapDetail(null)}
                  className="text-xs text-gray-300 hover:text-white font-semibold flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <span>←</span>
                  <span>닫기</span>
                </button>
                <h3 className="text-sm font-extrabold text-rose-300 tracking-tight flex items-center gap-1">
                  <span>💕</span>
                  <span>{currentGunghapDetail.mySajuName} & {currentGunghapDetail.targetSajuName} 궁합</span>
                </h3>
                <button
                  onClick={() => setCurrentGunghapDetail(null)}
                  className="text-gray-400 hover:text-white font-bold text-base px-2 py-0.5 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 본문 콘텐츠 (약 2,000자 전문 상세 분석) */}
              <div className="p-4 space-y-5 max-w-lg mx-auto w-full pb-20">
                {/* 점수 & 요약 카드 */}
                <div className="bg-gradient-to-br from-rose-950/50 via-[#131d33] to-pink-950/40 border-2 border-rose-500/60 rounded-2xl p-5 shadow-2xl text-center space-y-3">
                  <div className="inline-block px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-extrabold rounded-full border border-rose-500/40">
                    궁합 결속지수
                  </div>
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200">
                    {currentGunghapDetail.score}점
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed font-medium bg-navy/80 p-3 rounded-xl border border-gray-800 text-left">
                    {currentGunghapDetail.summary}
                  </p>
                </div>

                {/* 섹션 1: 전체적인 궁합 */}
                <div className="bg-[#131d33] border border-gray-800 rounded-2xl p-4.5 space-y-2 shadow-md">
                  <h4 className="text-xs font-extrabold text-rose-300 flex items-center gap-1.5 border-b border-gray-800 pb-2">
                    <span>✨</span>
                    <span>1. 전체적인 궁합 (오행과 원국 조화)</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {currentGunghapDetail.overall}
                  </p>
                </div>

                {/* 섹션 2: 성격 및 대화 스타일 */}
                <div className="bg-[#131d33] border border-gray-800 rounded-2xl p-4.5 space-y-2 shadow-md">
                  <h4 className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5 border-b border-gray-800 pb-2">
                    <span>🗣️</span>
                    <span>2. 성격 및 대화 케미스트리</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {currentGunghapDetail.personality}
                  </p>
                </div>

                {/* 섹션 3: 연애 & 애정 궁합 */}
                <div className="bg-[#131d33] border border-gray-800 rounded-2xl p-4.5 space-y-2 shadow-md">
                  <h4 className="text-xs font-extrabold text-pink-300 flex items-center gap-1.5 border-b border-gray-800 pb-2">
                    <span>💖</span>
                    <span>3. 연애 & 애정 표현 궁합</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {currentGunghapDetail.love}
                  </p>
                </div>

                {/* 섹션 4: 생활 & 가치관 궁합 */}
                <div className="bg-[#131d33] border border-gray-800 rounded-2xl p-4.5 space-y-2 shadow-md">
                  <h4 className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5 border-b border-gray-800 pb-2">
                    <span>🏠</span>
                    <span>4. 생활 & 가치관 조화</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-normal">
                    {currentGunghapDetail.life}
                  </p>
                </div>

                {/* 섹션 5: 핵심 조언 가이드 */}
                <div className="bg-gradient-to-r from-amber-500/10 via-[#131d33] to-rose-500/10 border border-amber-400/40 rounded-2xl p-4.5 space-y-2.5 shadow-md">
                  <h4 className="text-xs font-extrabold text-gold flex items-center gap-1.5 border-b border-amber-400/20 pb-2">
                    <span>💡</span>
                    <span>5. 두 사람을 위한 핵심 길잡이</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-gray-200">
                    {currentGunghapDetail.keyPoints.map((pt, idx) => (
                      <p key={idx} className="leading-relaxed font-medium">
                        {pt}
                      </p>
                    ))}
                  </div>
                </div>

                {/* 하단 닫기 버튼 */}
                <button
                  onClick={() => setCurrentGunghapDetail(null)}
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs rounded-xl shadow-lg transition cursor-pointer"
                >
                  확인 완료
                </button>
              </div>
            </div>
          )}

          {/* 단일 상세궁합 결과 개별 삭제 확인 팝업 모달 */}
          {singleGunghapToDelete && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[210] p-4 animate-fadeIn"
              onClick={() => setSingleGunghapToDelete(null)}
            >
              <div
                className="bg-[#131d33] border border-rose-500/50 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-400/40 flex items-center justify-center mx-auto text-rose-300 text-2xl shadow-lg">
                  🗑️
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-white tracking-tight">상세궁합 결과를 삭제하시겠습니까?</h3>
                  <p className="text-xs text-gray-300 leading-relaxed font-medium">
                    삭제한 결과는 복구할 수 없습니다.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => setSingleGunghapToDelete(null)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setSavedGunghapList(prev => prev.filter(item => item.id !== singleGunghapToDelete.id));
                      setSingleGunghapToDelete(null);
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition cursor-pointer active:scale-95"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 그룹 카테고리 관리 모달 */}
          {isGroupManageModalOpen && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn pointer-events-auto touch-none"
              onClick={() => { setIsGroupManageModalOpen(false); setEditingGroupIndex(null); }}
              onTouchMove={(e) => {
                if (e.target === e.currentTarget && e.cancelable) {
                  e.preventDefault();
                }
              }}
            >
              <div
                ref={groupManageModalRef}
                tabIndex={-1}
                autoFocus
                className="bg-[#131d33] border border-gray-700/80 rounded-2xl p-5 max-w-xs w-full shadow-2xl space-y-4 relative text-left z-10 pointer-events-auto focus:outline-none"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center border-b border-gray-800 pb-2.5">
                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <span>⚙️</span>
                    <span>그룹 카테고리 관리</span>
                  </h3>
                  <button
                    onClick={() => { setIsGroupManageModalOpen(false); setEditingGroupIndex(null); }}
                    className="text-gray-400 hover:text-white text-sm font-bold px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* 등록된 그룹 목록 ([그룹1], [그룹2], [그룹3] + 디폴트 [일반]) */}
                <div className="space-y-2.5">
                  {customGroups.map((groupName, idx) => {
                    const currentColorId = groupColors[groupName] || (idx === 0 ? 'green' : idx === 1 ? 'yellow' : 'purple');
                    const cStyle = PASTEL_COLOR_MAP[currentColorId] || PASTEL_COLOR_MAP.green;
                    const isEditingThis = editingGroupIndex === idx;

                    return (
                      <div
                        key={groupName + idx}
                        className="p-2.5 rounded-xl bg-navy/80 border border-gray-800 text-xs space-y-2"
                      >
                        {isEditingThis ? (
                          <div className="space-y-2.5 w-full">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editingGroupValue}
                                onChange={(e) => setEditingGroupValue(e.target.value)}
                                maxLength={3}
                                placeholder="최대 3자"
                                className="bg-navy border border-amber-400 rounded-lg px-2 py-1 text-white text-xs w-full focus:outline-none"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEditedGroup(idx)}
                                className="px-2.5 py-1 bg-amber-400 text-black font-bold rounded-lg shrink-0 text-[11px] hover:bg-amber-300 cursor-pointer"
                              >
                                저장
                              </button>
                              <button
                                onClick={() => setEditingGroupIndex(null)}
                                className="px-2 py-1 bg-gray-800 text-gray-300 rounded-lg shrink-0 text-[11px] hover:bg-gray-700 cursor-pointer"
                              >
                                취소
                              </button>
                            </div>

                            {/* 소프트/파스텔 테마 색상 선택 8종 */}
                            <div>
                              <span className="text-[10px] text-gray-400 block mb-1.5 font-medium">그룹 테마 색상 선택 (8종):</span>
                              <div className="grid grid-cols-4 gap-1.5">
                                {(['yellow', 'green', 'purple', 'gray', 'blue', 'pink', 'mint', 'orange'] as ColorId[]).map((cId) => {
                                  const colorObj = PASTEL_COLOR_MAP[cId];
                                  const isSelected = editingGroupColor === cId;
                                  return (
                                    <button
                                      key={cId}
                                      type="button"
                                      onClick={() => setEditingGroupColor(cId)}
                                      className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-[11px] font-extrabold transition cursor-pointer border relative whitespace-nowrap ${
                                        isSelected
                                          ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-[#131d33] font-extrabold shadow-md scale-[1.02]'
                                          : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'
                                      }`}
                                      style={{
                                        backgroundColor: colorObj.bgHex,
                                        color: colorObj.textHex,
                                        borderColor: isSelected ? '#FACC15' : colorObj.borderHex,
                                      }}
                                    >
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colorObj.dotHex }} />
                                      <span className="whitespace-nowrap">{colorObj.name}</span>
                                      {isSelected && (
                                        <span className="text-amber-500 font-extrabold text-[10px] ml-0.5">✓</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cStyle.dotHex }} />
                              <span className="font-semibold text-gray-200 truncate">{groupName}</span>
                              <button
                                onClick={() => {
                                  setEditingGroupIndex(idx);
                                  setEditingGroupValue(groupName);
                                  const cId = groupColors[groupName] || (idx === 0 ? 'green' : idx === 1 ? 'yellow' : 'purple');
                                  setEditingGroupColor(cId);
                                }}
                                className="p-1 text-gray-400 hover:text-amber-300 text-xs cursor-pointer shrink-0 ml-0.5 active:scale-95"
                                title="그룹명 & 색상 수정"
                              >
                                ✏️
                              </button>
                            </div>
                            <button
                              onClick={() => setGroupToDeleteConfirm(groupName)}
                              className="p-1 text-gray-400 hover:text-rose-400 text-xs cursor-pointer shrink-0 active:scale-95"
                              title="해당 그룹의 전체 저장 정보 삭제"
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* 기본 디폴트 고정 그룹 [일반] */}
                  {(() => {
                    const defaultStyle = PASTEL_COLOR_MAP.gray;
                    return (
                      <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-navy/80 border border-gray-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: defaultStyle.dotHex }} />
                          <span className="font-semibold text-gray-200">일반</span>
                          <span className="text-[10px] text-gray-500 font-normal">(기본)</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setGroupToDeleteConfirm('일반')}
                            className="p-1 text-gray-400 hover:text-rose-400 text-xs cursor-pointer"
                            title="일반 그룹의 전체 저장 정보 삭제"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      try {
                        localStorage.setItem('customGroups', JSON.stringify(customGroups));
                        localStorage.setItem('groupColors', JSON.stringify(groupColors));
                      } catch (e) {}
                      setIsGroupManageModalOpen(false);
                      setEditingGroupIndex(null);
                    }}
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 active:scale-[0.98] text-black text-xs font-extrabold rounded-xl shadow-[0_0_15px_rgba(250,204,21,0.25)] transition cursor-pointer"
                  >
                    완료
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 그룹 내 전체 사주 데이터 일괄 삭제 Confirm 팝업 */}
          {groupToDeleteConfirm && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setGroupToDeleteConfirm(null)}
            >
              <div
                className="bg-[#131d33] border rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                style={{ borderColor: 'rgba(229, 115, 115, 0.4)' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-rose-200 text-2xl shadow-sm border"
                  style={{ borderColor: 'rgba(229, 115, 115, 0.3)', backgroundColor: 'transparent' }}
                >
                  🗑️
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">그룹 데이터 일괄 삭제</h3>
                  <div className="text-xs text-gray-300 leading-relaxed space-y-0.5">
                    <p>[{groupToDeleteConfirm}] 목록에 저장되어 있는 정보가</p>
                    <p>모두 삭제됩니다.</p>
                    <p className="pt-1 text-gray-100 font-semibold">정말 삭제하시겠습니까?</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setGroupToDeleteConfirm(null)}
                    className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition cursor-pointer"
                  >
                    아니오
                  </button>
                  <button
                    onClick={() => handleConfirmDeleteGroupData(groupToDeleteConfirm)}
                    style={{ backgroundColor: '#E57373', color: '#FFFFFF' }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm hover:opacity-90"
                  >
                    예
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 그룹 정보/색상 변경 확인 Confirm 팝업 */}
          {groupSaveConfirmInfo && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setGroupSaveConfirmInfo(null)}
            >
              <div
                className="bg-[#131d33] border border-amber-400/40 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-amber-300 text-2xl bg-amber-400/10 border border-amber-400/30">
                  🎨
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-white tracking-tight">그룹 설정 변경 확인</h3>
                  <div className="text-xs text-gray-300 leading-relaxed space-y-0.5">
                    <p>그룹 색상을 '<span className="text-amber-300 font-bold">{groupSaveConfirmInfo.colorName}</span>' 색상으로</p>
                    <p>변경하시겠습니까?</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setGroupSaveConfirmInfo(null)}
                    className="w-full py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold transition cursor-pointer"
                  >
                    아니오
                  </button>
                  <button
                    onClick={executeGroupSave}
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold transition cursor-pointer shadow-sm active:scale-95"
                  >
                    예
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 저장 완료 피드백 팝업 */}
          {groupSaveSuccessMsg && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setGroupSaveSuccessMsg(null)}
            >
              <div
                className="bg-[#131d33] border border-emerald-500/40 rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center space-y-4 relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto text-emerald-300 text-2xl bg-emerald-500/10 border border-emerald-500/30">
                  ✅
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white tracking-tight">설정 완료</h3>
                  <p className="text-xs text-gray-200">{groupSaveSuccessMsg}</p>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => setGroupSaveSuccessMsg(null)}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold transition cursor-pointer shadow-sm active:scale-95"
                  >
                    확인
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* 궁합 상대 선택 모달 (1차 / 2차 분리) */}
          {isGunghapSelectModalOpen && gunghapSajuA && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn touch-none"
              onClick={() => {
                setIsGunghapSelectModalOpen(false);
                setIsGunghapSubStorageOpen(false);
              }}
              onTouchMove={(e) => {
                if (e.target === e.currentTarget) {
                  e.preventDefault();
                }
              }}
            >
              <div
                className="bg-[#131d33] border border-rose-400/50 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3.5 relative text-left max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {!isGunghapSubStorageOpen ? (
                  /* --- 1차 모달: 2가지 큰 액션만 제공 --- */
                  <>
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 shrink-0">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>💗</span>
                        <span>[{gunghapSajuA.name}] 님의 궁합 상대 선택</span>
                      </h3>
                      <button
                        onClick={() => setIsGunghapSelectModalOpen(false)}
                        className="text-gray-400 hover:text-white text-sm font-bold px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3 py-1">
                      {/* 액션 1: 현재 메인 화면 사주와 궁합보기 */}
                      <button
                        onClick={() => {
                          const mainSaju = getCurrentMainSajuItem();
                          executeGunghap(gunghapSajuA, mainSaju);
                        }}
                        className="w-full p-4 rounded-xl bg-gradient-to-r from-rose-500/20 via-navy to-purple-900/20 border border-rose-400/40 hover:border-rose-400 text-left transition cursor-pointer space-y-1.5 group shadow-md active:scale-98"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-rose-300 group-hover:text-rose-200 flex items-center gap-1.5">
                            <span>⚡</span>
                            <span>현재 메인 화면 사주와 궁합보기</span>
                          </span>
                          <span className="text-xs text-rose-400 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                        <p className="text-[11px] text-gray-300 pl-5">
                          {name || '김지훈'} ({displayYear}.{formattedMonth}.{formattedDay} · {genderStr})
                        </p>
                      </button>

                      {/* 액션 2: 보관함에서 상대 선택하기 */}
                      <button
                        onClick={() => setIsGunghapSubStorageOpen(true)}
                        className="w-full p-4 rounded-xl bg-navy/90 border border-amber-400/30 hover:border-amber-400 hover:bg-amber-400/10 text-left transition cursor-pointer space-y-1 group shadow-md active:scale-98"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-amber-300 group-hover:text-amber-200 flex items-center gap-1.5">
                            <span>🗄️</span>
                            <span>보관함에서 상대 선택하기</span>
                          </span>
                          <span className="text-xs text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
                        </div>
                        <p className="text-[11px] text-gray-400 pl-5">
                          저장된 사주 목록에서 검색 및 그룹별 선택
                        </p>
                      </button>
                    </div>

                    <div className="pt-1 shrink-0">
                      <button
                        onClick={() => setIsGunghapSelectModalOpen(false)}
                        className="w-full py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                      >
                        취소
                      </button>
                    </div>
                  </>
                ) : (
                  /* --- 2차 서브 모달: 검색 + 그룹 필터 + 사주 목록 --- */
                  <>
                    {/* Header (고정) */}
                    <div className="flex items-center justify-between border-b border-gray-800 pb-2.5 shrink-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsGunghapSubStorageOpen(false)}
                          className="px-2 py-0.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                          title="이전으로 돌아가기"
                        >
                          <span>←</span>
                          <span>뒤로</span>
                        </button>
                        <h3 className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
                          <span>🗄️</span>
                          <span className="truncate max-w-[170px]">[{gunghapSajuA.name}] 궁합 상대 선택</span>
                        </h3>
                      </div>
                      <button
                        onClick={() => {
                          setIsGunghapSelectModalOpen(false);
                          setIsGunghapSubStorageOpen(false);
                        }}
                        className="text-gray-400 hover:text-white text-sm font-bold px-1 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2.5 flex-1 flex flex-col min-h-0 overflow-hidden">
                      {/* 1. 이름 검색창 (고정) */}
                      <div className="relative shrink-0">
                        <input
                          type="text"
                          value={gunghapSearchTerm}
                          onChange={(e) => setGunghapSearchTerm(e.target.value)}
                          placeholder="이름 또는 메모 검색..."
                          className="w-full pl-8 pr-7 py-2 bg-navy border border-gray-700 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-400 transition"
                        />
                        <span className="absolute left-2.5 top-2.5 text-xs text-gray-400">🔍</span>
                        {gunghapSearchTerm && (
                          <button
                            onClick={() => setGunghapSearchTerm('')}
                            className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-white p-0.5"
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* 2. 보관함 그룹/카테고리 필터 (고정) */}
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 shrink-0">
                        {gunghapGroupOptions.map((grp) => (
                          <button
                            key={grp}
                            onClick={() => setGunghapSelectedGroup(grp)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer shrink-0 ${
                              gunghapSelectedGroup === grp
                                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                                : 'bg-navy/90 text-gray-400 hover:text-gray-200 border border-gray-800'
                            }`}
                          >
                            {grp}
                          </button>
                        ))}
                      </div>

                      {/* 3. 스크롤 가능한 사주 목록 */}
                      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 no-scrollbar pt-1 overscroll-contain">
                        {availableGunghapCandidates.length === 0 ? (
                          <div className="p-5 text-center text-xs text-gray-400 italic bg-navy/50 rounded-xl space-y-1 border border-gray-800/80">
                            <p>조건에 부합하는 저장된 사주가 없습니다.</p>
                            <p className="text-[10.5px] text-gray-500">검색어나 그룹 필터를 변경해 보세요.</p>
                          </div>
                        ) : (
                          availableGunghapCandidates.map((candidate) => {
                            const itemGroupTag = (!candidate.group || candidate.group === '미지정' || candidate.group.trim() === '') ? '일반' : candidate.group;
                            return (
                              <div
                                key={candidate.id}
                                className="p-2.5 rounded-xl bg-navy/90 border border-gray-800 hover:border-rose-400/50 hover:bg-rose-500/10 transition flex items-center justify-between text-xs gap-2 group"
                              >
                                <div className="truncate min-w-0 flex-1 space-y-0.5">
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className="font-bold text-white group-hover:text-rose-300 transition-colors truncate">
                                      {candidate.name}
                                    </span>
                                    <span className={`text-[9.5px] px-1.5 py-0.2 rounded shrink-0 font-medium ${
                                      itemGroupTag === '일반'
                                        ? 'bg-gray-800 text-gray-300 border border-gray-700'
                                        : 'bg-gray-800 text-amber-300/90 border border-amber-400/20'
                                    }`}>
                                      {itemGroupTag}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-gray-400 truncate">
                                    {candidate.birthYear}.{String(candidate.birthMonth).padStart(2, '0')}.{String(candidate.birthDay).padStart(2, '0')} · {candidate.gender === 'male' ? '남성' : '여성'}
                                  </div>
                                </div>
                                <button
                                  onClick={() => executeGunghap(gunghapSajuA, candidate)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[11px] shrink-0 shadow-sm transition cursor-pointer active:scale-95"
                                >
                                  선택
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* 하단 버튼들 (고정) */}
                    <div className="pt-2 flex items-center gap-2 shrink-0 border-t border-gray-800/80">
                      <button
                        onClick={() => setIsGunghapSubStorageOpen(false)}
                        className="flex-1 py-2 rounded-xl border border-gray-700 bg-navy text-amber-300 hover:text-amber-200 text-xs font-semibold transition cursor-pointer"
                      >
                        ← 이전
                      </button>
                      <button
                        onClick={() => {
                          setIsGunghapSelectModalOpen(false);
                          setIsGunghapSubStorageOpen(false);
                        }}
                        className="flex-1 py-2 rounded-xl border border-gray-800 bg-gray-800/80 text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                      >
                        닫기
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 궁합 결과 모달 */}
          {gunghapResultPair && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setGunghapResultPair(null)}
            >
              <div
                className="bg-[#131d33] border border-rose-400/60 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 relative text-left overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 상단 닫기 및 헤더 */}
                <div className="flex items-center justify-between border-b border-rose-400/20 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">💗</span>
                    <h3 className="text-sm font-extrabold text-white tracking-tight">
                      궁합 분석 결과
                    </h3>
                  </div>
                  <button
                    onClick={() => setGunghapResultPair(null)}
                    className="text-gray-400 hover:text-white text-sm font-bold px-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* 두 사람 비교 카드 & 점수 */}
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-rose-500/20 via-purple-500/10 to-rose-500/20 border border-rose-400/40 rounded-xl p-3.5 text-center space-y-1.5">
                    <div className="flex items-center justify-center gap-2 text-sm font-extrabold text-white">
                      <span>{gunghapResultPair.sajuA.name}</span>
                      <span className="text-rose-400 text-xs">❤️</span>
                      <span>{gunghapResultPair.sajuB.name}</span>
                    </div>
                    <div className="inline-block bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                      궁합 점수: {gunghapResultPair.score}점
                    </div>
                  </div>

                  {/* 3가지 주요 궁합 포인트 */}
                  <div className="bg-navy/80 border border-gray-800 rounded-xl p-3 space-y-2 text-xs">
                    <h4 className="font-bold text-amber-300 text-[11.5px] border-b border-gray-800 pb-1 flex items-center gap-1">
                      <span>✨</span>
                      <span>사주 본질 궁합 포인트</span>
                    </h4>
                    <ul className="space-y-1.5 text-gray-200 text-[11px] leading-relaxed">
                      {gunghapResultPair.points.map((pt, idx) => (
                        <li key={idx} className="bg-gray-800/40 p-2 rounded-lg border border-gray-800/80">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 총평 한줄 */}
                  <div className="bg-rose-500/10 border border-rose-400/30 rounded-xl p-3 text-center text-xs text-rose-200 leading-relaxed font-medium">
                    {gunghapResultPair.summary}
                  </div>
                </div>

                <button
                  onClick={() => setGunghapResultPair(null)}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-md shadow-rose-900/40 active:scale-95"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {/* 궁합 대표사주 선택 모달 */}
          {isSelectGunghapRepModalOpen && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
              onClick={() => setIsSelectGunghapRepModalOpen(false)}
            >
              <div
                className="bg-navy border border-gray-700/80 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-3.5 relative max-h-[85vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. 상단 헤더 */}
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👑</span>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">궁합 대표사주 선택</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">궁합 분석의 기준이 될 본인을 선택해주세요.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSelectGunghapRepModalOpen(false)}
                    className="text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* 2. 검색창 & 그룹 필터/정렬 옵션 */}
                <div className="space-y-2.5 shrink-0">
                  {/* 검색창 */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="이름 또는 메모 검색..."
                      value={gunghapRepSearchTerm}
                      onChange={(e) => setGunghapRepSearchTerm(e.target.value)}
                      className="w-full bg-[#131d33] border border-gray-700/80 rounded-xl pl-8 pr-7 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 transition shadow-inner"
                    />
                    <svg
                      className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {gunghapRepSearchTerm && (
                      <button
                        onClick={() => setGunghapRepSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* 그룹 필터 & 정렬 선택 */}
                  <div className="flex items-center gap-2">
                    {/* 그룹 필터 인라인 드롭다운 */}
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsGunghapRepGroupDropdownOpen(!isGunghapRepGroupDropdownOpen);
                          setIsGunghapRepSortDropdownOpen(false);
                        }}
                        className="w-full bg-[#131d33] border border-gray-700/80 hover:border-amber-400/60 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold focus:outline-none transition cursor-pointer flex items-center justify-between shadow-inner"
                      >
                        <span className="truncate">
                          {gunghapRepSelectedGroup === '전체' ? '전체 그룹' : gunghapRepSelectedGroup}
                        </span>
                        <svg className={`w-3 h-3 text-amber-400 shrink-0 ml-1 transition-transform ${isGunghapRepGroupDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isGunghapRepGroupDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setIsGunghapRepGroupDropdownOpen(false)} />
                          <div className="absolute left-0 mt-1 w-full min-w-[120px] max-h-56 overflow-y-auto bg-[#131d33] border border-amber-500/50 rounded-xl shadow-2xl z-30 py-1 no-scrollbar animate-fadeIn">
                            {['전체', ...customGroups, '일반'].map((grp) => {
                              const isSelected = gunghapRepSelectedGroup === grp;
                              const cStyle = grp === '전체' ? null : getGroupColorStyle(grp);
                              return (
                                <button
                                  key={grp}
                                  type="button"
                                  onClick={() => {
                                    setGunghapRepSelectedGroup(grp);
                                    setIsGunghapRepGroupDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer flex items-center justify-between ${
                                    isSelected
                                      ? 'bg-amber-400/20 text-amber-300 font-bold'
                                      : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    {cStyle && (
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cStyle.borderHex }} />
                                    )}
                                    <span className="truncate">{grp}</span>
                                  </div>
                                  {isSelected && (
                                    <span className="text-amber-400 text-xs font-bold shrink-0 ml-1">✓</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    {/* 정렬 옵션 인라인 드롭다운 */}
                    <div className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsGunghapRepSortDropdownOpen(!isGunghapRepSortDropdownOpen);
                          setIsGunghapRepGroupDropdownOpen(false);
                        }}
                        className="w-full bg-[#131d33] border border-gray-700/80 hover:border-amber-400/60 rounded-xl px-2.5 py-2 text-xs text-amber-300 font-bold focus:outline-none transition cursor-pointer flex items-center justify-between shadow-inner"
                      >
                        <span className="truncate">
                          {gunghapRepSortOption === 'latestSave' && '최근 저장순'}
                          {gunghapRepSortOption === 'nameAsc' && '이름순'}
                          {gunghapRepSortOption === 'birthAsc' && '생년월일순'}
                          {gunghapRepSortOption === 'latestView' && '최근 검색순'}
                        </span>
                        <svg className={`w-3 h-3 text-amber-400 shrink-0 ml-1 transition-transform ${isGunghapRepSortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {isGunghapRepSortDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-20" onClick={() => setIsGunghapRepSortDropdownOpen(false)} />
                          <div className="absolute right-0 mt-1 w-full min-w-[125px] bg-[#131d33] border border-amber-500/50 rounded-xl shadow-2xl z-30 py-1 overflow-hidden animate-fadeIn">
                            {[
                              { key: 'latestSave', label: '최근 저장순' },
                              { key: 'nameAsc', label: '이름순' },
                              { key: 'birthAsc', label: '생년월일순' },
                              { key: 'latestView', label: '최근 검색순' },
                            ].map((opt) => (
                              <button
                                key={opt.key}
                                type="button"
                                onClick={() => {
                                  setGunghapRepSortOption(opt.key as any);
                                  setIsGunghapRepSortDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs transition cursor-pointer flex items-center justify-between ${
                                  gunghapRepSortOption === opt.key
                                    ? 'bg-amber-400/20 text-amber-300 font-bold'
                                    : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
                                }`}
                              >
                                <span>{opt.label}</span>
                                {gunghapRepSortOption === opt.key && (
                                  <span className="text-amber-400 text-xs font-bold">✓</span>
                                )}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. 스크롤 가능한 사주 목록 */}
                <div className="flex-1 overflow-y-auto space-y-2.5 no-scrollbar pr-0.5 pt-1">
                  {filteredGunghapRepList.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center my-auto">
                      <div className="w-12 h-12 rounded-2xl bg-[#131d33] border border-amber-400/20 flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-2xl">🔍</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                        {savedSajuList.length === 0
                          ? '보관함에 저장된 사주가 없습니다. 먼저 사주분석 화면에서 사주를 저장해주세요.'
                          : '검색어 또는 선택한 그룹 조건에 부합하는 사주가 없습니다.'}
                      </p>
                      {savedSajuList.length === 0 && (
                        <button
                          onClick={() => {
                            setIsSelectGunghapRepModalOpen(false);
                            setActiveTab('saju');
                          }}
                          className="mt-3 px-4 py-2 bg-amber-400 text-black font-extrabold text-xs rounded-xl hover:bg-amber-300 transition cursor-pointer shadow-md"
                        >
                          🔮 사주 분석하러 가기
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredGunghapRepList.map((item) => {
                      const isSelected = gunghapRepresentativeSaju?.id === item.id;
                      const calendarShort = item.calendar.includes('윤달') ? '음-윤달' : item.calendar.includes('음') ? '음' : '양';
                      const itemGroupTag = (!item.group || item.group === '미지정' || item.group.trim() === '') ? '일반' : item.group;
                      const cStyle = getGroupColorStyle(itemGroupTag);

                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setPendingGunghapRepItem(item);
                          }}
                          className={`rounded-xl p-3.5 shadow-md space-y-2 transition duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-2 border-amber-400 shadow-amber-400/10'
                              : 'bg-[#131d33] border border-gray-800/90 hover:border-amber-400/30'
                          }`}
                        >
                          {/* 첫 줄: 이름, 그룹 태그, 대표 표시 및 선택 버튼 */}
                          <div className="flex items-center justify-between gap-2 border-b border-gray-800/60 pb-2">
                            <div className="flex items-center gap-1.5 flex-wrap min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-white tracking-tight truncate">{item.name}</h3>
                              <span
                                className="text-[10.5px] px-2.5 py-0.5 rounded-md font-extrabold shrink-0 border"
                                style={{
                                  backgroundColor: cStyle.bgHex,
                                  color: cStyle.textHex,
                                  borderColor: cStyle.borderHex,
                                }}
                              >
                                {itemGroupTag}
                              </span>
                              {isSelected && (
                                <span className="bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded-md text-[10.5px] shadow-sm shrink-0">
                                  📌 현재 대표
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPendingGunghapRepItem(item);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                                  : 'bg-gray-800 hover:bg-amber-400 text-gray-200 hover:text-black border border-gray-700 hover:border-amber-400 active:scale-95'
                              }`}
                            >
                              {isSelected ? '선택됨' : '선택'}
                            </button>
                          </div>

                          {/* 두 번째 줄: 생년월일 | 성별 | 시간 */}
                          <div className="flex items-center gap-1.5 text-xs text-gray-300">
                            <span className="text-amber-400 shrink-0">📅</span>
                            <span className="truncate">
                              {item.birthYear}.{String(item.birthMonth).padStart(2, '0')}.{String(item.birthDay).padStart(2, '0')}({calendarShort})
                              {' '}<span className="text-gray-600">|</span>{' '}
                              {item.gender === 'male' ? '남성' : '여성'}
                              {' '}<span className="text-gray-600">|</span>{' '}
                              {item.isUnknownTime ? '시간 모름' : item.birthTime}
                            </span>
                          </div>

                          {/* 세 번째 줄: 메모 */}
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="text-amber-400 shrink-0">💬</span>
                            {item.memo ? (
                              <span className="text-gray-200 truncate font-normal">{item.memo}</span>
                            ) : (
                              <span className="text-gray-500 italic font-normal">등록된 메모 없음</span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* 4. 하단 버튼 영역 */}
                <div className="pt-2.5 border-t border-gray-800/80 space-y-2 shrink-0">
                  {gunghapRepSajuId && (
                    <button
                      onClick={() => setIsUnlinkGunghapRepConfirmOpen(true)}
                      className="w-full py-2.5 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 text-xs font-extrabold transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                    >
                      <span>🔓</span>
                      <span>대표사주 해제</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsSelectGunghapRepModalOpen(false)}
                    className="w-full py-2.5 rounded-xl border border-gray-700 bg-[#131d33] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 궁합 대표사주 해제 확인 모달 */}
          {isUnlinkGunghapRepConfirmOpen && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn"
              onClick={() => setIsUnlinkGunghapRepConfirmOpen(false)}
            >
              <div
                className="bg-[#131d33] border border-rose-500/60 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <span className="text-xl">⚠️</span>
                  <h3 className="text-sm font-extrabold text-white">대표사주를 해제하시겠습니까?</h3>
                </div>

                <p className="text-xs text-gray-300 font-medium leading-relaxed">
                  현재 설정된 대표사주가 해제되며, 새로운 대표사주를 다시 설정하기 전까지 궁합을 이용할 수 없습니다.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => setIsUnlinkGunghapRepConfirmOpen(false)}
                    className="py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setGunghapRepSajuId(null);
                      setIsUnlinkGunghapRepConfirmOpen(false);
                      setIsSelectGunghapRepModalOpen(false);
                      setSelectedGunghapTargetId(null);
                      setGunghapViewStep('main');
                    }}
                    className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition cursor-pointer shadow-md active:scale-95"
                  >
                    해제
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 궁합 대표사주 선택 확인 모달 */}
          {pendingGunghapRepItem && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[65] p-4 animate-fadeIn"
              onClick={() => setPendingGunghapRepItem(null)}
            >
              <div
                className="bg-[#131d33] border border-amber-400/60 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <span className="text-xl">👑</span>
                  <h3 className="text-sm font-extrabold text-white">이 사람을 대표사주로 선택하시겠습니까?</h3>
                </div>

                <p className="text-xs text-gray-300 font-medium leading-relaxed">
                  <span className="text-amber-300 font-bold">「{pendingGunghapRepItem.name}」</span>님을 궁합 대표사주로 설정합니다.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => setPendingGunghapRepItem(null)}
                    className="py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      setGunghapRepSajuId(pendingGunghapRepItem.id);
                      setPendingGunghapRepItem(null);
                      setIsSelectGunghapRepModalOpen(false);
                    }}
                    className="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-extrabold transition cursor-pointer shadow-md active:scale-95"
                  >
                    선택
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 원국 정밀 사주분석 실행 확인 모달 */}
          {isWongukConfirmModalOpen && gunghapRepresentativeSaju && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-fadeIn"
              onClick={() => setIsWongukConfirmModalOpen(false)}
            >
              <div
                className="bg-[#131d33] border border-purple-500/60 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <span className="text-xl">☯️</span>
                  <h3 className="text-sm font-extrabold text-white">
                    [{gunghapRepresentativeSaju.name}] 님의 상세 사주분석을 진행할까요?
                  </h3>
                </div>

                <div className="bg-navy p-3 rounded-xl border border-gray-800 space-y-1.5 text-xs text-gray-300">
                  <p className="font-semibold text-purple-300">
                    ✨ 약 4,000자 분량의 정밀 상세 사주분석 보고서가 생성됩니다.
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    · 최초 2회 무료 제공 (현재 {remainingFreeWongukCount}회 남음)<br />
                    · 생성된 결과는 보관함에 180일간 안전하게 보관됩니다.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setIsWongukConfirmModalOpen(false)}
                    className="py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={startWongukAnalysis}
                    className="py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold transition cursor-pointer shadow-md shadow-purple-900/40 active:scale-95"
                  >
                    분석 시작하기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 원국 사주분석 리포트 생성 로딩 모달 */}
          {isGeneratingWonguk && (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-[70] p-6 text-center space-y-4 animate-fadeIn">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-400 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-xl">☯️</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-extrabold text-white">사주 원국 정밀 분석 리포트 생성 중...</h3>
                <p className="text-xs text-purple-300 font-medium">
                  사주 4기둥의 십성, 오행, 신살 기운을 깊이 있게 종합 해독하고 있습니다.
                </p>
                <p className="text-[11px] text-gray-400">약 4,000자 분량의 맞춤 보고서를 작성하고 있습니다. 잠시만 기다려 주세요.</p>
              </div>
            </div>
          )}

          {/* 원국 사주분석 결과 전체 화면 뷰 모달 */}
          {currentWongukDetail && (() => {
            const modalBadge = getWongukBadgeInfo(currentWongukDetail);
            const modalBirthStr = currentWongukDetail.birthYear
              ? `${currentWongukDetail.birthYear}.${String(currentWongukDetail.birthMonth).padStart(2, '0')}.${String(currentWongukDetail.birthDay).padStart(2, '0')}`
              : '';
            return (
              <div
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[80] flex items-center justify-center p-3 sm:p-5 animate-fadeIn"
                onClick={() => setCurrentWongukDetail(null)}
              >
                <div
                  className="bg-[#0a0f1d] border border-purple-500/50 rounded-2xl w-full max-w-lg h-[90vh] flex flex-col shadow-2xl overflow-hidden relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 상단 헤더 */}
                  <div className="px-4 py-3.5 border-b border-gray-800 bg-[#131d33] flex items-center justify-between shrink-0">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span className="text-lg shrink-0 mt-0.5">☯️</span>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border tracking-tight ${modalBadge.className}`}>
                            {modalBadge.label}
                          </span>
                          <h3 className="text-sm font-extrabold text-white truncate">
                            {currentWongukDetail.sajuName}
                          </h3>
                        </div>
                        <p className="text-[10.5px] text-gray-400 font-medium">
                          👤 {modalBirthStr ? `${modalBirthStr} ` : ''}(생성일 {currentWongukDetail.createdAt}) · ⏳ 180일 보관
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentWongukDetail(null)}
                      className="text-gray-400 hover:text-white text-base font-bold p-1 cursor-pointer ml-2"
                    >
                      ✕
                    </button>
                  </div>

                {/* 본문 스크롤 영역 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-gray-200 no-scrollbar">
                  {/* 요약 박스 */}
                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-xl p-3.5 space-y-1">
                    <span className="text-[10.5px] font-bold text-purple-300 block">✨ 사주 원국 핵심 요약</span>
                    <p className="text-xs text-purple-100 font-medium leading-relaxed">
                      {currentWongukDetail.summary}
                    </p>
                  </div>

                  {/* 1. 전체 사주 총평 */}
                  <div className="bg-[#131d33] border border-gray-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-purple-300 text-xs border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
                      <span>📜</span>
                      <span>1. 사주 원국 총평 및 타고난 핵심 본질</span>
                    </h4>
                    <p className="text-gray-300 text-[11.5px] whitespace-pre-wrap leading-relaxed">
                      {currentWongukDetail.overall}
                    </p>
                  </div>

                  {/* 2. 십성과 오행 정밀 해독 */}
                  <div className="bg-[#131d33] border border-gray-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-purple-300 text-xs border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
                      <span>☯️</span>
                      <span>2. 십성(十神)과 오행(五行) 정밀 해독</span>
                    </h4>
                    <p className="text-gray-300 text-[11.5px] whitespace-pre-wrap leading-relaxed">
                      {currentWongukDetail.tenGodsAndElements}
                    </p>
                  </div>

                  {/* 3. 타고난 재물운 및 직업적 적성 */}
                  <div className="bg-[#131d33] border border-gray-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-purple-300 text-xs border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
                      <span>💰</span>
                      <span>3. 타고난 재물운 및 직업적 적성</span>
                    </h4>
                    <p className="text-gray-300 text-[11.5px] whitespace-pre-wrap leading-relaxed">
                      {currentWongukDetail.wealthAndCareer}
                    </p>
                  </div>

                  {/* 4. 애정운과 인간관계 및 인복 */}
                  <div className="bg-[#131d33] border border-gray-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-purple-300 text-xs border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
                      <span>🤝</span>
                      <span>4. 애정운과 인간관계 및 인복</span>
                    </h4>
                    <p className="text-gray-300 text-[11.5px] whitespace-pre-wrap leading-relaxed">
                      {currentWongukDetail.loveAndRelations}
                    </p>
                  </div>

                  {/* 5. 삶의 대운 흐름 및 대길 지혜 */}
                  <div className="bg-[#131d33] border border-gray-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-purple-300 text-xs border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
                      <span>🌊</span>
                      <span>5. 삶의 대운 흐름 및 대길(大吉) 지혜</span>
                    </h4>
                    <p className="text-gray-300 text-[11.5px] whitespace-pre-wrap leading-relaxed">
                      {currentWongukDetail.lifeFlowAndAdvice}
                    </p>
                  </div>

                  {/* 6. 핵심 분석 포인트 */}
                  <div className="bg-[#131d33] border border-gray-800 rounded-xl p-4 space-y-2">
                    <h4 className="font-bold text-amber-300 text-xs border-b border-gray-800 pb-1.5 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>6. 핵심 사주 분석 포인트</span>
                    </h4>
                    <ul className="space-y-2 text-gray-200 text-[11px] leading-relaxed">
                      {currentWongukDetail.keyPoints.map((pt, idx) => (
                        <li key={idx} className="bg-navy/80 p-2.5 rounded-lg border border-purple-500/20 text-purple-200">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 하단 고정 액션 버튼 (다운로드, 닫기) */}
                <div className="p-3 border-t border-gray-800 bg-[#131d33] flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => downloadWongukPdf(currentWongukDetail)}
                    className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <span>📥</span>
                    <span>PDF 다운로드</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentWongukDetail(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

          {/* 사주분석 결과 삭제 확인 모달 */}
          {singleWongukToDelete && (
            <div
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[85] p-4 animate-fadeIn"
              onClick={() => setSingleWongukToDelete(null)}
            >
              <div
                className="bg-[#131d33] border border-rose-500/60 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4 relative text-left"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
                  <span className="text-xl">🗑️</span>
                  <h3 className="text-sm font-extrabold text-white">사주분석 결과를 삭제하시겠습니까?</h3>
                </div>

                <p className="text-xs text-gray-300 font-medium leading-relaxed">
                  <span className="text-purple-300 font-bold">[{singleWongukToDelete.sajuName}]</span> 님의 사주 상세분석 기록이 보관함에서 완전히 삭제됩니다.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setSingleWongukToDelete(null)}
                    className="py-2.5 rounded-xl border border-gray-700 bg-navy text-gray-300 hover:text-white text-xs font-semibold transition cursor-pointer"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSavedWongukList(prev => prev.filter(i => i.id !== singleWongukToDelete.id));
                      setSingleWongukToDelete(null);
                    }}
                    className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition cursor-pointer shadow-md active:scale-95"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
