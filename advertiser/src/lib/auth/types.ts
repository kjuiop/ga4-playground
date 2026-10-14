export interface TestAccount {
  loginId: string;
  /** GA4 user_id — PII 가 아닌 임의 값 */
  userId: string;
  label: string;
}

export interface AuthProvider {
  listAccounts(): TestAccount[];
  findByLoginId(loginId: string): TestAccount | undefined;
}
