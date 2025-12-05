E2E 실행 가이드

루트에 있는 간단 E2E 스크립트는 아래 플로우를 자동화합니다:

1. 임시 사용자 회원가입
2. 로그인하여 JWT 토큰 수신
3. 룰렛 스핀 호출 (로그인 필요)
4. 내 쿠폰 목록 조회

요구사항
- Node.js 18+ (글로벌 `fetch` 사용)
- 서버(`server`)가 실행 중이어야 함 (기본: http://localhost:4000)

실행
PowerShell에서:

```powershell
# 루트에서
node scripts/e2e/e2e_flow.js

# 다른 API URL을 사용하려면
$env:API_URL = "http://localhost:4000/api"; node scripts/e2e/e2e_flow.js
```

결과
- 콘솔에 각 단계별 결과가 출력됩니다. 오류가 발생하면 스크립트가 비정상 종료하며 에러 메시지를 출력합니다.

주의
- 스크립트는 테스트용 임시 계정을 생성합니다. 이미 같은 이메일이 존재하면 실패할 수 있으니 정상적으로 작동하지 않으면 서버 DB를 확인하세요.
