// 대한민국 전국 도시 및 주요 광역/시/군/구 경도 및 진태양시 데이터

export interface CityInfo {
  name: string;
  fullName: string;
  province: string;
  longitude: number;
  latitude: number;
  offsetMinutes: number; // 동경 135도 기준 시차 (분)
}

// 대한민국 주요 시/군/구 DB (경도 기준 135도 표준자오선과의 시차)
export const KOREA_CITIES: CityInfo[] = [
  // 서울특별시
  { name: '서울', fullName: '대한민국 서울특별시', province: '서울특별시', longitude: 126.98, latitude: 37.56, offsetMinutes: -32.1 },
  
  // 경기도
  { name: '수원', fullName: '대한민국 경기도 수원시', province: '경기도', longitude: 127.01, latitude: 37.26, offsetMinutes: -32.0 },
  { name: '성남', fullName: '대한민국 경기도 성남시', province: '경기도', longitude: 127.13, latitude: 37.42, offsetMinutes: -31.5 },
  { name: '고양', fullName: '대한민국 경기도 고양시', province: '경기도', longitude: 126.83, latitude: 37.65, offsetMinutes: -32.7 },
  { name: '용인', fullName: '대한민국 경기도 용인시', province: '경기도', longitude: 127.18, latitude: 37.24, offsetMinutes: -31.3 },
  { name: '부천', fullName: '대한민국 경기도 부천시', province: '경기도', longitude: 126.77, latitude: 37.50, offsetMinutes: -32.9 },
  { name: '안산', fullName: '대한민국 경기도 안산시', province: '경기도', longitude: 126.83, latitude: 37.32, offsetMinutes: -32.7 },
  { name: '안양', fullName: '대한민국 경기도 안양시', province: '경기도', longitude: 126.93, latitude: 37.39, offsetMinutes: -32.3 },
  { name: '남양주', fullName: '대한민국 경기도 남양주시', province: '경기도', longitude: 127.22, latitude: 37.64, offsetMinutes: -31.1 },
  { name: '화성', fullName: '대한민국 경기도 화성시', province: '경기도', longitude: 126.83, latitude: 37.20, offsetMinutes: -32.7 },
  { name: '평택', fullName: '대한민국 경기도 평택시', province: '경기도', longitude: 127.11, latitude: 36.99, offsetMinutes: -31.6 },
  { name: '의정부', fullName: '대한민국 경기도 의정부시', province: '경기도', longitude: 127.05, latitude: 37.74, offsetMinutes: -31.8 },
  { name: '시흥', fullName: '대한민국 경기도 시흥시', province: '경기도', longitude: 126.80, latitude: 37.38, offsetMinutes: -32.8 },
  { name: '파주', fullName: '대한민국 경기도 파주시', province: '경기도', longitude: 126.78, latitude: 37.76, offsetMinutes: -32.9 },
  { name: '김포', fullName: '대한민국 경기도 김포시', province: '경기도', longitude: 126.72, latitude: 37.62, offsetMinutes: -33.1 },
  { name: '광명', fullName: '대한민국 경기도 광명시', province: '경기도', longitude: 126.87, latitude: 37.48, offsetMinutes: -32.5 },
  { name: '광주(경기)', fullName: '대한민국 경기도 광주시', province: '경기도', longitude: 127.25, latitude: 37.43, offsetMinutes: -31.0 },
  { name: '군포', fullName: '대한민국 경기도 군포시', province: '경기도', longitude: 126.94, latitude: 37.36, offsetMinutes: -32.2 },
  { name: '이천', fullName: '대한민국 경기도 이천시', province: '경기도', longitude: 127.44, latitude: 37.28, offsetMinutes: -30.2 },
  { name: '양주', fullName: '대한민국 경기도 양주시', province: '경기도', longitude: 127.04, latitude: 37.78, offsetMinutes: -31.8 },
  { name: '오산', fullName: '대한민국 경기도 오산시', province: '경기도', longitude: 127.07, latitude: 37.15, offsetMinutes: -31.7 },
  { name: '구리', fullName: '대한민국 경기도 구리시', province: '경기도', longitude: 127.14, latitude: 37.60, offsetMinutes: -31.4 },
  { name: '안성', fullName: '대한민국 경기도 안성시', province: '경기도', longitude: 127.28, latitude: 37.01, offsetMinutes: -30.9 },
  { name: '포천', fullName: '대한민국 경기도 포천시', province: '경기도', longitude: 127.20, latitude: 37.89, offsetMinutes: -31.2 },
  { name: '의왕', fullName: '대한민국 경기도 의왕시', province: '경기도', longitude: 126.97, latitude: 37.34, offsetMinutes: -32.1 },
  { name: '하남', fullName: '대한민국 경기도 하남시', province: '경기도', longitude: 127.21, latitude: 37.54, offsetMinutes: -31.2 },
  { name: '여주', fullName: '대한민국 경기도 여주시', province: '경기도', longitude: 127.64, latitude: 37.30, offsetMinutes: -29.4 },
  { name: '양평', fullName: '대한민국 경기도 양평군', province: '경기도', longitude: 127.49, latitude: 37.49, offsetMinutes: -30.0 },
  { name: '동두천', fullName: '대한민국 경기도 동두천시', province: '경기도', longitude: 127.06, latitude: 37.90, offsetMinutes: -31.8 },
  { name: '과천', fullName: '대한민국 경기도 과천시', province: '경기도', longitude: 126.99, latitude: 37.43, offsetMinutes: -32.0 },
  { name: '가평', fullName: '대한민국 경기도 가평군', province: '경기도', longitude: 127.51, latitude: 37.83, offsetMinutes: -30.0 },
  { name: '연천', fullName: '대한민국 경기도 연천군', province: '경기도', longitude: 127.07, latitude: 38.10, offsetMinutes: -31.7 },

  // 부산광역시
  { name: '부산', fullName: '대한민국 부산광역시', province: '부산광역시', longitude: 129.04, latitude: 35.18, offsetMinutes: -23.8 },
  { name: '해운대', fullName: '대한민국 부산광역시 해운대구', province: '부산광역시', longitude: 129.16, latitude: 35.16, offsetMinutes: -23.4 },

  // 대구광역시
  { name: '대구', fullName: '대한민국 대구광역시', province: '대구광역시', longitude: 128.60, latitude: 35.87, offsetMinutes: -25.6 },
  { name: '군위', fullName: '대한민국 대구광역시 군위군', province: '대구광역시', longitude: 128.57, latitude: 36.24, offsetMinutes: -25.7 },

  // 인천광역시
  { name: '인천', fullName: '대한민국 인천광역시', province: '인천광역시', longitude: 126.71, latitude: 37.46, offsetMinutes: -33.2 },
  { name: '강화', fullName: '대한민국 인천광역시 강화군', province: '인천광역시', longitude: 126.49, latitude: 37.75, offsetMinutes: -34.0 },

  // 광주광역시
  { name: '광주', fullName: '대한민국 광주광역시', province: '광주광역시', longitude: 126.85, latitude: 35.16, offsetMinutes: -32.6 },

  // 대전광역시
  { name: '대전', fullName: '대한민국 대전광역시', province: '대전광역시', longitude: 127.38, latitude: 36.35, offsetMinutes: -30.5 },

  // 울산광역시
  { name: '울산', fullName: '대한민국 울산광역시', province: '울산광역시', longitude: 129.31, latitude: 35.54, offsetMinutes: -22.8 },

  // 세종특별자치시
  { name: '세종', fullName: '대한민국 세종특별자치시', province: '세종특별자치시', longitude: 127.29, latitude: 36.48, offsetMinutes: -30.8 },

  // 강원특별자치도
  { name: '춘천', fullName: '대한민국 강원특별자치도 춘천시', province: '강원도', longitude: 127.73, latitude: 37.88, offsetMinutes: -29.1 },
  { name: '원주', fullName: '대한민국 강원특별자치도 원주시', province: '강원도', longitude: 127.95, latitude: 37.34, offsetMinutes: -28.2 },
  { name: '강릉', fullName: '대한민국 강원특별자치도 강릉시', province: '강원도', longitude: 128.90, latitude: 37.75, offsetMinutes: -24.4 },
  { name: '동해', fullName: '대한민국 강원특별자치도 동해시', province: '강원도', longitude: 129.11, latitude: 37.52, offsetMinutes: -23.6 },
  { name: '태백', fullName: '대한민국 강원특별자치도 태백시', province: '강원도', longitude: 128.99, latitude: 37.16, offsetMinutes: -24.0 },
  { name: '속초', fullName: '대한민국 강원특별자치도 속초시', province: '강원도', longitude: 128.60, latitude: 38.21, offsetMinutes: -25.6 },
  { name: '삼척', fullName: '대한민국 강원특별자치도 삼척시', province: '강원도', longitude: 129.17, latitude: 37.45, offsetMinutes: -23.3 },
  { name: '홍천', fullName: '대한민국 강원특별자치도 홍천군', province: '강원도', longitude: 127.89, latitude: 37.69, offsetMinutes: -28.4 },
  { name: '횡성', fullName: '대한민국 강원특별자치도 횡성군', province: '강원도', longitude: 127.99, latitude: 37.49, offsetMinutes: -28.0 },
  { name: '영월', fullName: '대한민국 강원특별자치도 영월군', province: '강원도', longitude: 128.46, latitude: 37.18, offsetMinutes: -26.2 },
  { name: '평창', fullName: '대한민국 강원특별자치도 평창군', province: '강원도', longitude: 128.40, latitude: 37.37, offsetMinutes: -26.4 },
  { name: '정선', fullName: '대한민국 강원특별자치도 정선군', province: '강원도', longitude: 128.66, latitude: 37.38, offsetMinutes: -25.4 },
  { name: '철원', fullName: '대한민국 강원특별자치도 철원군', province: '강원도', longitude: 127.31, latitude: 38.15, offsetMinutes: -30.8 },
  { name: '화천', fullName: '대한민국 강원특별자치도 화천군', province: '강원도', longitude: 127.71, latitude: 38.11, offsetMinutes: -29.2 },
  { name: '양구', fullName: '대한민국 강원특별자치도 양구군', province: '강원도', longitude: 127.99, latitude: 38.11, offsetMinutes: -28.0 },
  { name: '인제', fullName: '대한민국 강원특별자치도 인제군', province: '강원도', longitude: 128.17, latitude: 38.07, offsetMinutes: -27.3 },
  { name: '고성(강원)', fullName: '대한민국 강원특별자치도 고성군', province: '강원도', longitude: 128.47, latitude: 38.38, offsetMinutes: -26.1 },
  { name: '양양', fullName: '대한민국 강원특별자치도 양양군', province: '강원도', longitude: 128.62, latitude: 38.08, offsetMinutes: -25.5 },

  // 충청북도
  { name: '청주', fullName: '대한민국 충청북도 청주시', province: '충청북도', longitude: 127.49, latitude: 36.64, offsetMinutes: -30.0 },
  { name: '충주', fullName: '대한민국 충청북도 충주시', province: '충청북도', longitude: 127.93, latitude: 36.99, offsetMinutes: -28.3 },
  { name: '제천', fullName: '대한민국 충청북도 제천시', province: '충청북도', longitude: 128.21, latitude: 37.13, offsetMinutes: -27.2 },
  { name: '보은', fullName: '대한민국 충청북도 보은군', province: '충청북도', longitude: 127.73, latitude: 36.49, offsetMinutes: -29.1 },
  { name: '옥천', fullName: '대한민국 충청북도 옥천군', province: '충청북도', longitude: 127.57, latitude: 36.30, offsetMinutes: -29.7 },
  { name: '영동', fullName: '대한민국 충청북도 영동군', province: '충청북도', longitude: 127.78, latitude: 36.17, offsetMinutes: -28.9 },
  { name: '증평', fullName: '대한민국 충청북도 증평군', province: '충청북도', longitude: 127.58, latitude: 36.78, offsetMinutes: -29.7 },
  { name: '진천', fullName: '대한민국 충청북도 진천군', province: '충청북도', longitude: 127.44, latitude: 36.86, offsetMinutes: -30.2 },
  { name: '괴산', fullName: '대한민국 충청북도 괴산군', province: '충청북도', longitude: 127.79, latitude: 36.81, offsetMinutes: -28.8 },
  { name: '음성', fullName: '대한민국 충청북도 음성군', province: '충청북도', longitude: 127.69, latitude: 36.93, offsetMinutes: -29.2 },
  { name: '단양', fullName: '대한민국 충청북도 단양군', province: '충청북도', longitude: 128.37, latitude: 36.98, offsetMinutes: -26.5 },

  // 충청남도
  { name: '천안', fullName: '대한민국 충청남도 천안시', province: '충청남도', longitude: 127.15, latitude: 36.82, offsetMinutes: -31.4 },
  { name: '공주', fullName: '대한민국 충청남도 공주시', province: '충청남도', longitude: 127.12, latitude: 36.45, offsetMinutes: -31.5 },
  { name: '보령', fullName: '대한민국 충청남도 보령시', province: '충청남도', longitude: 126.60, latitude: 36.33, offsetMinutes: -33.6 },
  { name: '아산', fullName: '대한민국 충청남도 아산시', province: '충청남도', longitude: 127.00, latitude: 36.78, offsetMinutes: -32.0 },
  { name: '서산', fullName: '대한민국 충청남도 서산시', province: '충청남도', longitude: 126.45, latitude: 36.78, offsetMinutes: -34.2 },
  { name: '논산', fullName: '대한민국 충청남도 논산시', province: '충청남도', longitude: 127.09, latitude: 36.19, offsetMinutes: -31.6 },
  { name: '계룡', fullName: '대한민국 충청남도 계룡시', province: '충청남도', longitude: 127.25, latitude: 36.27, offsetMinutes: -31.0 },
  { name: '당진', fullName: '대한민국 충청남도 당진시', province: '충청남도', longitude: 126.63, latitude: 36.89, offsetMinutes: -33.5 },
  { name: '금산', fullName: '대한민국 충청남도 금산군', province: '충청남도', longitude: 127.49, latitude: 36.11, offsetMinutes: -30.0 },
  { name: '부여', fullName: '대한민국 충청남도 부여군', province: '충청남도', longitude: 126.92, latitude: 36.28, offsetMinutes: -32.3 },
  { name: '서천', fullName: '대한민국 충청남도 서천군', province: '충청남도', longitude: 126.69, latitude: 36.08, offsetMinutes: -33.2 },
  { name: '청양', fullName: '대한민국 충청남도 청양군', province: '충청남도', longitude: 126.80, latitude: 36.46, offsetMinutes: -32.8 },
  { name: '홍성', fullName: '대한민국 충청남도 홍성군', province: '충청남도', longitude: 126.66, latitude: 36.60, offsetMinutes: -33.4 },
  { name: '예산', fullName: '대한민국 충청남도 예산군', province: '충청남도', longitude: 126.85, latitude: 36.68, offsetMinutes: -32.6 },
  { name: '태안', fullName: '대한민국 충청남도 태안군', province: '충청남도', longitude: 126.30, latitude: 36.75, offsetMinutes: -34.8 },

  // 전북특별자치도
  { name: '전주', fullName: '대한민국 전북특별자치도 전주시', province: '전북특별자치도', longitude: 127.15, latitude: 35.82, offsetMinutes: -31.4 },
  { name: '군산', fullName: '대한민국 전북특별자치도 군산시', province: '전북특별자치도', longitude: 126.74, latitude: 35.97, offsetMinutes: -33.0 },
  { name: '익산', fullName: '대한민국 전북특별자치도 익산시', province: '전북특별자치도', longitude: 126.96, latitude: 35.95, offsetMinutes: -32.2 },
  { name: '정읍', fullName: '대한민국 전북특별자치도 정읍시', province: '전북특별자치도', longitude: 126.86, latitude: 35.57, offsetMinutes: -32.6 },
  { name: '남원', fullName: '대한민국 전북특별자치도 남원시', province: '전북특별자치도', longitude: 127.39, latitude: 35.42, offsetMinutes: -30.4 },
  { name: '김제', fullName: '대한민국 전북특별자치도 김제시', province: '전북특별자치도', longitude: 126.88, latitude: 35.80, offsetMinutes: -32.5 },
  { name: '완주', fullName: '대한민국 전북특별자치도 완주군', province: '전북특별자치도', longitude: 127.16, latitude: 35.90, offsetMinutes: -31.4 },
  { name: '진안', fullName: '대한민국 전북특별자치도 진안군', province: '전북특별자치도', longitude: 127.43, latitude: 35.79, offsetMinutes: -30.3 },
  { name: '무주', fullName: '대한민국 전북특별자치도 무주군', province: '전북특별자치도', longitude: 127.66, latitude: 36.01, offsetMinutes: -29.4 },
  { name: '장수', fullName: '대한민국 전북특별자치도 장수군', province: '전북특별자치도', longitude: 127.52, latitude: 35.65, offsetMinutes: -29.9 },
  { name: '임실', fullName: '대한민국 전북특별자치도 임실군', province: '전북특별자치도', longitude: 127.28, latitude: 35.62, offsetMinutes: -30.9 },
  { name: '순창', fullName: '대한민국 전북특별자치도 순창군', province: '전북특별자치도', longitude: 127.14, latitude: 35.37, offsetMinutes: -31.4 },
  { name: '고창', fullName: '대한민국 전북특별자치도 고창군', province: '전북특별자치도', longitude: 126.70, latitude: 35.44, offsetMinutes: -33.2 },
  { name: '부안', fullName: '대한민국 전북특별자치도 부안군', province: '전북특별자치도', longitude: 126.73, latitude: 35.73, offsetMinutes: -33.1 },

  // 전라남도
  { name: '목포', fullName: '대한민국 전라남도 목포시', province: '전라남도', longitude: 126.39, latitude: 34.81, offsetMinutes: -34.4 },
  { name: '여수', fullName: '대한민국 전라남도 여수시', province: '전라남도', longitude: 127.66, latitude: 34.76, offsetMinutes: -29.4 },
  { name: '순천', fullName: '대한민국 전라남도 순천시', province: '전라남도', longitude: 127.49, latitude: 34.95, offsetMinutes: -30.0 },
  { name: '나주', fullName: '대한민국 전라남도 나주시', province: '전라남도', longitude: 126.72, latitude: 35.02, offsetMinutes: -33.1 },
  { name: '광양', fullName: '대한민국 전라남도 광양시', province: '전라남도', longitude: 127.70, latitude: 34.94, offsetMinutes: -29.2 },
  { name: '담양', fullName: '대한민국 전라남도 담양군', province: '전라남도', longitude: 126.98, latitude: 35.32, offsetMinutes: -32.1 },
  { name: '곡성', fullName: '대한민국 전라남도 곡성군', province: '전라남도', longitude: 127.29, latitude: 35.28, offsetMinutes: -30.8 },
  { name: '구례', fullName: '대한민국 전라남도 구례군', province: '전라남도', longitude: 127.46, latitude: 35.20, offsetMinutes: -30.2 },
  { name: '고흥', fullName: '대한민국 전라남도 고흥군', province: '전라남도', longitude: 127.28, latitude: 34.61, offsetMinutes: -30.9 },
  { name: '보성', fullName: '대한민국 전라남도 보성군', province: '전라남도', longitude: 127.08, latitude: 34.77, offsetMinutes: -31.7 },
  { name: '화순', fullName: '대한민국 전라남도 화순군', province: '전라남도', longitude: 126.99, latitude: 35.06, offsetMinutes: -32.0 },
  { name: '장흥', fullName: '대한민국 전라남도 장흥군', province: '전라남도', longitude: 126.91, latitude: 34.68, offsetMinutes: -32.4 },
  { name: '강진', fullName: '대한민국 전라남도 강진군', province: '전라남도', longitude: 126.77, latitude: 34.64, offsetMinutes: -32.9 },
  { name: '해남', fullName: '대한민국 전라남도 해남군', province: '전라남도', longitude: 126.60, latitude: 34.57, offsetMinutes: -33.6 },
  { name: '영암', fullName: '대한민국 전라남도 영암군', province: '전라남도', longitude: 126.70, latitude: 34.80, offsetMinutes: -33.2 },
  { name: '무안', fullName: '대한민국 전라남도 무안군', province: '전라남도', longitude: 126.48, latitude: 34.99, offsetMinutes: -34.1 },
  { name: '함평', fullName: '대한민국 전라남도 함평군', province: '전라남도', longitude: 126.52, latitude: 35.07, offsetMinutes: -33.9 },
  { name: '영광', fullName: '대한민국 전라남도 영광군', province: '전라남도', longitude: 126.51, latitude: 35.28, offsetMinutes: -34.0 },
  { name: '장성', fullName: '대한민국 전라남도 장성군', province: '전라남도', longitude: 126.78, latitude: 35.30, offsetMinutes: -32.9 },
  { name: '완도', fullName: '대한민국 전라남도 완도군', province: '전라남도', longitude: 126.76, latitude: 34.31, offsetMinutes: -33.0 },
  { name: '진도', fullName: '대한민국 전라남도 진도군', province: '전라남도', longitude: 126.26, latitude: 34.48, offsetMinutes: -35.0 },
  { name: '신안', fullName: '대한민국 전라남도 신안군', province: '전라남도', longitude: 126.11, latitude: 34.83, offsetMinutes: -35.6 },

  // 경상북도
  { name: '포항', fullName: '대한민국 경상북도 포항시', province: '경상북도', longitude: 129.37, latitude: 36.02, offsetMinutes: -22.5 },
  { name: '경주', fullName: '대한민국 경상북도 경주시', province: '경상북도', longitude: 129.22, latitude: 35.86, offsetMinutes: -23.1 },
  { name: '김천', fullName: '대한민국 경상북도 김천시', province: '경상북도', longitude: 128.12, latitude: 36.14, offsetMinutes: -27.5 },
  { name: '안동', fullName: '대한민국 경상북도 안동시', province: '경상북도', longitude: 128.73, latitude: 36.57, offsetMinutes: -25.1 },
  { name: '구미', fullName: '대한민국 경상북도 구미시', province: '경상북도', longitude: 128.34, latitude: 36.12, offsetMinutes: -26.6 },
  { name: '영주', fullName: '대한민국 경상북도 영주시', province: '경상북도', longitude: 128.62, latitude: 36.81, offsetMinutes: -25.5 },
  { name: '영천', fullName: '대한민국 경상북도 영천시', province: '경상북도', longitude: 128.94, latitude: 35.97, offsetMinutes: -24.2 },
  { name: '상주', fullName: '대한민국 경상북도 상주시', province: '경상북도', longitude: 128.16, latitude: 36.42, offsetMinutes: -27.4 },
  { name: '문경', fullName: '대한민국 경상북도 문경시', province: '경상북도', longitude: 128.20, latitude: 36.59, offsetMinutes: -27.2 },
  { name: '경산', fullName: '대한민국 경상북도 경산시', province: '경상북도', longitude: 128.74, latitude: 35.83, offsetMinutes: -25.0 },
  { name: '의성', fullName: '대한민국 경상북도 의성군', province: '경상북도', longitude: 128.70, latitude: 36.35, offsetMinutes: -25.2 },
  { name: '청송', fullName: '대한민국 경상북도 청송군', province: '경상북도', longitude: 129.06, latitude: 36.44, offsetMinutes: -23.8 },
  { name: '영양', fullName: '대한민국 경상북도 영양군', province: '경상북도', longitude: 129.11, latitude: 36.66, offsetMinutes: -23.6 },
  { name: '영덕', fullName: '대한민국 경상북도 영덕군', province: '경상북도', longitude: 129.37, latitude: 36.42, offsetMinutes: -22.5 },
  { name: '청도', fullName: '대한민국 경상북도 청도군', province: '경상북도', longitude: 128.73, latitude: 35.65, offsetMinutes: -25.1 },
  { name: '고령', fullName: '대한민국 경상북도 고령군', province: '경상북도', longitude: 128.27, latitude: 35.73, offsetMinutes: -26.9 },
  { name: '성주', fullName: '대한민국 경상북도 성주군', province: '경상북도', longitude: 128.28, latitude: 35.92, offsetMinutes: -26.9 },
  { name: '칠곡', fullName: '대한민국 경상북도 칠곡군', province: '경상북도', longitude: 128.40, latitude: 35.99, offsetMinutes: -26.4 },
  { name: '예천', fullName: '대한민국 경상북도 예천군', province: '경상북도', longitude: 128.45, latitude: 36.66, offsetMinutes: -26.2 },
  { name: '봉화', fullName: '대한민국 경상북도 봉화군', province: '경상북도', longitude: 128.73, latitude: 36.89, offsetMinutes: -25.1 },
  { name: '울진', fullName: '대한민국 경상북도 울진군', province: '경상북도', longitude: 129.40, latitude: 36.99, offsetMinutes: -22.4 },
  { name: '울릉도', fullName: '대한민국 경상북도 울릉군', province: '경상북도', longitude: 130.91, latitude: 37.48, offsetMinutes: -16.4 },
  { name: '독도', fullName: '대한민국 경상북도 울릉군 독도리', province: '경상북도', longitude: 131.87, latitude: 37.24, offsetMinutes: -12.5 },

  // 경상남도
  { name: '창원', fullName: '대한민국 경상남도 창원시', province: '경상남도', longitude: 128.68, latitude: 35.23, offsetMinutes: -25.3 },
  { name: '진주', fullName: '대한민국 경상남도 진주시', province: '경상남도', longitude: 128.08, latitude: 35.18, offsetMinutes: -27.7 },
  { name: '통영', fullName: '대한민국 경상남도 통영시', province: '경상남도', longitude: 128.43, latitude: 34.85, offsetMinutes: -26.3 },
  { name: '사천', fullName: '대한민국 경상남도 사천시', province: '경상남도', longitude: 128.06, latitude: 35.00, offsetMinutes: -27.8 },
  { name: '김해', fullName: '대한민국 경상남도 김해시', province: '경상남도', longitude: 128.88, latitude: 35.23, offsetMinutes: -24.5 },
  { name: '밀양', fullName: '대한민국 경상남도 밀양시', province: '경상남도', longitude: 128.75, latitude: 35.50, offsetMinutes: -25.0 },
  { name: '거제', fullName: '대한민국 경상남도 거제시', province: '경상남도', longitude: 128.62, latitude: 34.88, offsetMinutes: -25.5 },
  { name: '양산', fullName: '대한민국 경상남도 양산시', province: '경상남도', longitude: 129.04, latitude: 35.34, offsetMinutes: -23.8 },
  { name: '의령', fullName: '대한민국 경상남도 의령군', province: '경상남도', longitude: 128.26, latitude: 35.32, offsetMinutes: -27.0 },
  { name: '함안', fullName: '대한민국 경상남도 함안군', province: '경상남도', longitude: 128.41, latitude: 35.28, offsetMinutes: -26.4 },
  { name: '창녕', fullName: '대한민국 경상남도 창녕군', province: '경상남도', longitude: 128.49, latitude: 35.54, offsetMinutes: -26.0 },
  { name: '고성(경남)', fullName: '대한민국 경상남도 고성군', province: '경상남도', longitude: 128.32, latitude: 34.98, offsetMinutes: -26.7 },
  { name: '남해', fullName: '대한민국 경상남도 남해군', province: '경상남도', longitude: 127.89, latitude: 34.84, offsetMinutes: -28.4 },
  { name: '하동', fullName: '대한민국 경상남도 하동군', province: '경상남도', longitude: 127.75, latitude: 35.07, offsetMinutes: -29.0 },
  { name: '산청', fullName: '대한민국 경상남도 산청군', province: '경상남도', longitude: 127.87, latitude: 35.42, offsetMinutes: -28.5 },
  { name: '함양', fullName: '대한민국 경상남도 함양군', province: '경상남도', longitude: 127.73, latitude: 35.52, offsetMinutes: -29.1 },
  { name: '거창', fullName: '대한민국 경상남도 거창군', province: '경상남도', longitude: 127.91, latitude: 35.69, offsetMinutes: -28.4 },
  { name: '합천', fullName: '대한민국 경상남도 합천군', province: '경상남도', longitude: 128.17, latitude: 35.57, offsetMinutes: -27.3 },

  // 제주특별자치도
  { name: '제주', fullName: '대한민국 제주특별자치도 제주시', province: '제주도', longitude: 126.53, latitude: 33.50, offsetMinutes: -33.9 },
  { name: '서귀포', fullName: '대한민국 제주특별자치도 서귀포시', province: '제주도', longitude: 126.56, latitude: 33.25, offsetMinutes: -33.8 },
];

// 기본 기본값 도시: 대한민국 서울특별시
export const DEFAULT_CITY: CityInfo = KOREA_CITIES[0];

// 대한민국 역대 서머타임 (일광절약시간제) 기간 판정
export function isDaylightSavingTime(year: number, month: number, day: number): boolean {
  // 1948~1951, 1955~1960, 1987~1988
  if (year === 1948) {
    return (month === 6 && day >= 1) || (month > 6 && month < 9) || (month === 9 && day <= 13);
  }
  if (year === 1949) {
    return (month === 4 && day >= 3) || (month > 4 && month < 9) || (month === 9 && day <= 11);
  }
  if (year === 1950) {
    return (month === 4 && day >= 1) || (month > 4 && month < 9) || (month === 9 && day <= 10);
  }
  if (year === 1951) {
    return (month === 5 && day >= 6) || (month > 5 && month < 9) || (month === 9 && day <= 9);
  }
  if (year === 1955) {
    return (month === 5 && day >= 5) || (month > 5 && month < 9) || (month === 9 && day <= 8);
  }
  if (year === 1956) {
    return (month === 5 && day >= 20) || (month > 5 && month < 9) || (month === 9 && day <= 29);
  }
  if (year === 1957) {
    return (month === 5 && day >= 5) || (month > 5 && month < 9) || (month === 9 && day <= 21);
  }
  if (year === 1958) {
    return (month === 5 && day >= 4) || (month > 5 && month < 9) || (month === 9 && day <= 20);
  }
  if (year === 1959) {
    return (month === 5 && day >= 3) || (month > 5 && month < 9) || (month === 9 && day <= 19);
  }
  if (year === 1960) {
    return (month === 5 && day >= 1) || (month > 5 && month < 9) || (month === 9 && day <= 17);
  }
  if (year === 1987) {
    return (month === 5 && day >= 10) || (month > 5 && month < 10) || (month === 10 && day <= 11);
  }
  if (year === 1988) {
    return (month === 5 && day >= 8) || (month > 5 && month < 10) || (month === 10 && day <= 9);
  }
  return false;
}

// 대한민국 표준시 자오선 역사 판정 (동경 127.5도 vs 135도)
export function getStandardMeridian(year: number, month: number, day: number): number {
  const dateNum = year * 10000 + month * 100 + day;
  // 1908.04.01 ~ 1911.12.31: 127.5도
  if (dateNum >= 19080401 && dateNum <= 19111231) return 127.5;
  // 1912.01.01 ~ 1954.03.20: 135.0도
  if (dateNum >= 19120101 && dateNum <= 19540320) return 135.0;
  // 1954.03.21 ~ 1961.08.09: 127.5도
  if (dateNum >= 19540321 && dateNum <= 19610809) return 127.5;
  // 1961.08.10 ~ 현재: 135.0도
  return 135.0;
}

// 도시 및 날짜 기준 진태양시 총 보정 분 계산
export function calculateSolarTimeOffset(
  city: CityInfo,
  year: number,
  month: number,
  day: number
): {
  meridian: number;
  longitudeDiffMinutes: number;
  dstMinutes: number;
  totalOffsetMinutes: number;
  isDst: boolean;
} {
  const meridian = getStandardMeridian(year, month, day);
  // 경도 1도당 4분 (출생지 경도 - 표준자오선) * 4
  const longitudeDiffMinutes = Math.round((city.longitude - meridian) * 4 * 10) / 10;
  const isDst = isDaylightSavingTime(year, month, day);
  const dstMinutes = isDst ? -60 : 0; // 서머타임이면 시계가 1시간 빨랐으므로 태양시는 1시간 뺌
  const totalOffsetMinutes = Math.round((longitudeDiffMinutes + dstMinutes) * 10) / 10;

  return {
    meridian,
    longitudeDiffMinutes,
    dstMinutes,
    totalOffsetMinutes,
    isDst,
  };
}

// 시·분 및 보정값 기준 12간지시(시간대) 판정
export function getHourPillarBranch(
  hour: number,
  minute: number,
  applySolarCorrection: boolean = true,
  city: CityInfo = DEFAULT_CITY,
  year: number = 1995,
  month: number = 5,
  day: number = 20
): {
  branchName: string;
  branchHanja: string;
  timeRangeStr: string;
  adjustedHour: number;
  adjustedMinute: number;
  isJasi: boolean;
} {
  let totalMin = hour * 60 + minute;

  if (applySolarCorrection) {
    const { totalOffsetMinutes } = calculateSolarTimeOffset(city, year, month, day);
    totalMin += Math.round(totalOffsetMinutes);
    if (totalMin < 0) totalMin += 1440;
    totalMin = totalMin % 1440;
  }

  const adjH = Math.floor(totalMin / 60);
  const adjM = totalMin % 60;

  // 12간지시 경계선 (동경 135도 표준시 기준, 또는 진태양시 기준 00:00이 자시 중앙)
  // 자시: 23:00 ~ 00:59 (또는 표준시 보정 전 23:30~01:29)
  // 진태양시로 변환된 시간 기준:
  // 23:00 ~ 00:59 -> 자시
  // 01:00 ~ 02:59 -> 축시
  // 03:00 ~ 04:59 -> 인시
  // 05:00 ~ 06:59 -> 묘시
  // 07:00 ~ 08:59 -> 진시
  // 09:00 ~ 10:59 -> 사시
  // 11:00 ~ 12:59 -> 오시
  // 13:00 ~ 14:59 -> 미시
  // 15:00 ~ 16:59 -> 신시
  // 17:00 ~ 18:59 -> 유시
  // 19:00 ~ 20:59 -> 술시
  // 21:00 ~ 22:59 -> 해시

  let branchName = '자시';
  let branchHanja = '子時';
  let timeRangeStr = '23:30 ~ 01:30';
  let isJasi = false;

  // 1440분 기준 (0~1439)
  // 표준시 기준 (한국 시계 23:30~01:29 자시)
  // 입력된 hour, minute을 그대로 볼 때:
  const rawMin = hour * 60 + minute;

  if (rawMin >= 23 * 60 + 30 || rawMin < 1 * 60 + 30) {
    branchName = '자시';
    branchHanja = '子時';
    timeRangeStr = '23:30 ~ 01:30';
    isJasi = true;
  } else if (rawMin >= 1 * 60 + 30 && rawMin < 3 * 60 + 30) {
    branchName = '축시';
    branchHanja = '丑時';
    timeRangeStr = '01:30 ~ 03:30';
  } else if (rawMin >= 3 * 60 + 30 && rawMin < 5 * 60 + 30) {
    branchName = '인시';
    branchHanja = '寅時';
    timeRangeStr = '03:30 ~ 05:30';
  } else if (rawMin >= 5 * 60 + 30 && rawMin < 7 * 60 + 30) {
    branchName = '묘시';
    branchHanja = '卯時';
    timeRangeStr = '05:30 ~ 07:30';
  } else if (rawMin >= 7 * 60 + 30 && rawMin < 9 * 60 + 30) {
    branchName = '진시';
    branchHanja = '辰時';
    timeRangeStr = '07:30 ~ 09:30';
  } else if (rawMin >= 9 * 60 + 30 && rawMin < 11 * 60 + 30) {
    branchName = '사시';
    branchHanja = '巳時';
    timeRangeStr = '09:30 ~ 11:30';
  } else if (rawMin >= 11 * 60 + 30 && rawMin < 13 * 60 + 30) {
    branchName = '오시';
    branchHanja = '午時';
    timeRangeStr = '11:30 ~ 13:30';
  } else if (rawMin >= 13 * 60 + 30 && rawMin < 15 * 60 + 30) {
    branchName = '미시';
    branchHanja = '未時';
    timeRangeStr = '13:30 ~ 15:30';
  } else if (rawMin >= 15 * 60 + 30 && rawMin < 17 * 60 + 30) {
    branchName = '신시';
    branchHanja = '申時';
    timeRangeStr = '15:30 ~ 17:30';
  } else if (rawMin >= 17 * 60 + 30 && rawMin < 19 * 60 + 30) {
    branchName = '유시';
    branchHanja = '酉時';
    timeRangeStr = '17:30 ~ 19:30';
  } else if (rawMin >= 19 * 60 + 30 && rawMin < 21 * 60 + 30) {
    branchName = '술시';
    branchHanja = '戌時';
    timeRangeStr = '19:30 ~ 21:30';
  } else {
    branchName = '해시';
    branchHanja = '亥時';
    timeRangeStr = '21:30 ~ 23:30';
  }

  return {
    branchName,
    branchHanja,
    timeRangeStr,
    adjustedHour: adjH,
    adjustedMinute: adjM,
    isJasi,
  };
}
