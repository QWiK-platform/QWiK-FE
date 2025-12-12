export const planList = {
  STARTER: {
    sortId: 1,
    projects: 3,
    description: "QWiK에 가입한 회원 누구나 사용할 수 있습니다.",
    memory: "500",
    traffic: "3000",
    domains: 0,
    projectCapacity: "200",
    amount: 0,
    isPopular: false,
  },
  BASIC: {
    sortId: 2,
    projects: 7,
    description:
      "개인 작업자에게 적합한 요금제로, 보다 많은 프로젝트를 배포할 수 있습니다.",
    memory: "3000",
    traffic: "20000",
    domains: 1,
    projectCapacity: "500",
    amount: 4400,
    isPopular: true,
  },
  PRO: {
    sortId: 3,
    projects: 15,
    description:
      "여러 프로젝트를 동시에 진행하는 팀 규모에 적합한 요금제로, 가장 많은 프로젝트를 배포할 수 있으며, 추가 트래픽을 제공합니다.",
    memory: "7500",
    traffic: "50000",
    domains: 1,
    projectCapacity: "500",
    extraBenefit: {
      traffic: "10000",
    },
    amount: 7700,
    isPopular: false,
  },
};
