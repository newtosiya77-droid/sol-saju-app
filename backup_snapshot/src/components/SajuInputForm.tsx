import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SajuInput } from '../types';
import {
  KOREA_CITIES,
  DEFAULT_CITY,
  CityInfo,
  getHourPillarBranch,
  calculateSolarTimeOffset,
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

  // 출생지 검색 및 선택
  const [selectedCity, setSelectedCity] = useState<CityInfo>(() => {
    if (initialValues?.birthCity) {
      const found = KOREA_CITIES.find(c => c.fullName === initialValues.birthCity || c.name === initialValues.birthCity);
      if (found) return found;
    }
    return DEFAULT_CITY;
  });
  const [citySearchTerm, setCitySearchTerm] = useState<string>('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // 표준시/진태양시 보정 적용 여부
  const [applySolarCorrection, setApplySolarCorrection] = useState<boolean>(true);

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
      selectedCity,
      numY,
      numM,
      numD
    );
  }, [unknownTime, validHour, validMinute, applySolarCorrection, selectedCity, numY, numM, numD]);

  // 진태양시 오프셋 정보
  const solarOffsetInfo = useMemo(() => {
    return calculateSolarTimeOffset(selectedCity, numY, numM, numD);
  }, [selectedCity, numY, numM, numD]);

  // 도시 검색 필터
  const filteredCities = useMemo(() => {
    if (!citySearchTerm.trim()) {
      return KOREA_CITIES.slice(0, 15);
    }
    const q = citySearchTerm.trim().toLowerCase();
    return KOREA_CITIES.filter(
      c => c.name.toLowerCase().includes(q) || c.fullName.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [citySearchTerm]);

  // 외부 클릭 시 도시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      birthCity: selectedCity.fullName,
      birthLongitude: selectedCity.longitude,
      applySolarCorrection,
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
                    if (val === '') { setBirthMonth(''); return; }
                    if (!/^\d+$/.test(val) || val.length > 2) return;
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 1 && num <= 12) setBirthMonth(val);
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
                  value={birthDay}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') { setBirthDay(''); return; }
                    if (!/^\d+$/.test(val) || val.length > 2) return;
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 1 && num <= 31) setBirthDay(val);
                  }}
                  placeholder="DD"
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition"
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
                { id: 'lunar', label: '음력(평달)', val: '음력 (평달)' },
                { id: 'lunar-leap', label: '음력(윤달)', val: '음력 (윤달)' },
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

          {/* 1. 태어난 시간 입력 방식 (직접 시·분 입력 [ HH ] : [ MM ]) */}
          <div className="space-y-2 pt-1 border-t border-gray-800/80">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-gray-300">태어난 시간</label>
              {!unknownTime && hourBranchInfo && (
                <span className="text-[11px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30 font-medium">
                  자동 판정: <strong className="text-gold font-bold">{hourBranchInfo.branchName}</strong> ({hourBranchInfo.branchHanja})
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 items-center">
              {/* 시 (00~23) */}
              <div className="relative">
                <div className="flex items-center bg-navy border border-gray-700 rounded-xl focus-within:border-gold transition px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    max="23"
                    disabled={unknownTime}
                    value={birthHourVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') { setBirthHourVal(''); return; }
                      const num = parseInt(val, 10);
                      if (!isNaN(num) && num >= 0 && num <= 23) {
                        setBirthHourVal(val);
                      }
                    }}
                    placeholder="14"
                    className={`w-full bg-transparent text-sm font-bold text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      unknownTime ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  />
                  <span className="text-xs text-gray-400 ml-1 shrink-0">시</span>
                </div>
              </div>

              {/* 분 (00~59) */}
              <div className="relative">
                <div className="flex items-center bg-navy border border-gray-700 rounded-xl focus-within:border-gold transition px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    disabled={unknownTime}
                    value={birthMinuteVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') { setBirthMinuteVal(''); return; }
                      const num = parseInt(val, 10);
                      if (!isNaN(num) && num >= 0 && num <= 59) {
                        setBirthMinuteVal(val);
                      }
                    }}
                    placeholder="35"
                    className={`w-full bg-transparent text-sm font-bold text-white text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                      unknownTime ? 'opacity-40 cursor-not-allowed' : ''
                    }`}
                  />
                  <span className="text-xs text-gray-400 ml-1 shrink-0">분</span>
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

          {/* 3. 출생지 입력 및 도시 검색 */}
          <div className="space-y-1.5 pt-1 border-t border-gray-800/80" ref={cityDropdownRef}>
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-gray-300">출생지 (시·군·구)</label>
              <span className="text-[10px] text-gray-400">
                경도 {selectedCity.longitude}°E (시차 {selectedCity.offsetMinutes > 0 ? `+${selectedCity.offsetMinutes}` : `${selectedCity.offsetMinutes}`}분)
              </span>
            </div>

            <div className="relative">
              <div className="flex items-center bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus-within:border-gold transition">
                <span className="text-gray-400 mr-2 text-sm">🔍</span>
                <input
                  type="text"
                  value={citySearchTerm}
                  onFocus={() => setIsCityDropdownOpen(true)}
                  onChange={(e) => {
                    setCitySearchTerm(e.target.value);
                    setIsCityDropdownOpen(true);
                  }}
                  placeholder={selectedCity.fullName}
                  className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-gray-300 font-medium"
                />
                {selectedCity && (
                  <span className="text-[11px] text-gold bg-amber-500/15 border border-gold/30 px-2 py-0.5 rounded-md shrink-0 ml-1">
                    {selectedCity.name}
                  </span>
                )}
              </div>

              {/* 검색 결과 드롭다운 */}
              {isCityDropdownOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-gray-700 rounded-xl shadow-2xl z-40 max-h-56 overflow-y-auto custom-scrollbar">
                  <div className="p-2 border-b border-gray-800 text-[11px] text-gray-400 flex justify-between items-center">
                    <span>도시 선택 ({filteredCities.length}건)</span>
                    <button
                      type="button"
                      onClick={() => setIsCityDropdownOpen(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="divide-y divide-gray-800/60">
                    {filteredCities.map((city) => (
                      <button
                        key={`${city.province}-${city.name}`}
                        type="button"
                        onClick={() => {
                          setSelectedCity(city);
                          setCitySearchTerm('');
                          setIsCityDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex justify-between items-center hover:bg-gold/10 transition cursor-pointer ${
                          selectedCity.name === city.name ? 'bg-gold/15 text-gold font-bold' : 'text-gray-200'
                        }`}
                      >
                        <div>
                          <div className="font-medium text-white">{city.name}</div>
                          <div className="text-[10px] text-gray-400">{city.fullName}</div>
                        </div>
                        <span className="text-[10px] text-gray-400">
                          {city.offsetMinutes > 0 ? `+${city.offsetMinutes}` : `${city.offsetMinutes}`}분
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. 표준시 및 진태양시 자동 보정 버튼 & 배너 */}
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
                <span>표준시 및 진태양시 자동 보정</span>
                <span className="w-4 h-4 rounded-full border border-gold/60 flex items-center justify-center font-bold text-[10px]">?</span>
              </button>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={applySolarCorrection}
                  onChange={(e) => setApplySolarCorrection(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-700 bg-navy text-gold focus:ring-gold accent-[#D4AF37] cursor-pointer"
                />
                <span className="text-[11px] text-gray-300 font-medium">자동보정 적용</span>
              </label>
            </div>

            {applySolarCorrection && (
              <div className="bg-navy/70 border border-gray-800 rounded-xl p-2.5 text-[11px] text-gray-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">⚡</span>
                  <span>
                    <strong className="text-white">{selectedCity.name}</strong> 기준 시차{' '}
                    <span className="text-gold font-bold">{solarOffsetInfo.longitudeDiffMinutes}분</span>
                    {solarOffsetInfo.isDst && (
                      <span className="text-cyan-300 ml-1">(서머타임 -60분)</span>
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-gray-400">
                  총 {solarOffsetInfo.totalOffsetMinutes}분 보정
                </span>
              </div>
            )}
          </div>

          {/* 5. 확인 버튼 */}
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
                <span>⏰</span> 표준시 및 진태양시 자동 보정 안내
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
              <div className="p-2.5 bg-navy/80 rounded-xl border border-gray-800">
                <strong className="text-amber-300 block mb-1">1. 표준시와 진태양시 차이</strong>
                <p className="text-gray-300 text-[11px]">
                  대한민국의 표준시(KST)는 동경 135도(일본 아카시 자오선) 기준입니다. 서울(126.98°E)은 실제 태양 시간보다 약 32분 빠르게 시계가 가리키므로, 사주 경계선(12간지시) 계산 시 출생지의 실제 경도를 반영하여 정확한 시주를 도출합니다.
                </p>
              </div>

              <div className="p-2.5 bg-navy/80 rounded-xl border border-gray-800">
                <strong className="text-amber-300 block mb-1">2. 서머타임(일광절약시간제) 자동 보정</strong>
                <p className="text-gray-300 text-[11px]">
                  과거 1948~1960년, 1987~1988년 서머타임 시행 기간에 태어난 경우 시계가 1시간 앞당겨져 있었으므로, 시스템이 출생일을 감지하여 1시간(-60분)을 자동 보정합니다.
                </p>
              </div>

              <div className="p-2.5 bg-navy/80 rounded-xl border border-gray-800">
                <strong className="text-amber-300 block mb-1">3. 야자시 / 조자시 정밀 판정</strong>
                <p className="text-gray-300 text-[11px]">
                  밤 23:00~00:59 출생자의 경우, 당일 일주를 유지하는 야자시(夜子時)와 다음 날 일주를 적용하는 조자시(早子時) 중 학파별 기준을 자유롭게 선택하여 분석할 수 있습니다.
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
