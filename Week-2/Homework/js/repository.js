const STORAGE_KEY = "expense_data";

/**
 * Expense 데이터 타입 
 * @typedef {Object} Expense
 * @property {number} id - 고유 식별자
 * @property {string} title - 지출/수입 내역 제목
 * @property {string} date - 날짜 (YYYY-MM-DD)
 * @property {string} category - 카테고리 (식비, 문화 등)
 * @property {string} payment - 결제 수단 (신용카드, 현금 등)
 * @property {number} amount - 금액 (양수는 수입, 음수는 지출)
 */

/** 저장소 접근 */
const ExpenseRepository = {
  /** @type {Expense[]|null} 내부 캐시 데이터 */
  _cache: null,
  /** @type {Map<number, Expense>|null} ID 조회용 캐시 */
  _cacheById: null,

  /** ID 캐시를 다시 만듭니다. */
  _rebuildIndex() {
    this._cacheById = new Map(this._cache.map((item) => [item.id, item]));
  },

  /**
   * 로컬 스토리지 또는 캐시에서 데이터를 가져옵니다.
   * @returns {Expense[]} 가계부 내역 배열
   */
  getAll() {
    if (this._cache === null) {
      this._cache = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      this._rebuildIndex();
    }
    return this._cache;
  },

  /**
   * ID로 내역 하나를 조회합니다.
   * @param {number} idToSearch - 조회할 내역 ID
   * @returns {Expense|undefined} 조회된 내역
   */
  getById(idToSearch) {
    if (this._cacheById === null) this.getAll();
    return this._cacheById.get(idToSearch);
  },

  /**
   * 데이터를 캐시에 저장하고 로컬 스토리지를 동기화합니다.
   * @param {Expense[]} expenses - 저장할 가계부 내역 배열
   */
  save(expenses) {
    this._cache = expenses;
    this._rebuildIndex();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  },

  /**
   * 앱 실행 시 초기 데이터를 준비합니다.
   * @param {Expense[]} initialData - 스토리지에 데이터가 없을 경우 저장할 초기 데이터
   */
  prepare(initialData) {
    if (!localStorage.getItem(STORAGE_KEY)) this.save(initialData);
  },
};

export { ExpenseRepository };
