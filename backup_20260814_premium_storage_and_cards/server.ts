import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { calculateSajuWonGuk, selectCelebMatch } from "./src/data/sajuCalculations.ts";
import { SajuInput, SajuAnalysisResult } from "./src/types.ts";

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoint for Saju Analysis & MZ Celeb Matching
app.post("/api/saju/analyze", async (req, res) => {
  try {
    const input: SajuInput = req.body;
    const { birthYear, birthMonth, birthDay, birthHour, calendarType, gender, name } = input;

    // Validate birth year range
    if (!birthYear || birthYear < 1900 || birthYear > 2050) {
      return res.status(400).json({
        success: false,
        error: "지원하지 않는 연도입니다. (1900~2050년 사이만 입력 가능합니다)",
      });
    }

    // Calculate baseline Saju Won-Guk
    const wonGukData = calculateSajuWonGuk(input);
    const dayStem = wonGukData.dayStem;
    const fallbackCeleb = selectCelebMatch(input, STEMS_INDEX_MAP[dayStem.name] || 0);

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const prompt = `
당신은 전통 사주명리학(십성, 신살)에 통찰력이 깊고, 트렌디한 MZ세대 성향 분석에 능한 수석 사주 칼럼니스트입니다.
아래 사용자의 사주 명식을 정밀하게 분석하고, 조건에 완벽하게 부합하는 트렌디한 유명인(셀럽)을 매칭하세요.

[사용자 입력 정보]
- 이름: ${name || '사용자'}
- 성별: ${gender === 'female' ? '여성' : '남성'}
- 생년월일: ${birthYear}년 ${birthMonth}월 ${birthDay}일 (${calendarType === 'solar' ? '양력' : '음력'})
- 출생시: ${birthHour}
- 계산된 일간(Day Master): ${dayStem.name}(${dayStem.hanja}), 오행: ${dayStem.element}
- 사주 원국:
  - 년주: ${wonGukData.yearPillar.stemHanja}${wonGukData.yearPillar.branchHanja} (${wonGukData.yearPillar.tenGodStem})
  - 월주: ${wonGukData.monthPillar.stemHanja}${wonGukData.monthPillar.branchHanja} (${wonGukData.monthPillar.tenGodStem})
  - 일주: ${wonGukData.dayPillar.stemHanja}${wonGukData.dayPillar.branchHanja} (일간)
  - 시주: ${wonGukData.hourPillar.stemHanja}${wonGukData.hourPillar.branchHanja} (${wonGukData.hourPillar.tenGodStem})

[엄격 준수 규칙]
1. 사주 분석의 뼈대 (십성 및 신살 적용):
   - 일간과 월주/년주를 바탕으로 주요 십성(비견, 겁재, 식신, 상관, 편재, 정재, 편관, 정관, 편인, 정인)과 주요 신살(도화살, 화개살, 역마살, 장성살 등)을 도출하고 사용자의 현대적 성향과 강점으로 논리적으로 풀어서 설명하세요.
   - 오늘의 운세나 시기별 일회성 운세는 절대 포함하지 마세요. 타고난 본질에만 집중합니다.
2. 유명인 매칭 필터링 조건 (매우 중요):
   - 성별 일치: 사용자의 성별과 **반드시 동일한 동성**의 인물만 매칭하세요. (여성 사용자 -> 여성 셀럽, 남성 사용자 -> 남성 셀럽)
   - 연령 제한: 현재 기준 **30대 이하(20~30대)**의 트렌디하고 대중적인 유명인(아이돌, 배우, 인플루언서, 아티스트) 중에서만 매칭하세요. 역사적 인물, 정치인, 원로는 절대 제외합니다.
   - 사주적 연관성: 도출된 십성/신살 특징과 해당 셀럽의 대외적 캐릭터성이 논리적으로 맞아떨어져야 합니다.
3. 결과의 일관성 유지:
   - 동일 사주 정보 입력 시 주요 매칭 셀럽과 성향 키워드가 일관성을 유지하도록 하세요.

반드시 요청된 JSON 응답 구조로 출력하세요.
`;

        // Retry mechanism across models (gemini-3.6-flash -> gemini-flash-latest) to handle temporary 503 spikes
        const callGeminiWithRetry = async () => {
          const modelsToTry = ["gemini-3.6-flash", "gemini-flash-latest"];
          let lastError: any = null;

          for (const modelName of modelsToTry) {
            for (let attempt = 0; attempt < 2; attempt++) {
              try {
                const res = await ai.models.generateContent({
                  model: modelName,
                  contents: prompt,
                  config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                      type: Type.OBJECT,
                      properties: {
                        matchPercentage: { type: Type.INTEGER, description: "매칭률 85~99 사이" },
                        celebName: { type: Type.STRING, description: "30대 이하 동성 셀럽 이름" },
                        celebOccupation: { type: Type.STRING, description: "셀럽의 직업 및 그룹/분야" },
                        celebCategory: { type: Type.STRING, description: "아이돌, 배우, 방송인 등" },
                        celebAgeGroup: { type: Type.STRING, description: "20대 또는 30대" },
                        sajuPoints: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "셀럽과 찰떡인 사주 포인트 (십성·신살 기반 연유) 3가지"
                        },
                        summary: { type: Type.STRING, description: "사주 본질 총평 및 한 줄 메시지" },
                        dayMasterDesc: { type: Type.STRING, description: "일간 본질 해석" },
                        dominantTenGod: { type: Type.STRING, description: "주격 십성 명칭" },
                        keySinsal: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                          description: "주요 신살 목록"
                        }
                      },
                      required: ["matchPercentage", "celebName", "celebOccupation", "celebCategory", "celebAgeGroup", "sajuPoints", "summary", "dayMasterDesc", "dominantTenGod", "keySinsal"]
                    }
                  }
                });
                return res;
              } catch (err: any) {
                lastError = err;
                const isTransient = err?.status === 503 || err?.code === 503 || (err?.message && String(err.message).includes("503"));
                if (isTransient && attempt < 1) {
                  await new Promise((resolve) => setTimeout(resolve, 1000));
                  continue;
                }
                break;
              }
            }
          }
          throw lastError;
        };

        const response = await callGeminiWithRetry();

        const jsonText = response.text?.trim();
        if (jsonText) {
          const aiData = JSON.parse(jsonText);
          const result: SajuAnalysisResult = {
            matchPercentage: aiData.matchPercentage || 96,
            celebName: aiData.celebName || fallbackCeleb.name,
            celebOccupation: aiData.celebOccupation || fallbackCeleb.occupation,
            celebCategory: aiData.celebCategory || "아티스트",
            celebGender: gender,
            celebAgeGroup: aiData.celebAgeGroup || fallbackCeleb.ageGroup,
            sajuPoints: (aiData.sajuPoints && aiData.sajuPoints.length >= 3)
              ? [String(aiData.sajuPoints[0]), String(aiData.sajuPoints[1]), String(aiData.sajuPoints[2])] as [string, string, string]
              : fallbackCeleb.points,
            summary: aiData.summary || fallbackCeleb.summary,
            dayMaster: {
              stem: dayStem.name,
              hanja: dayStem.hanja,
              elementName: dayStem.element,
              description: aiData.dayMasterDesc || `${dayStem.name}(${dayStem.hanja}) 일간의 당당하고 기품 있는 본질`
            },
            dominantTenGod: aiData.dominantTenGod || wonGukData.dayPillar.tenGodBranch,
            keySinsal: aiData.keySinsal || [wonGukData.dayPillar.sinsal || '도화살', wonGukData.yearPillar.sinsal || '역마살'],
            wonGuk: {
              yearPillar: wonGukData.yearPillar,
              monthPillar: wonGukData.monthPillar,
              dayPillar: wonGukData.dayPillar,
              hourPillar: wonGukData.hourPillar,
            },
            isUnknownTime: !!input.isUnknownTime,
          };
          return res.json({ success: true, result });
        }
      } catch (geminiErr: any) {
        const isQuota = geminiErr?.status === 429 || geminiErr?.code === 429 || String(geminiErr?.message).includes("429") || String(geminiErr?.message).includes("RESOURCE_EXHAUSTED");
        if (isQuota) {
          console.warn("Gemini API free tier quota limit reached (429). Seamlessly using deterministic Saju engine fallback.");
        } else {
          console.warn("Gemini API call warning, using deterministic fallback Saju engine:", geminiErr?.message || geminiErr);
        }
      }
    }

    // Fallback deterministic response when Gemini API is unavailable or missing key
    const fallbackResult: SajuAnalysisResult = {
      matchPercentage: 92 + (birthDay % 7),
      celebName: fallbackCeleb.name,
      celebOccupation: fallbackCeleb.occupation,
      celebCategory: "셀럽/아티스트",
      celebGender: gender,
      celebAgeGroup: fallbackCeleb.ageGroup,
      sajuPoints: fallbackCeleb.points,
      summary: fallbackCeleb.summary,
      dayMaster: {
        stem: dayStem.name,
        hanja: dayStem.hanja,
        elementName: dayStem.element,
        description: `${dayStem.name}(${dayStem.hanja}) 일간의 타고난 리더쉽과 세련된 본질`
      },
      dominantTenGod: fallbackCeleb.dominantTrait,
      keySinsal: [wonGukData.dayPillar.sinsal || '도화살', wonGukData.yearPillar.sinsal || '역마살'],
      wonGuk: {
        yearPillar: wonGukData.yearPillar,
        monthPillar: wonGukData.monthPillar,
        dayPillar: wonGukData.dayPillar,
        hourPillar: wonGukData.hourPillar,
      },
      isUnknownTime: !!input.isUnknownTime,
    };

    return res.json({ success: true, result: fallbackResult });

  } catch (error) {
    console.error("Saju Analysis Error:", error);
    return res.status(500).json({ success: false, error: "사주 분석 중 오류가 발생했습니다." });
  }
});

const STEMS_INDEX_MAP: Record<string, number> = {
  '갑': 0, '을': 1, '병': 2, '정': 3, '무': 4, '기': 5, '경': 6, '신': 7, '임': 8, '계': 9
};

// Vite dev server or static distribution
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
