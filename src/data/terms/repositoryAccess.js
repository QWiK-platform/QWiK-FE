export const repositoryAccess = {
  title: "GitHub 레포지토리 접근 동의서",
  subtitle: "QWiK 서비스 이용을 위해 다음 권한에 동의합니다",
  lastUpdated: "2025.11.21",
  effectiveDate: "2025.11.21",

  sections: [
    {
      id: "scope",
      title: "1. 접근 권한 범위",
      content: `  • GitHub 계정 기본 정보 (사용자명, 이메일)
  • 공개 레포지토리 목록 조회  
  • 요청한 레포지토리 소스 코드 접근
  
  ※ 추후 Private 레포지토리 접근 기능이 추가될 예정입니다.`,
      isOpen: false,
    },
    {
      id: "purpose",
      title: "2. 정보 이용 목적",
      content: `  • 레포지토리 소유권 확인
  • 배포용 Docker 이미지 빌드
  • 코드 안정성 검증`,
      isOpen: false,
    },
    {
      id: "security",
      title: "3. 보안 약속",
      content: `  • 개인 정보는 수집하지 않습니다
  • 코드는 배포 목적으로만 사용됩니다  
  • Private 레포지토리는 접근하지 않습니다
  
  ※ Private 레포지토리 기능 추가 시 별도 동의를 받을 예정입니다.`,
      isOpen: false,
    },
    {
      id: "notice",
      title: "4. 서비스 이용 제한 안내",
      content: `  동의하지 않으실 경우 서비스 이용이 제한됩니다.
  
  • GitHub OAuth 인증 불가
  • 레포지토리 배포 서비스 이용 불가
  • 대시보드 접근 제한`,
      isOpen: false,
    },
  ],
};

export default repositoryAccess;
