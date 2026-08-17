import React, { useState, useMemo } from 'react';
import { SajuInput } from '../types';
import {
  DEFAULT_CITY,
  getHourPillarBranch,
} from '../data/cityData';

interface Props {
  onSubmit: (input: SajuInput) => void;
  onBack: () => void;
  initialValues?: Partial<SajuInput>;
}

export const SajuInputForm: React.FC<Props> = ({ onSubmit, onBack, initialValues }) => {
  const [name, setName] = useState(initialValues?.name || '김지훈');
  const [gender, setGender] = useState<'female' | 'male'>(initialValues?.gender || 'male');
  const [birthYear, setBirthYear] = useState<string>(initialValues?.birthYear ? String(initialValues.birthYear) : '1992');
  const [birthMonth, setBirthMonth] = useState<string>(initialValues?.birthMonth ? String(initialValues.birthMonth) : '5');
  const [birthDay, setBirthDay] = useState<string>(initialValues?.birthDay ? String(initialValues.birthDay) : '20');
  const [calendarSelect, setCalendarSelect] = useState<string>(
    initialValues?.calendarType === 'lunar-leap'
      ? '음력 (윤달)'
      : initialValues?.calendarType === 'lunar'
      ? '음력 (평달)'
      : '양력'
  );

  // 시/분 입력 (기본 14:35 -> 미시)
  const [birthHourVal, setBirthHourVal] = useState<string>('14');
  const [birthMinuteVal, setBirthMinuteVal] = useState<string>('35');
  const [unknownTime, setUnknownTime] = useState<boolean>(initialValues?.isUnknownTime || false);

  // 야자시/조자시 선택 ('yaja' | 'jo')
  const [jasiOption, setJasiOption] = useState<'yaja' | 'jo'>('yaja');

  // 표준시 자동 보정 적용 (항상 true 기본값)
  const [applySolarCorrection] = useState<boolean>(true);

  // 도움말 모달
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [yearErrorMsg, setYearErrorMsg] = useState<string | null>(null);

  // 시/분 숫자 파싱
  const numHour = parseInt(birthHourVal, 10);
  const numMinute = parseInt(birthMinuteVal, 10);
  const validHour = !isNaN(numHour) && numHour >= 0 && numHour <= 23 ? numHour : 12;
  const validMinute = !isNaN(numMinute) && numMinute >= 0 && numMinute <= 59 ? numMinute : 0;

  const numY = parseInt(birthYear, 10) || 1992;
  const numM = parseInt(birthMonth, 10) || 5;
  const numD = parseInt(birthDay, 10) || 20;

  // 자시 판정 (23:00~23:59 or 00:00~00:59)
  const is23Hour = validHour === 23;
  const is0Hour = validHour === 0;
  const isJasiRange = !unknownTime && (is23Hour || is0Hour);

  // 현재 시간대 자동 계산 정보
  const hourBranchInfo = useMemo(() => {
    if (unknownTime) return null;
    return getHourPillarBranch(
      validHour,
      validMinute,
      applySolarCorrection,
      DEFAULT_CITY,
      numY,
      numM,
      numD
    );
  }, [unknownTime, validHour, validMinute, applySolarCorrection, numY, numM, numD]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const y = parseInt(birthYear, 10);
    if (!birthYear || isNaN(y) || y < 1900 || y > 2050) {
      setYearErrorMsg('지원하지 않는 연도입니다. (1900~2050년 사이만 입력 가능합니다)');
      return;
    }
    setYearErrorMsg(null);

    const m = parseInt(birthMonth, 10) || 1;
    const d = parseInt(birthDay, 10) || 1;

    const formattedTime = unknownTime
      ? '시간 미지정 (시간 모름)'
      : `${String(validHour).padStart(2, '0')}:${String(validMinute).padStart(2, '0')} (${hourBranchInfo?.branchName || '미시'})`;

    onSubmit({
      name: name || '김지훈',
      gender,
      birthYear: y,
      birthMonth: m,
      birthDay: d,
      birthHour: formattedTime,
      birthHourNum: validHour,
      birthMinuteNum: validMinute,
      calendarType: calendarSelect.includes('윤달') ? 'lunar-leap' : calendarSelect.includes('음력') ? 'lunar' : 'solar',
      isUnknownTime: unknownTime,
      useYajasi: is23Hour ? jasiOption === 'yaja' : false,
      jasiOption: isJasiRange ? jasiOption : undefined,
      birthCity: undefined,
      birthLongitude: DEFAULT_CITY.longitude,
      applySolarCorrection: true,
    });
  };

  return (
    <div className="flex flex-col h-full justify-between relative bg-background text-gray-100">
      {/* 상단 헤더 */}
      <div className="px-5 py-4 border-b border-gray-800/80 flex justify-between items-center text-center">
        <button
          onClick={onBack}
          type="button"
          className="text-xs text-gray-400 hover:text-gold transition flex items-center gap-1 cursor-pointer"
        >
          <span>←</span> <span>홈으로</span>
        </button>
        <h1 className="text-sm font-bold text-white tracking-wide pr-8">사주 분석</h1>
        <div className="w-4"></div>
      </div>

      {/* 메인 스크롤 영역 (정보 입력 폼) */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-28 space-y-5 no-scrollbar">
        {/* 섹션 타이틀 */}
        <div>
          <h2 className="text-lg font-bold text-white mb-1">사주 정보 입력</h2>
          <p className="text-xs text-gray-400">정확한 만세력 분석을 위해 정보를 입력해주세요.</p>
        </div>

        {/* 입력 카드 컨테이너 */}
        <form onSubmit={handleSubmit} id="saju-form" className="bg-card border border-gray-800 rounded-2xl p-4 space-y-4 shadow-lg relative">
          {/* 이름 또는 닉네임 */}
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
                className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  gender === 'male'
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
                className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  gender === 'female'
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
              <span className="text-[10px] text-gray-400 font-normal">(1900년 ~ 2050년)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <input
                  type="number"
                  id="input-year"
                  min="1900"
                  max="2050"
                  value={birthYear}
                  onChange={(e) => {
                    setBirthYear(e.target.value);
                    setYearErrorMsg(null);
                  }}
                  placeholder="YYYY"
                  className={`w-full bg-navy border ${
                    yearErrorMsg ? 'border-red-500 focus:border-red-400' : 'border-gray-700 focus:border-gold'
                  } rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">년</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  id="input-month"
                  value={birthMonth}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setBirthMonth('');
                      return;
                    }
                    if (!/^\d+$/.test(val)) return;
                    if (val.length > 2) return;
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 1 && num <= 12) {
                      setBirthMonth(val);
                    }
                  }}
                  placeholder="MM"
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">월</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  id="input-day"
                  value={birthDay}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setBirthDay('');
                      return;
                    }
                    if (!/^\d+$/.test(val)) return;
                    if (val.length > 2) return;
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 1 && num <= 31) {
                      setBirthDay(val);
                    }
                  }}
                  placeholder="DD"
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">일</span>
              </div>
            </div>
            {yearErrorMsg && (
              <p className="text-[11px] text-red-400 mt-1">{yearErrorMsg}</p>
            )}
          </div>

          {/* 달력 기준 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-300">달력 기준</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'solar', label: '양력', val: '양력' },
                { id: 'lunar', label: '음력 (평달)', val: '음력 (평달)' },
                { id: 'lunar-leap', label: '음력 (윤달)', val: '음력 (윤달)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCalendarSelect(item.val)}
                  className={`py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    calendarSelect === item.val
                      ? 'bg-amber-500/20 border border-gold text-gold shadow-sm'
                      : 'bg-navy border border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 1. 출생시간 입력 */}
          <div className="space-y-2 pt-1 border-t border-gray-800/80">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-gray-300">출생시간 (태어난 시각)</label>
              {!unknownTime && hourBranchInfo && (
                <span className="text-[11px] text-gold font-semibold bg-gold/10 px-2 py-0.5 rounded-full border border-gold/30">
                  {hourBranchInfo.branchName} ({hourBranchInfo.branchHanja}時) · {hourBranchInfo.timeRange}
                </span>
              )}
            </div>

            {/* 시/분 입력 필드 */}
            <div className={`space-y-2 transition-opacity ${unknownTime ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    id="input-hour-modal"
                    value={birthHourVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setBirthHourVal('');
                        return;
                      }
                      if (!/^\d+$/.test(val)) return;
                      if (val.length > 2) return;
                      const num = parseInt(val, 10);
                      if (!isNaN(num) && num >= 0 && num <= 23) {
                        setBirthHourVal(val);
                      }
                    }}
                    placeholder="14"
                    className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">시 (0~23)</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    id="input-minute-modal"
                    value={birthMinuteVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setBirthMinuteVal('');
                        return;
                      }
                      if (!/^\d+$/.test(val)) return;
                      if (val.length > 2) return;
                      const num = parseInt(val, 10);
                      if (!isNaN(num) && num >= 0 && num <= 59) {
                        setBirthMinuteVal(val);
                      }
                    }}
                    placeholder="35"
                    className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">분 (0~59)</span>
                </div>
              </div>
            </div>

            {/* 태어난 시간 모름 체크박스 */}
            <div className="pt-1 flex items-center gap-2">
              <input
                type="checkbox"
                id="chk-unknown-time-modal"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="w-4 h-4 rounded border-gray-700 bg-navy text-gold focus:ring-gold accent-[#D4AF37] cursor-pointer"
              />
              <label htmlFor="chk-unknown-time-modal" className="text-xs text-gray-300 cursor-pointer select-none">
                태어난 시간 모름 <span className="text-gray-400 text-[11px]">(시간 제외후 분석)</span>
              </label>
            </div>
          </div>

          {/* 2. 야자시 / 조자시 선택 (23:00~00:59 출생자에게만 표시) */}
          {isJasiRange && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🌙</span> 자시 적용 기준 선택 ({is23Hour ? '23:00~23:59' : '00:00~00:59'})
                </span>
                <span className="text-[10px] text-amber-200/70">자시 특별 규칙</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setJasiOption('yaja')}
                  className={`p-2 rounded-lg text-xs font-medium text-left transition border cursor-pointer ${
                    jasiOption === 'yaja'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-navy/60 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-white">야자시 (夜子時)</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {is23Hour ? '당일 일주 유지' : '전날 자시 연장'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setJasiOption('jo')}
                  className={`p-2 rounded-lg text-xs font-medium text-left transition border cursor-pointer ${
                    jasiOption === 'jo'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold'
                      : 'bg-navy/60 border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-white">조자시 (早子時)</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {is23Hour ? '다음날 일주 적용' : '당일 일주 적용 (표준)'}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* 3. 표준시 자동 보정 안내 */}
          <div className="pt-2 border-t border-gray-800/80 space-y-2">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-1.5 text-xs text-gold hover:text-amber-300 transition cursor-pointer font-medium"
              >
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"></path>
                </svg>
                <span>표준시 자동 보정</span>
                <span className="w-4 h-4 rounded-full border border-gold/60 flex items-center justify-center font-bold text-[10px]">?</span>
              </button>

              <div className="flex items-center gap-1 text-[11px] text-gold font-medium">
                <span>표준시 자동 보정</span>
                <span className="text-emerald-400 font-bold">✓</span>
              </div>
            </div>

            <div className="bg-navy/70 border border-gray-800 rounded-xl p-2.5 text-[11px] text-gray-300 flex items-center gap-2">
              <span className="text-gold">✓</span>
              <span className="text-gray-300">
                출생시간을 한국 표준시 기준으로 자동 보정합니다.
              </span>
            </div>
          </div>

          {/* 4. 확인 버튼 */}
          <button
            type="submit"
            className="w-full bg-gold text-black font-bold py-3.5 rounded-xl text-xs shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:brightness-110 transition active:scale-[0.98] mt-3 cursor-pointer"
          >
            내 만세력 확인하기 →
          </button>
        </form>
      </div>

      {/* 도움말 모달 팝업 */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-5 z-50 animate-fadeIn">
          <div className="bg-card border border-gray-700 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-gold flex items-center gap-2">
                <span>⏰</span> 시간 보정 시스템 안내
              </h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-white text-lg p-1"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed max-h-[340px] overflow-y-auto custom-scrollbar">
              <div className="bg-navy/70 border border-gray-800 rounded-xl p-3 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  1. 표준시 보정 (KST 오차 보정)
                </span>
                <p className="text-[11px] text-gray-400 pl-3 leading-relaxed">
                  대한민국 표준시는 동경 135도를 기준으로 사용하므로, 실제 우리나라 입기시각과의 30분 시차를 자동 정밀 보정합니다.
                </p>
              </div>

              <div className="bg-navy/70 border border-gray-800 rounded-xl p-3 space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                  2. 썸머타임 (일광절약시간) 자동 적용
                </span>
                <p className="text-[11px] text-gray-400 pl-3 leading-relaxed">
                  1948~1951년, 1954~1960년, 1987~1988년에 시행된 썸머타임 적용 기간 출생자의 시각을 역사적 기준에 따라 자동 보정합니다.
                </p>
              </div>

              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 space-y-1">
                <span className="text-[11px] font-bold text-gold flex items-center gap-1">
                  💡 SOL AI 만세력 시간 보정 안내
                </span>
                <p className="text-[10px] text-gray-300 leading-relaxed">
                  입력하신 출생시간을 기준으로 시간 보정이 자동으로 적용됩니다. 별도의 시간 계산 없이 태어난 시각 그대로 입력해주세요.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-gold text-black font-bold py-2.5 rounded-xl text-xs transition hover:brightness-110 cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
