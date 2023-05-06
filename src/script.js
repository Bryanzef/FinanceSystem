const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");
const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");
const date = document.querySelector("#inptDate");
const modal = document.getElementById("modal");
const btn = document.getElementsByClassName("modalButton")[0];
const span = document.getElementsByClassName("close")[0];
const messageSuccess = document.querySelector("#item-added-animation");
btn.onclick = () => {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

let items = [];

btnNew.addEventListener("click", addItem);

function itemAddedAnimation() {
  messageSuccess.classList.add("show");

  setTimeout(() => {
    messageSuccess.classList.remove("show");
  }, 1000);
  messageSuccess.style.display = "block";
  messageSuccess.innerHTML = "Item adicionado com sucesso!";
}

function addItem() {
  const desc = descItem.value.trim();
  const amt = parseFloat(amount.value);
  const newDate = date.value.slice(2);

  if (!desc || isNaN(amt) || !newDate || amt <= 0) {
    return alert("Preencha todos os campos corretamente!");
  }

  const newItem = {
    desc: desc,
    amount: amt,
    date: newDate,
    type: type.value,
    // adiciona a data atual formatada como string
  };

  items.push(newItem);
  saveItems(items);
  loadItems();
  resetInputs();
  modal.style.display = "none"; // fecha o modal
  itemAddedAnimation();
}

function deleteItem(index) {
  items.splice(index, 1);
  saveItems(items);
  loadItems();
}

function insertItem(item, index) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
  <td>${item.desc}</td>
  <td>R$ ${item.amount}</td>
  <td>${item.date}</td>
  <td class="columnType">${
    item.type === "Entrada"
      ? '<i class="fas fa-arrow-up style="color: green;"></i>'
      : '<i class="fas fa-arrow-down style="color: red; "></i>'
  }</td>
  <td class="columnAction">
    <button onclick="deleteItem(${index})"><i class="fa-solid fa-trash"></i></button>
  </td>
  `;
  tbody.appendChild(tr);
}

function loadItems() {
  items = getItems();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });
  updateTotals();
}

function updateTotals() {
  const totalIncomes = getTotal("Entrada");
  const totalExpenses = getTotal("Saída");
  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes.toFixed(2);
  expenses.innerHTML = totalExpenses.toFixed(2);
  total.innerHTML = totalItems;
}

function getTotal(type) {
  return items
    .filter((item) => item.type === type)
    .reduce((acc, cur) => acc + cur.amount, 0);
}

function saveItems(items) {
  localStorage.setItem("items", JSON.stringify(items));
}

function getItems() {
  return JSON.parse(localStorage.getItem("items")) || [];
}

function resetInputs() {
  descItem.value = "";
  amount.value = "";
  type.selectedIndex = 0;
}

loadItems();
