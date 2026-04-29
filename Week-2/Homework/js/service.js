/**
 * 필터 조건들 타입 
 * @typedef {Object} FilterConditions
 * @property {string} title - 제목 검색 키워드
 * @property {string} type - 내역 타입 (수입/지출/전체)
 * @property {string} category - 선택된 카테고리
 * @property {string} method - 선택된 결제 수단
 */

/** 가계부 로직 */
const ExpenseService = {
  /**
   * 조건에 따라 가계부 내역을 필터링합니다.
   * @param {Expense[]} expenses - 전체 내역
   * @param {FilterConditions} conditions - 필터 조건
   * @returns {Expense[]} 필터링된 결과
   */
  filter(expenses, conditions) {
    return expenses.filter((item) => {
      const isTitleMatched =
        !conditions.title || item.title.toLowerCase().includes(conditions.title);
      const isCategoryMatched =
        !conditions.category || item.category === conditions.category;
      const isMethodMatched =
        !conditions.method || item.payment === conditions.method;
      const isTypeMatched =
        !conditions.type ||
        (conditions.type === "수입" && item.amount > 0) ||
        (conditions.type === "지출" && item.amount < 0);

      return isTitleMatched && isCategoryMatched && isMethodMatched && isTypeMatched;
    });
  },

  /**
   * 특정 키(카테고리, 결제수단 등)의 중복 없는 값 목록을 추출합니다.
   * @param {Expense[]} expenses - 대상 내역
   * @param {string} key - 대상 속성 키
   * @returns {string[]} 중복이 제거된 값들의 배열
   */
  getUniqueValues(expenses, key) {
    const values = new Set();

    for (const item of expenses) {
      const value = item[key];
      if (value) values.add(value);
    }

    return [...values];
  },

  /**
   * 날짜를 기준으로 데이터를 정렬합니다.
   * @param {Expense[]} expenses - 정렬할 내역
   * @param {string} order - 정렬 순서 ('desc': 최신순, 'asc': 과거순)
   * @returns {Expense[]} 정렬된 새 배열
   */
  sortByOrder(expenses, order) {
    const direction = order === "asc" || order === "desc" ? order : "desc";

    return [...expenses].sort((a, b) => {
      return direction === "desc"
        ? b.date.localeCompare(a.date)
        : a.date.localeCompare(b.date);
    });
  },

  /**
   * 금액 데이터를 화면 표시용 텍스트와 클래스명으로 포맷팅합니다.
   * @param {number} amount - 금액
   * @returns {{text: string, className: string}} 포맷팅된 결과 객체
   */
  formatAmount(amount) {
    const isIncome = amount > 0;
    return {
      text: (isIncome ? "+" : "") + amount.toLocaleString(),  // 음수면 마이너스 붙어있으니 그대로 사용
      className: isIncome ? "amount--income" : "amount--expense",
    };
  },

  /**
   * 가계부 내역 추가를 위한 고유 ID를 생성합니다.
   * @param {Expense[]} expenses - 현재 전체 내역
   * @returns {number} 새 ID 값
   */
  generateId(expenses) {
    let maxId = 0;
    for (const expense of expenses) {
      if (expense.id > maxId) maxId = expense.id;
    }
    return maxId + 1;
  },

  /**
   * 비어 있지 않은 고유 값 목록을 정렬해 반환합니다.
   * @param {Expense[]} expenses - 대상 내역
   * @param {"category"|"payment"} key - 대상 속성 키
   * @returns {string[]} 정리된 값 목록
   */
  getSortedUniqueValues(expenses, key) {
    return this.getUniqueValues(expenses, key)
      .sort((a, b) => a.localeCompare(b, "ko"));
  },
};

export { ExpenseService };
