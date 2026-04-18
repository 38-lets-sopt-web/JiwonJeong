import { ExpenseService } from "./service.js";

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

export { ExpenseView };
