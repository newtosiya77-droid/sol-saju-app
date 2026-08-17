import React, { useState } from 'react';
import { SajuAnalysisResult } from '../types';
import { DEFAULT_WON_GUK, getJijangganList, getPillarSinsalGilsin } from '../data/sajuCalculations';

interface Props {
  result: SajuAnalysisResult;
  onRestart: () => void;
  activeFilter?: 'all' | 'action' | 'wuxing' | 'daewoon';
  onFilterChange?: (filter: 'all' | 'action' | 'wuxing' | 'daewoon') => void;
}

export const SajuResultView: React.FC<Props> = ({
  result,
  onRestart,
  activeFilter: activeFilterProp,
  onFilterChange,
}) => {
  const [openAccordion, setOpenAccordion] = useState<'year' | 'month' | 'day' | 'time' | null>('year');
  const [localActiveFilter, setLocalActiveFilter] = useState<'all' | 'action' | 'wuxing' | 'daewoon'>('all');
  const [copied, setCopied] = useState(false);

  const activeFilter = activeFilterProp !== undefined ? activeFilterProp : localActiveFilter;

  const handleFilterClick = (filter: 'all' | 'action' | 'wuxing' | 'daewoon') => {
    setLocalActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
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

  const toggleAccordion = (target: 'year' | 'month' | 'day' | 'time') => {
    setOpenAccordion(openAccordion === target ? null : target);
  };

  const handleShare = () => {
    const text = `🖤 [Killer Match] ${result.matchPercentage}% 사주 일치!\n👤 ${result.celebName} (${result.celebOccupation})\n✨ 찰떡 사주 포인트:\n - ${result.sajuPoints[0]}\n - ${result.sajuPoints[1]}\n - ${result.sajuPoints[2]}\n📜 ${result.summary}\n#SOLAI만세력 #MZ사주 #만세력`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hourPillar = result?.wonGuk?.hourPillar || DEFAULT_WON_GUK.hourPillar;
  const dayPillar = result?.wonGuk?.dayPillar || DEFAULT_WON_GUK.dayPillar;
  const monthPillar = result?.wonGuk?.monthPillar || DEFAULT_WON_GUK.monthPillar;
  const yearPillar = result?.wonGuk?.yearPillar || DEFAULT_WON_GUK.yearPillar;

  const isUnknownTime = !!result?.isUnknownTime;

  const hourJijanggan = isUnknownTime ? [] : getJijangganList(hourPillar.branch);
  const dayJijanggan = getJijangganList(dayPillar.branch);
  const monthJijanggan = getJijangganList(monthPillar.branch);
  const yearJijanggan = getJijangganList(yearPillar.branch);

  const wonGukCtx = {
    yearBranch: yearPillar.branch,
    monthBranch: monthPillar.branch,
    dayBranch: dayPillar.branch,
    hourBranch: hourPillar.branch,
  };

  const hourSG = isUnknownTime
    ? { sinsal: [], gilsin: [] }
    : getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, hourPillar.stem, hourPillar.branch, 'hour', wonGukCtx);
  const daySG = getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, dayPillar.stem, dayPillar.branch, 'day', wonGukCtx);
  const monthSG = getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, monthPillar.stem, monthPillar.branch, 'month', wonGukCtx);
  const yearSG = getPillarSinsalGilsin(dayPillar.stem, dayPillar.branch, yearPillar.stem, yearPillar.branch, 'year', wonGukCtx);

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-2.5 space-y-3.5 no-scrollbar">
      
      {/* 상단 헤더 */}
      <div className="px-5 pt-4 pb-2.5 flex justify-between items-center border-b border-gray-800/80 -mx-4 -mt-2.5 mb-1 bg-navy sticky top-0 z-10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            {/* 다이아몬드 메인 로고 심볼 */}
            <span className="text-gold flex items-center">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
                <path d="M6 3H18L21 8L12 21L3 8L6 3Z" fill="currentColor" fillOpacity="0.25"/>
                <path d="M6 3H18M3 8H21M9 3L12 21L15 3" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M6 3L9 8L12 3L15 8L18 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 8L12 21L18 8" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
            </span>
            <h1 className="text-base font-bold text-white tracking-wide">SOL AI 만세력</h1>
            <span className="bg-gray-800 text-gray-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-gray-700">v2.5</span>
          </div>
          <p className="text-xs text-gray-300">
            {result.userName || '김지훈'} 님 ({result.birthYear || 1992}.{String(result.birthMonth || 5).padStart(2, '0')}.{String(result.birthDay || 20)} {result.calendarType === 'lunar' ? '음' : '양'} · {result.gender === 'female' ? '여성' : '남성'})
          </p>
        </div>
        <button
          onClick={onRestart}
          className="text-xs text-gold hover:underline transition font-semibold"
        >
          🔄 다시 입력
        </button>
      </div>

      {/* MZ 셀럽 Killer Match 카드 */}
      <div className="bg-gradient-to-b from-card to-[#0e1526] border border-gold/40 rounded-xl p-3.5 text-center shadow-[0_0_20px_rgba(212,175,55,0.12)] relative overflow-hidden space-y-2.5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500"></div>

        <div className="inline-block bg-gold/15 border border-gold/40 px-3 py-1 rounded-full text-gold font-extrabold text-xs tracking-wide">
          🖤 [Killer Match] {result.matchPercentage}% 사주 일치!
        </div>

        <div>
          <h2 className="text-xl font-black text-white">
            👤 {result.celebName} <span className="text-xs font-normal text-gray-400">({result.celebOccupation})</span>
          </h2>
          <p className="text-[11px] text-amber-300 font-medium mt-0.5">
            30대 이하 동성 셀럽 사주 매칭
          </p>
        </div>

        {/* ✨ 셀럽과 찰떡인 사주 포인트 */}
        <div className="bg-navy/70 border border-gray-800 rounded-lg p-2.5 text-left space-y-1.5">
          <h3 className="text-xs font-bold text-gold flex items-center gap-1">
            ✨ [셀럽과 찰떡인 사주 포인트]
          </h3>
          <ul className="space-y-1 text-xs text-gray-200">
            {result.sajuPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="text-gold font-bold shrink-0">•</span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 📜 총평 및 한 줄 메시지 */}
        <div className="bg-navy/70 border border-gray-800 rounded-lg p-2.5 text-left space-y-1">
          <h3 className="text-xs font-bold text-gold">📜 [사주 본질 총평 및 한 줄 메시지]</h3>
          <p className="text-xs text-gray-200 leading-relaxed font-normal">{result.summary}</p>
        </div>

        <button
          onClick={handleShare}
          className="w-full bg-gold text-black font-bold py-2 rounded-lg text-xs shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:brightness-110 transition active:scale-[0.98]"
        >
          {copied ? '✅ 분석 결과 복사 완료!' : '📤 분석 결과 복사 & 공유하기'}
        </button>
      </div>

      {/* 1. 만세력 표 */}
      <div className="bg-card border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-navy/90 text-xs text-gray-200 border-b border-gray-800">
              <th className="py-3 px-1 font-semibold w-14 text-gray-200">구분</th>
              <th className="py-3 px-1 font-semibold text-gray-200">시주</th>
              <th className="py-3 px-1 font-semibold text-gold bg-gold/10">일주</th>
              <th className="py-3 px-1 font-semibold text-gray-200">월주</th>
              <th className="py-3 px-1 font-semibold text-gray-200">년주</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60 text-sm">
            {/* 천간 */}
            <tr>
              <td className="py-3 text-xs font-medium text-gray-200 bg-navy/40">천간</td>
              <td className="py-3 font-bold text-base">
                {isUnknownTime ? (
                  <span className="text-gray-500 text-xs">-</span>
                ) : (
                  <>
                    <span className={getElementTextColor(hourPillar.elementStem)}>{hourPillar.stemHanja}({hourPillar.stem})</span>
                    <span className="block text-xs text-gray-300 font-medium mt-1">{hourPillar.tenGodStem}</span>
                  </>
                )}
              </td>
              <td className="py-3 font-extrabold text-base bg-gold/10">
                <span className={getElementTextColor(dayPillar.elementStem)}>{dayPillar.stemHanja}({dayPillar.stem})</span>
                <span className="block text-xs text-gold font-bold mt-1">{dayPillar.tenGodStem || '비견'}</span>
              </td>
              <td className="py-3 font-bold text-base">
                <span className={getElementTextColor(monthPillar.elementStem)}>{monthPillar.stemHanja}({monthPillar.stem})</span>
                <span className="block text-xs text-gray-300 font-medium mt-1">{monthPillar.tenGodStem}</span>
              </td>
              <td className="py-3 font-bold text-base">
                <span className={getElementTextColor(yearPillar.elementStem)}>{yearPillar.stemHanja}({yearPillar.stem})</span>
                <span className="block text-xs text-gray-300 font-medium mt-1">{yearPillar.tenGodStem}</span>
              </td>
            </tr>
            {/* 지지 */}
            <tr>
              <td className="py-3 text-xs font-medium text-gray-200 bg-navy/40">지지</td>
              <td className="py-3 font-bold text-base">
                {isUnknownTime ? (
                  <span className="text-gray-500 text-xs">-</span>
                ) : (
                  <>
                    <span className={getElementTextColor(hourPillar.elementBranch)}>{hourPillar.branchHanja}({hourPillar.branch})</span>
                    <span className="block text-xs text-gray-300 font-medium mt-1">{hourPillar.tenGodBranch}</span>
                  </>
                )}
              </td>
              <td className="py-3 font-extrabold text-base bg-gold/10">
                <span className={getElementTextColor(dayPillar.elementBranch)}>{dayPillar.branchHanja}({dayPillar.branch})</span>
                <span className="block text-xs text-gold font-bold mt-1">{dayPillar.tenGodBranch}</span>
              </td>
              <td className="py-3 font-bold text-base">
                <span className={getElementTextColor(monthPillar.elementBranch)}>{monthPillar.branchHanja}({monthPillar.branch})</span>
                <span className="block text-xs text-gray-300 font-medium mt-1">{monthPillar.tenGodBranch}</span>
              </td>
              <td className="py-3 font-bold text-base">
                <span className={getElementTextColor(yearPillar.elementBranch)}>{yearPillar.branchHanja}({yearPillar.branch})</span>
                <span className="block text-xs text-gray-300 font-medium mt-1">{yearPillar.tenGodBranch}</span>
              </td>
            </tr>
            {/* 지장간 */}
            <tr className="bg-navy/20">
              <td className="py-3 text-xs font-medium text-gray-200 bg-navy/40">지장간</td>
              <td className="py-3 text-gray-200 leading-tight">
                {isUnknownTime ? (
                  <span className="text-gray-500 text-xs">-</span>
                ) : (
                  <>
                    <span className="block text-sm font-bold">{hourJijanggan.map(j => j.hanja).join('·')}</span>
                    <span className="text-xs text-gray-300 block mt-1 font-medium">{hourJijanggan.map(j => j.kor).join('·')}</span>
                  </>
                )}
              </td>
              <td className="py-3 text-gold font-medium bg-gold/10 leading-tight">
                <span className="block text-sm font-extrabold">{dayJijanggan.map(j => j.hanja).join('·')}</span>
                <span className="text-xs text-gold/90 block mt-1 font-semibold">{dayJijanggan.map(j => j.kor).join('·')}</span>
              </td>
              <td className="py-3 text-gray-200 leading-tight">
                <span className="block text-sm font-bold">{monthJijanggan.map(j => j.hanja).join('·')}</span>
                <span className="text-xs text-gray-300 block mt-1 font-medium">{monthJijanggan.map(j => j.kor).join('·')}</span>
              </td>
              <td className="py-3 text-gray-200 leading-tight">
                <span className="block text-sm font-bold">{yearJijanggan.map(j => j.hanja).join('·')}</span>
                <span className="text-xs text-gray-300 block mt-1 font-medium">{yearJijanggan.map(j => j.kor).join('·')}</span>
              </td>
            </tr>
            {/* 신살 행 */}
            <tr>
              <td className="py-3 text-xs font-medium text-gray-200 bg-navy/40">신살</td>
              <td className="py-3 px-1 align-middle">
                {hourSG.sinsal.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {hourSG.sinsal.map((s, i) => (
                      <span key={i} className="bg-orange-500/25 text-orange-200 border border-orange-500/40 px-2 py-0.5 rounded text-xs font-medium">{s}</span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-3 px-1 text-gold font-semibold bg-gold/10 align-middle">
                {daySG.sinsal.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {daySG.sinsal.map((s, i) => (
                      <span key={i} className="bg-orange-500/25 text-orange-200 border border-orange-500/40 px-2 py-0.5 rounded text-xs font-medium">{s}</span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-3 px-1 align-middle">
                {monthSG.sinsal.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {monthSG.sinsal.map((s, i) => (
                      <span key={i} className="bg-orange-500/25 text-orange-200 border border-orange-500/40 px-2 py-0.5 rounded text-xs font-medium">{s}</span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-3 px-1 align-middle">
                {yearSG.sinsal.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {yearSG.sinsal.map((s, i) => (
                      <span key={i} className="bg-orange-500/25 text-orange-200 border border-orange-500/40 px-2 py-0.5 rounded text-xs font-medium">{s}</span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
            {/* 길신 행 */}
            <tr>
              <td className="py-3 text-xs font-medium text-gray-200 bg-navy/40">길신</td>
              <td className="py-3 px-1 align-middle">
                {hourSG.gilsin.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {hourSG.gilsin.map((g, i) => (
                      <span key={i} className="bg-purple-500/25 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded text-xs font-medium">{g}</span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-3 px-1 text-gold font-semibold bg-gold/10 align-middle">
                {daySG.gilsin.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {daySG.gilsin.map((g, i) => (
                      <span key={i} className="bg-purple-500/25 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded text-xs font-medium">{g}</span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-3 px-1 align-middle">
                {monthSG.gilsin.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {monthSG.gilsin.map((g, i) => (
                      <span key={i} className="bg-purple-500/25 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded text-xs font-medium">{g}</span>
                    ))}
                  </div>
                )}
              </td>
              <td className="py-3 px-1 align-middle">
                {yearSG.gilsin.length === 0 ? (
                  <span className="text-xs text-gray-500">-</span>
                ) : (
                  <div className="flex flex-col gap-1.5 items-center">
                    {yearSG.gilsin.map((g, i) => (
                      <span key={i} className="bg-purple-500/25 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded text-xs font-medium">{g}</span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 2. 필터 칩 (4개 탭 균등 분할 및 터치 영역/실버 테두리 적용) */}
      <div className="grid grid-cols-4 gap-2 w-full mt-1 mb-4.5">
        <button
          onClick={() => handleFilterClick('all')}
          className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
              : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
          }`}
        >
          종합 분석
        </button>
        <button
          onClick={() => handleFilterClick('action')}
          className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
            activeFilter === 'action'
              ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
              : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
          }`}
        >
          사주작용력
        </button>
        <button
          onClick={() => handleFilterClick('wuxing')}
          className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
            activeFilter === 'wuxing'
              ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
              : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
          }`}
        >
          오행 분포
        </button>
        <button
          onClick={() => handleFilterClick('daewoon')}
          className={`w-full py-2 px-0.5 rounded-full text-[12px] font-extrabold transition-all duration-200 cursor-pointer text-center flex items-center justify-center whitespace-nowrap ${
            activeFilter === 'daewoon'
              ? 'bg-[#D4AF37] text-black border border-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
              : 'bg-[#1e293b] border-[1.5px] border-slate-400 text-[#f1f5f9] hover:border-slate-200 hover:text-white'
          }`}
        >
          대운 흐름
        </button>
      </div>

      {/* 3. 하단 기둥별 아코디언 심층 분석 섹션 */}
      <div className="space-y-2 pb-1" id="accordion-group">
        
        {/* 년주 아코디언 */}
        <div className={`bg-card border rounded-xl overflow-hidden shadow transition ${openAccordion === 'year' ? 'border-gold/50' : 'border-gray-800'}`}>
          <button
            onClick={() => toggleAccordion('year')}
            className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none ${openAccordion === 'year' ? 'bg-gold/10' : ''}`}
          >
            <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-purple-400 inline-block"></span>
              [년주] 초년운 상세 분석 ({yearPillar.stem}{yearPillar.branch})
            </span>
            <svg id="icon-year" className={`w-4 h-4 text-gray-300 transform transition-transform duration-200 ${openAccordion === 'year' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {openAccordion === 'year' && (
            <div id="content-year" className="px-3.5 pb-3.5 text-xs text-gray-200 space-y-2 border-t border-gray-800/80 pt-2.5">
              <div><span className="text-purple-300 font-semibold">• 천간 십성:</span> {yearPillar.tenGodStem} 기운이 작용합니다.</div>
              <div><span className="text-purple-300 font-semibold">• 지지 십성:</span> {yearPillar.tenGodBranch} 기운이 초년 기반을 지지합니다.</div>
              {yearSG.gilsin.length > 0 && (
                <div><span className="text-purple-300 font-semibold">• 길신:</span> {yearSG.gilsin.join(', ')} 길성이 보살펴줍니다.</div>
              )}
              {yearSG.sinsal.length > 0 && (
                <div><span className="text-orange-300 font-semibold">• 신살:</span> {yearSG.sinsal.join(', ')} 기운이 작용합니다.</div>
              )}
              <div><span className="text-emerald-400 font-semibold">• 총평:</span> 조상의 덕과 초년 시절의 환경이 어우러져 안정적인 성장 기반을 형성하는 시기입니다.</div>
            </div>
          )}
        </div>

        {/* 월주 아코디언 */}
        <div className={`bg-card border rounded-xl overflow-hidden shadow transition ${openAccordion === 'month' ? 'border-gold/50' : 'border-gray-800'}`}>
          <button
            onClick={() => toggleAccordion('month')}
            className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none ${openAccordion === 'month' ? 'bg-gold/10' : ''}`}
          >
            <span className="text-xs font-bold text-blue-300 flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-blue-400 inline-block"></span>
              [월주] 청년운 상세 분석 ({monthPillar.stem}{monthPillar.branch})
            </span>
            <svg id="icon-month" className={`w-4 h-4 text-blue-300 transform transition-transform duration-200 ${openAccordion === 'month' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {openAccordion === 'month' && (
            <div id="content-month" className="px-3.5 pb-3.5 text-xs text-gray-200 space-y-2 border-t border-gray-800/80 pt-2.5">
              <div><span className="text-blue-300 font-semibold">• 천간 십성:</span> {monthPillar.tenGodStem} 기운으로 사회적 관계를 주도합니다.</div>
              <div><span className="text-blue-300 font-semibold">• 지지 십성:</span> {monthPillar.tenGodBranch} 기운이 청년기 직업/사회 활동을 이끕니다.</div>
              {monthSG.gilsin.length > 0 && (
                <div><span className="text-purple-300 font-semibold">• 길신:</span> {monthSG.gilsin.join(', ')} 조력이 주어집니다.</div>
              )}
              {monthSG.sinsal.length > 0 && (
                <div><span className="text-orange-300 font-semibold">• 신살:</span> {monthSG.sinsal.join(', ')} 매력이 크게 발현됩니다.</div>
              )}
              <div><span className="text-emerald-400 font-semibold">• 총평:</span> 청년 시기 사회적 활동과 재능 발현을 통해 기반을 확고히 다져나가는 정열적인 단계입니다.</div>
            </div>
          )}
        </div>

        {/* 일주 아코디언 */}
        <div className={`bg-card border rounded-xl overflow-hidden shadow transition ${openAccordion === 'day' ? 'border-gold/50' : 'border-gray-800'}`}>
          <button
            onClick={() => toggleAccordion('day')}
            className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none ${openAccordion === 'day' ? 'bg-gold/10' : ''}`}
          >
            <span className="text-xs font-bold text-gold flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-gold inline-block"></span>
              [일주] 중년운 (본인) 상세 분석 ({dayPillar.stem}{dayPillar.branch})
            </span>
            <svg id="icon-day" className={`w-4 h-4 text-gray-300 transform transition-transform duration-200 ${openAccordion === 'day' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {openAccordion === 'day' && (
            <div id="content-day" className="px-3.5 pb-3.5 text-xs text-gray-200 space-y-2 border-t border-gray-800/80 pt-2.5">
              <div><span className="text-gold font-semibold">• 일간:</span> {dayPillar.stem} (본인 자신)</div>
              <div><span className="text-gold font-semibold">• 지지 십성:</span> {dayPillar.tenGodBranch} 기운이 배우자 및 내면의 축을 형성합니다.</div>
              {daySG.gilsin.length > 0 && (
                <div><span className="text-purple-300 font-semibold">• 길신:</span> {daySG.gilsin.join(', ')} 축복이 함께합니다.</div>
              )}
              {daySG.sinsal.length > 0 && (
                <div><span className="text-orange-300 font-semibold">• 신살:</span> {daySG.sinsal.join(', ')} 에너지가 자아를 다집니다.</div>
              )}
              <div><span className="text-emerald-400 font-semibold">• 총평:</span> 자신의 주체성과 뚝심으로 중년의 큰 성취를 완성하고 내실을 다져나가는 핵심 운입니다.</div>
            </div>
          )}
        </div>

        {/* 시주 아코디언 */}
        <div className={`bg-card border rounded-xl overflow-hidden shadow transition ${openAccordion === 'time' ? 'border-gold/50' : 'border-gray-800'}`}>
          <button
            onClick={() => toggleAccordion('time')}
            className={`w-full p-3.5 flex justify-between items-center text-left focus:outline-none ${openAccordion === 'time' ? 'bg-gold/10' : ''}`}
          >
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-2">
              <span className="w-1.5 h-3.5 rounded-full bg-emerald-400 inline-block"></span>
              [시주] 말년운 상세 분석 {isUnknownTime ? '(시간모름)' : `(${hourPillar.stem}${hourPillar.branch})`}
            </span>
            <svg id="icon-time" className={`w-4 h-4 text-gray-300 transform transition-transform duration-200 ${openAccordion === 'time' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {openAccordion === 'time' && (
            <div id="content-time" className="px-3.5 pb-3.5 text-xs text-gray-200 space-y-2 border-t border-gray-800/80 pt-2.5">
              {isUnknownTime ? (
                <div>출생시간 미입력 시 시주 심층 분석은 생략됩니다.</div>
              ) : (
                <>
                  <div><span className="text-emerald-300 font-semibold">• 천간 십성:</span> {hourPillar.tenGodStem} 기운이 말년 비전을 밝힙니다.</div>
                  <div><span className="text-emerald-300 font-semibold">• 지지 십성:</span> {hourPillar.tenGodBranch} 기운이 말년 환경을 형성합니다.</div>
                  {hourSG.gilsin.length > 0 && (
                    <div><span className="text-purple-300 font-semibold">• 길신:</span> {hourSG.gilsin.join(', ')} 복록이 후반부에 결실을 맺습니다.</div>
                  )}
                  {hourSG.sinsal.length > 0 && (
                    <div><span className="text-orange-300 font-semibold">• 신살:</span> {hourSG.sinsal.join(', ')} 독창성이 유지됩니다.</div>
                  )}
                  <div><span className="text-emerald-400 font-semibold">• 총평:</span> 여유로움 속에서 주체적으로 인생의 결실을 완성하는 평안한 말년기입니다.</div>
                </>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
