/** 목 데이터 응답에 네트워크 지연을 흉내 낼 때 써요. */
export function delay(ms = 300) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}
