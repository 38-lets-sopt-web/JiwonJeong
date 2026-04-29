import defaultExpenses from "../default_expenses.json" with { type: "json" };
import { ExpenseRepository } from "./repository.js";
import { ExpenseService } from "./service.js";
import { ExpenseView } from "./view.js";

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

/** 모달의 배경을 클릭하면 닫히도록 이벤트를 연결합니다. */
function setupBackdropClose(modalElement, closeFunction) {
  modalElement.addEventListener("click", (e) => {
    if (e.target === modalElement) closeFunction();
  });
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
  ExpenseView.el.reloadBtn.addEventListener("click", () => location.reload());
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
  ExpenseView.el.ledger.tableBody.addEventListener("change", (e) => {
    if (!e.target.classList.contains("ledger__row-check")) return;
    ExpenseView.updateAllCheckState();
  });
  ExpenseView.el.ledger.addBtn.addEventListener("click", () =>
    ExpenseView.openAddModal(),
  );
  ExpenseView.el.modal.cancelBtn.addEventListener("click", () =>
    ExpenseView.closeAddModal(),
  );
  ExpenseView.el.modal.saveBtn.addEventListener("click", handleSave);
  setupBackdropClose(ExpenseView.el.modal.root, () =>
    ExpenseView.closeAddModal(),
  );
  ExpenseView.el.detail.closeBtn.addEventListener("click", () =>
    ExpenseView.closeDetailModal(),
  );
  setupBackdropClose(ExpenseView.el.detail.root, () =>
    ExpenseView.closeDetailModal(),
  );
  ExpenseView.el.ledger.tableBody.addEventListener("click", (e) => {
    if (e.target.type === "checkbox") return;
    const tr = e.target.closest("tr.ledger__row--clickable");
    if (!tr) return;
    const item = ExpenseRepository.getById(Number(tr.dataset.id));
    if (item) ExpenseView.openDetailModal(item);
  });
}

export { setup };
