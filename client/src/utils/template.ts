const aiTemplate = (name: string, code: string) => {
  return `
    주식 분석 
    주식 이름: ${name} 주식 코드: ${code}
    매수/매도 조언 및 근거 설명
  `;
};

const investAdviceTemplate = (name: string, code: string) => {
  return `
    투자 조언
    주식 이름: ${name} 주식 코드: ${code}
    투자 조언 및 근거 설명
  `;
};
const recommendTemplate = () => {
  return `
    종목 추천
    최근 주식 투자 트렌드 및 추세 분석
    추천 테마 종목 추천 및 근거 설명
  `;
};

export const STOCK_TEMPLATE = {
  aiTemplate,
  investAdviceTemplate,
  recommendTemplate,
};
