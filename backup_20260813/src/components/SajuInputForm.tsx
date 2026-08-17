import React, { useState } from 'react';
import { SajuInput } from '../types';

interface Props {
  onSubmit: (input: SajuInput) => void;
  onBack: () => void;
}

export const SajuInputForm: React.FC<Props> = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('김지훈');
  const [gender, setGender] = useState<'female' | 'male'>('male');
  const [birthYear, setBirthYear] = useState<number>(1992);
  const [birthMonth, setBirthMonth] = useState<number>(5);
  const [birthDay, setBirthDay] = useState<number>(20);
  const [calendarSelect, setCalendarSelect] = useState<string>('양력');
  const [birthHour, setBirthHour] = useState<string>('미시 (13:30 ~ 15:30)');
  const [unknownTime, setUnknownTime] = useState<boolean>(false);
  const [yajaSi, setYajaSi] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      gender,
      birthYear: birthYear || 2000,
      birthMonth: birthMonth || 1,
      birthDay: birthDay || 1,
      birthHour: unknownTime ? '모름' : birthHour,
      calendarType: calendarSelect.includes('음력') ? 'lunar' : 'solar',
    });
  };

  return (
    <div className="flex flex-col h-full justify-between relative">
      {/* 상단 헤더 */}
      <div className="px-5 py-3 border-b border-gray-800/80 flex justify-between items-center">
        <button
          onClick={onBack}
          type="button"
          className="text-xs text-gray-400 hover:text-white transition"
        >
          ← 이전
        </button>
        <h1 className="text-sm font-bold text-white tracking-wide">사주 분석</h1>
        <div className="w-8"></div>
      </div>

      {/* 메인 스크롤 영역 (정보 입력 폼) */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름 입력"
              className="w-full bg-navy border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition"
            />
          </div>

          {/* 성별 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-300">성별 (동성 셀럽 매칭)</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2.5 rounded-xl text-xs font-bold transition ${
                  gender === 'male'
                    ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                    : 'bg-navy border border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                남성
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2.5 rounded-xl text-xs font-bold transition ${
                  gender === 'female'
                    ? 'bg-gold text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]'
                    : 'bg-navy border border-gray-700 text-gray-400 hover:border-gray-500'
                }`}
              >
                여성
              </button>
            </div>
          </div>

          {/* 생년월일 (직접 입력형) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-300">생년월일</label>
            <div className="grid grid-cols-3 gap-2">
              <div className="relative">
                <input
                  type="number"
                  value={birthYear || ''}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  placeholder="YYYY"
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">년</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={birthMonth || ''}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  placeholder="MM"
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">월</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  value={birthDay || ''}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  placeholder="DD"
                  className="w-full bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white text-center focus:outline-none focus:border-gold transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-500 pointer-events-none">일</span>
              </div>
            </div>
          </div>

          {/* 태어난 시간 및 자동보정 안내 */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-medium text-gray-300">태어난 시간</label>
              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                className="flex items-center gap-1.5 text-[10px] text-gold/90 hover:text-gold transition"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9"></circle>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3"></path>
                </svg>
                <span>표준시 및 진태양시 자동 보정</span>
                <span className="w-3.5 h-3.5 rounded-full border border-gold/60 flex items-center justify-center font-bold text-[9px] ml-0.5">?</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={calendarSelect}
                onChange={(e) => setCalendarSelect(e.target.value)}
                className="bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition"
              >
                <option value="양력">양력</option>
                <option value="음력 (평달)">음력 (평달)</option>
                <option value="음력 (윤달)">음력 (윤달)</option>
              </select>
              <select
                disabled={unknownTime}
                value={birthHour}
                onChange={(e) => setBirthHour(e.target.value)}
                className={`bg-navy border border-gray-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold transition ${unknownTime ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="자시 (23:30 ~ 01:30)">자시 (23:30 ~ 01:30)</option>
                <option value="축시 (01:30 ~ 03:30)">축시 (01:30 ~ 03:30)</option>
                <option value="인시 (03:30 ~ 05:30)">인시 (03:30 ~ 05:30)</option>
                <option value="묘시 (05:30 ~ 07:30)">묘시 (05:30 ~ 07:30)</option>
                <option value="진시 (07:30 ~ 09:30)">진시 (07:30 ~ 09:30)</option>
                <option value="사시 (09:30 ~ 11:30)">사시 (09:30 ~ 11:30)</option>
                <option value="오시 (11:30 ~ 13:30)">오시 (11:30 ~ 13:30)</option>
                <option value="미시 (13:30 ~ 15:30)">미시 (13:30 ~ 15:30)</option>
                <option value="신시 (15:30 ~ 17:30)">신시 (15:30 ~ 17:30)</option>
                <option value="유시 (17:30 ~ 19:30)">유시 (17:30 ~ 19:30)</option>
                <option value="술시 (19:30 ~ 21:30)">술시 (19:30 ~ 21:30)</option>
                <option value="해시 (21:30 ~ 23:30)">해시 (21:30 ~ 23:30)</option>
              </select>
            </div>
          </div>

          {/* 태어난 시간 모름 체크박스 */}
          <div className="pt-1 flex items-center gap-2">
            <input
              type="checkbox"
              id="unknown-time"
              checked={unknownTime}
              onChange={(e) => setUnknownTime(e.target.checked)}
              className="w-4 h-4 rounded bg-navy border-gray-700 text-gold focus:ring-0 cursor-pointer"
            />
            <label htmlFor="unknown-time" className="text-xs text-gray-400 cursor-pointer select-none">
              태어난 시간 모름 (시간 제외후 분석)
            </label>
          </div>

          {/* 야자시 적용 여부 체크박스 */}
          <div className="pt-1 flex items-center gap-2">
            <input
              type="checkbox"
              id="yaja-si"
              checked={yajaSi}
              onChange={(e) => setYajaSi(e.target.checked)}
              className="w-4 h-4 rounded bg-navy border-gray-700 text-gold focus:ring-0 cursor-pointer"
            />
            <label htmlFor="yaja-si" className="text-xs text-gray-400 cursor-pointer select-none">
              야자시 사용 (밤 11:30 이후 적용)
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-black font-bold py-3.5 rounded-xl text-xs shadow-[0_4px_15px_rgba(212,175,55,0.4)] hover:brightness-110 transition active:scale-[0.98] mt-2"
          >
            내 만세력 & 셀럽 매칭 확인하기 →
          </button>
        </form>
      </div>

      {/* 도움말 모달 팝업 */}
      {showHelpModal && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-card border border-gray-700 rounded-2xl p-5 w-full space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-gold">⏰ 시간 보정 시스템 안내</h3>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-white text-base"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 text-xs text-gray-300 leading-relaxed max-h-[320px] overflow-y-auto custom-scrollbar">
              <p>
                <strong className="text-white">1. 표준시 보정:</strong> 우리가 쓰는 일상 시계(KST)는 일본 기준(동경 135도)에 맞춰져 있어 실제 태양 위치와 미세한 차이가 발생합니다.
              </p>
              <p>
                <strong className="text-white">2. 진태양시 보정:</strong> 사주는 태양의 실제 움직임을 기준으로 하므로, 태어난 지역의 경도 차이를 계산하여 사주 경계선 시간을 바로잡아 줍니다.
              </p>
              <p>
                <strong className="text-white">3. 썸머타임 자동 적용:</strong> 과거 썸머타임(일광절약시간제)이 시행되었던 기간에 태어난 경우, 당시 시계 기준과 실제 표준시간의 차이를 자동으로 반영하여 분석합니다.
              </p>
              <p className="text-[11px] text-gray-400 bg-navy/60 p-2.5 rounded-xl border border-gray-800">
                💡 사용자는 평소 알고 있는 시계 시간이나 시간대만 선택하시면, 시스템이 알아서 가장 정확한 사주(시주)를 찾아드립니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full bg-gold text-black font-bold py-2.5 rounded-xl text-xs transition hover:brightness-110"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
