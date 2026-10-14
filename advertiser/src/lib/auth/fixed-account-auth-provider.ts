import type { AuthProvider, TestAccount } from "./types";

/**
 * 계정 ↔ user_id 매핑을 코드에 고정한다.
 * 어느 기기에서 로그인하든 같은 user_id 가 전송되는 것이 크로스 디바이스 연결의 전제.
 * api 단계에서 ApiAuthProvider 로 교체한다.
 */
const ACCOUNTS: TestAccount[] = [
  { loginId: "test_a", userId: "xd_a_001", label: "시나리오 A" },
  { loginId: "test_b", userId: "xd_b_001", label: "시나리오 B" },
  { loginId: "test_c", userId: "xd_c_001", label: "시나리오 C (대조군)" },
  { loginId: "test_d", userId: "xd_d_001", label: "시나리오 D" },
];

export class FixedAccountAuthProvider implements AuthProvider {
  listAccounts(): TestAccount[] {
    return ACCOUNTS;
  }

  findByLoginId(loginId: string): TestAccount | undefined {
    return ACCOUNTS.find((account) => account.loginId === loginId);
  }
}

export const authProvider: AuthProvider = new FixedAccountAuthProvider();
