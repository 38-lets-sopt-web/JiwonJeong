import defaultExpenses from "./default_expenses.json" with { type: "json" };

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

/**
 * 필터 조건들 타입 
 * @typedef {Object} FilterConditions
 * @property {string} title - 제목 검색 키워드
 * @property {string} type - 내역 타입 (수입/지출/전체)
 * @property {string} category - 선택된 카테고리
 * @property {string} method - 선택된 결제 수단
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

/** 가계부 로직 */
const ExpenseService = {
  /**
   * 조건에 따라 가계부 내역을 필터링합니다.
   * @param {Expense[]} expenses - 전체 내역
   * @param {FilterConditions} conditions - 필터 조건
   * @returns {Expense[]} 필터링된 결과
   */
  filter(expenses, conditions) {
    const hasActiveFilters =
      conditions.title ||
      conditions.type ||
      conditions.category ||
      conditions.method;

    if (!hasActiveFilters) return expenses;  // 활성 필터 없다면 그대로 리턴(종료)

    // 필터가 비어 있지 않다면 OR비교연산자 우측 조건으로 필터링
    return expenses.filter((item) => {
      const isTitleMatched =
        !conditions.title || item.title.toLowerCase().includes(conditions.title);
      const isCategoryMatched =
        !conditions.category || item.category === conditions.category;
      const isMethodMatched =
        !conditions.method || item.payment === conditions.method;
      let isTypeMatched = true;
      if (conditions.type === "수입") isTypeMatched = item.amount > 0;
      if (conditions.type === "지출") isTypeMatched = item.amount < 0;
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
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "ko"));
  },
};

/** 화면 렌더링과 DOM 관리 */
const ExpenseView = {
  /** DOM 요소 캐싱 */
  el: {
    filter: {
      title: document.getElementById("filter-title"),
      type: document.getElementById("filter-type"),
      category: document.getElementById("filter-category"),
      method: document.getElementById("filter-method"),
      applyBtn: document.getElementById("apply-btn"),
      resetBtn: document.getElementById("reset-btn"),
    },
    ledger: {
      tableBody: document.querySelector("#expense-table tbody"),
      totalDisplay: document.getElementById("total-amount"),
      allCheck: document.getElementById("all-check"),
      sortOrder: document.getElementById("sort-order"),
      deleteBtn: document.getElementById("delete-btn"),
      addBtn: document.getElementById("add-btn"),
    },
    modal: {
      root: document.getElementById("add-modal"),
      title: document.getElementById("modal-title"),
      amount: document.getElementById("modal-amount"),
      date: document.getElementById("modal-date"),
      categorySelect: document.getElementById("modal-category-select"),
      categoryInput: document.getElementById("modal-category"),
      paymentSelect: document.getElementById("modal-payment-select"),
      paymentInput: document.getElementById("modal-payment"),
      saveBtn: document.getElementById("modal-save-btn"),
      cancelBtn: document.getElementById("modal-cancel-btn"),
      typeBtns: document.querySelectorAll(".type-toggle__btn"),
    },
    detail: {
      root: document.getElementById("detail-modal"),
      closeBtn: document.getElementById("detail-close-btn"),
      amount: document.getElementById("detail-amount"),
      title: document.getElementById("detail-title"),
      date: document.getElementById("detail-date"),
      category: document.getElementById("detail-category"),
      payment: document.getElementById("detail-payment"),
    },
  },

  /** @type {string} 추가 모달의 현재 선택 타입 ('income'|'expense') */
  _addModalSelectedType: "expense",

  /**
   * Select 옵션을 바꾸고 기존 선택값을 최대한 유지합니다.
   * @param {HTMLSelectElement} select - 대상 Select 요소
   * @param {string[]} items - 옵션 목록
   * @param {string} label - 기본 옵션 라벨
   */
  setSelectOptions(select, items, label) {
    if (!select) return;

    const selected = select.value;
    const frag = document.createDocumentFragment();

    frag.appendChild(new Option(label, ""));
    for (const item of items) {
      frag.appendChild(new Option(item, item));
    }

    select.replaceChildren(frag);
    select.value = items.includes(selected) ? selected : "";
  },

  /**
   * 현재 필터링 UI의 상태값을 수집합니다.
   * @returns {FilterConditions} 필터 상태 객체
   */ 
  getFilterCurrState() {
    return {
      title: this.el.filter.title.value.trim().toLowerCase(),
      type: this.el.filter.type.value,
      category: this.el.filter.category.value,
      method: this.el.filter.method.value,
    };
  },

  /**
   * 필터 UI 입력을 모두 초기화합니다.
   */
  clearAllFilterState() {
    [
      this.el.filter.title,
      this.el.filter.type,
      this.el.filter.category,
      this.el.filter.method,
    ].forEach((el) => (el.value = ""));
  },

  /**
   * 가계부 내역 목록을 테이블에 렌더링하고 총계를 업데이트합니다.
   * @param {Expense[]} expenses - 렌더링할 내역 배열
   */
  render(expenses) {
    const frag = document.createDocumentFragment();
    let totalAmount = 0;
    this.el.ledger.tableBody.innerHTML = "";

    expenses.forEach((item) => {
      totalAmount += item.amount;
      const { text, className } = ExpenseService.formatAmount(item.amount);
      const tr = document.createElement("tr");
      tr.dataset.id = item.id;
      tr.classList.add("ledger__row--clickable");
      tr.innerHTML = `
        <td><input type="checkbox" class="ledger__row-check" data-id="${item.id}"></td>
        <td>${item.title}</td>
        <td class="${className}">${text}</td>
        <td>${item.date}</td>
        <td>${item.category}</td>
        <td>${item.payment}</td>
      `;
      frag.appendChild(tr);
    });

    this.el.ledger.tableBody.appendChild(frag);

    const { text, className } = ExpenseService.formatAmount(totalAmount);
    this.el.ledger.totalDisplay.textContent = text;
    this.el.ledger.totalDisplay.className = className;
  },

  /**
   * 현재 테이블에서 체크된 행들의 ID 목록을 가져옵니다.
   * @returns {number[]} 체크된 ID 배열
   */
  getCheckedIds() {
    return Array.from(
      this.el.ledger.tableBody.querySelectorAll(".ledger__row-check:checked"),
    ).map((cb) => Number(cb.dataset.id));
  },

  /**
   * 테이블 내 모든 체크박스의 상태를 일괄 변경합니다.
   * @param {boolean} checked - 체크 여부
   */
  toggleAllChecks(checked) {
    this.el.ledger.tableBody
      .querySelectorAll(".ledger__row-check")
      .forEach((cb) => (cb.checked = checked));
  },

  /**
   * 내역 추가 모달을 엽니다.
   */
  openAddModal() {
    const today = new Intl.DateTimeFormat('sv-SE').format(new Date());  // 포맷이 정확히 YYYY-MM-DD인 스웨덴 표기법 사용
    this.el.modal.date.value = today;
    this._addModalSelectedType = "expense";
    this.el.modal.typeBtns.forEach((btn) => {
      btn.classList.toggle(
        "type-toggle__btn--active",
        btn.dataset.value === "expense",
      );
    });
    this.el.modal.root.classList.remove("modal--hidden");
  },

  /**
   * 내역 추가 모달을 닫고 입력을 초기화합니다.
   */
  closeAddModal() {
    this.el.modal.root.classList.add("modal--hidden");
    this._clearAddModalInputs();
  },

  /** 추가 모달 입력값을 비웁니다. */
  _clearAddModalInputs() {
    this.el.modal.title.value = "";
    this.el.modal.amount.value = "";
    this.el.modal.date.value = "";
    this.el.modal.categorySelect.value = "";
    this.el.modal.categoryInput.value = "";
    this.el.modal.paymentSelect.value = "";
    this.el.modal.paymentInput.value = "";
  },

  /** Select와 입력창 값을 맞춥니다. */
  _bindSelectInputSync(selectEl, inputEl) {
    selectEl.addEventListener("change", () => {
      if (selectEl.value) inputEl.value = selectEl.value;
    });
    inputEl.addEventListener("input", () => {
      selectEl.value = "";
    });
  },

  /** 수입/지출 토글을 연결합니다. */
  _bindTypeToggle() {
    this.el.modal.typeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this._addModalSelectedType = btn.dataset.value;
        this.el.modal.typeBtns.forEach((b) =>
          b.classList.toggle("type-toggle__btn--active", b === btn),
        );
      });
    });
  },

  /**
   * 추가 모달의 입력값들을 검증하고 추출합니다.
   * @returns {Omit<Expense, 'id'>|null} 유효한 입력 데이터 또는 null
   */
  getAddModalInputs() {
    const title = this.el.modal.title.value.trim();
    const rawAmt = Number(this.el.modal.amount.value);
    const date = this.el.modal.date.value;
    const category = this.el.modal.categoryInput.value.trim();
    const payment = this.el.modal.paymentInput.value.trim();

    if (!title) {
      alert("제목을 입력해주세요.");
      return null;
    }
    if (!rawAmt || rawAmt <= 0) {
      alert("올바른 금액을 양수로 입력해주세요.");
      return null;
    }
    if (!date) {
      alert("날짜를 입력해주세요.");
      return null;
    }
    if (!category) {
      alert("카테고리를 선택하거나 입력해주세요.");
      return null;
    }
    if (!payment) {
      alert("결제수단을 선택하거나 입력해주세요.");
      return null;
    }

    const amount = this._addModalSelectedType === "expense" ? -rawAmt : rawAmt;
    return { title, amount, date, category, payment };
  },

  /**
   * 상세 모달을 열고 데이터를 표시합니다.
   * @param {Expense} item - 표시할 가계부 내역
   */
  openDetailModal(item) {
    const { text, className } = ExpenseService.formatAmount(item.amount);
    this.el.detail.amount.textContent = text;
    this.el.detail.amount.className = `detail__amount ${className}`;
    this.el.detail.title.textContent = item.title;
    this.el.detail.date.textContent = item.date;
    this.el.detail.category.textContent = item.category;
    this.el.detail.payment.textContent = item.payment;
    this.el.detail.root.classList.remove("modal--hidden");
  },

  /**
   * 상세 모달을 닫습니다.
   */
  closeDetailModal() {
    this.el.detail.root.classList.add("modal--hidden");
  },
};

/** 현재 데이터와 상태로 화면을 갱신합니다. */
function syncView(expenses = ExpenseRepository.getAll()) {
  const source = Array.isArray(expenses) ? expenses : ExpenseRepository.getAll();
  const filters = ExpenseView.getFilterCurrState();
  const order = ExpenseView.el.ledger.sortOrder.value;

  let data = ExpenseService.filter(source, filters);
  data = ExpenseService.sortByOrder(data, order);
  ExpenseView.render(data);
}

/** 필터와 모달의 드롭다운 옵션을 갱신합니다. */
function syncSelectOptions(expenses = ExpenseRepository.getAll()) {
  const source = Array.isArray(expenses) ? expenses : ExpenseRepository.getAll();
  const categories = ExpenseService.getSortedUniqueValues(source, "category");
  const payments = ExpenseService.getSortedUniqueValues(source, "payment");

  ExpenseView.setSelectOptions(
    ExpenseView.el.filter.category,
    categories,
    "전체",
  );
  ExpenseView.setSelectOptions(
    ExpenseView.el.filter.method,
    payments,
    "전체",
  );
  ExpenseView.setSelectOptions(
    ExpenseView.el.modal.categorySelect,
    categories,
    "선택",
  );
  ExpenseView.setSelectOptions(
    ExpenseView.el.modal.paymentSelect,
    payments,
    "선택",
  );
}

/** 데이터 변경 후 옵션과 화면을 함께 갱신합니다. */
function refreshUI(expenses = ExpenseRepository.getAll()) {
  syncSelectOptions(expenses);
  syncView(expenses);
}

/** 선택된 내역을 삭제합니다. */
function handleDelete() {
  const ids = ExpenseView.getCheckedIds();
  if (ids.length === 0) return alert("삭제할 항목을 선택해주세요.");
  if (!confirm("정말 삭제하시겠습니까?")) return;

  const idSet = new Set(ids);
  const updated = ExpenseRepository.getAll().filter((item) => !idSet.has(item.id));
  ExpenseRepository.save(updated);
  ExpenseView.el.ledger.allCheck.checked = false;
  refreshUI(updated);
}

/** 추가 모달의 데이터를 저장합니다. */
function handleSave() {
  const inputs = ExpenseView.getAddModalInputs();
  if (!inputs) return;

  const allData = ExpenseRepository.getAll();
  ExpenseRepository.save([
    ...allData,
    { id: ExpenseService.generateId(allData), ...inputs },
  ]);

  const updated = ExpenseRepository.getAll();
  ExpenseView.closeAddModal();
  refreshUI(updated);
}

/** 앱을 초기화하고 이벤트를 연결합니다. */
function setup() {
  ExpenseRepository.prepare(defaultExpenses);
  refreshUI();
  ExpenseView._bindSelectInputSync(
    ExpenseView.el.modal.categorySelect,
    ExpenseView.el.modal.categoryInput,
  );
  ExpenseView._bindSelectInputSync(
    ExpenseView.el.modal.paymentSelect,
    ExpenseView.el.modal.paymentInput,
  );
  ExpenseView._bindTypeToggle();
  ExpenseView.el.filter.applyBtn.addEventListener("click", syncView);
  ExpenseView.el.filter.resetBtn.addEventListener("click", () => {
    ExpenseView.clearAllFilterState();
    syncView();
  });
  ExpenseView.el.ledger.sortOrder.addEventListener("change", syncView);
  ExpenseView.el.ledger.deleteBtn.addEventListener("click", handleDelete);
  ExpenseView.el.ledger.allCheck.addEventListener("change", (e) =>
    ExpenseView.toggleAllChecks(e.target.checked),
  );
  ExpenseView.el.ledger.addBtn.addEventListener("click", () =>
    ExpenseView.openAddModal(),
  );
  ExpenseView.el.modal.cancelBtn.addEventListener("click", () =>
    ExpenseView.closeAddModal(),
  );
  ExpenseView.el.modal.saveBtn.addEventListener("click", handleSave);
  ExpenseView.el.modal.root.addEventListener("click", (e) => {
    if (e.target === ExpenseView.el.modal.root) ExpenseView.closeAddModal();
  });
  ExpenseView.el.detail.closeBtn.addEventListener("click", () =>
    ExpenseView.closeDetailModal(),
  );
  ExpenseView.el.detail.root.addEventListener("click", (e) => {
    if (e.target === ExpenseView.el.detail.root) ExpenseView.closeDetailModal();
  });
  ExpenseView.el.ledger.tableBody.addEventListener("click", (e) => {
    if (e.target.type === "checkbox") return;
    const tr = e.target.closest("tr.ledger__row--clickable");
    if (!tr) return;
    const item = ExpenseRepository.getById(Number(tr.dataset.id));
    if (item) ExpenseView.openDetailModal(item);
  });
}

setup();
