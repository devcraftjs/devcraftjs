// --- Initial Stocks (expanded) ---
let stocks = [
  { name: 'AAPL', price: 150, defaultPrice: 150 },
  { name: 'GOOG', price: 2800, defaultPrice: 2800 },
  { name: 'AMZN', price: 3400, defaultPrice: 3400 },
  { name: 'TSLA', price: 700, defaultPrice: 700 },
  { name: 'MSFT', price: 300, defaultPrice: 300 },
  { name: 'NFLX', price: 550, defaultPrice: 550 },
  { name: 'NVDA', price: 220, defaultPrice: 220 },
  { name: 'DIS', price: 180, defaultPrice: 180 },
  { name: 'AMD', price: 95, defaultPrice: 95 },
  { name: 'BABA', price: 180, defaultPrice: 180 },
  { name: 'INTC', price: 55, defaultPrice: 55 },
  { name: 'V', price: 240, defaultPrice: 240 },
  { name: 'MA', price: 350, defaultPrice: 350 },
  { name: 'JPM', price: 160, defaultPrice: 160 },
  { name: 'BAC', price: 42, defaultPrice: 42 },
  { name: 'WMT', price: 150, defaultPrice: 150 },
  { name: 'KO', price: 60, defaultPrice: 60 },
  { name: 'PEP', price: 180, defaultPrice: 180 },
  { name: 'XOM', price: 90, defaultPrice: 90 },
  { name: 'CVX', price: 100, defaultPrice: 100 },
  { name: 'TSM', price: 120, defaultPrice: 120 },
  { name: 'SHOP', price: 1500, defaultPrice: 1500 },
  { name: 'ADBE', price: 600, defaultPrice: 600 },
  { name: 'ORCL', price: 90, defaultPrice: 90 },
];

let balance = 100000;
let portfolio = {};

// --- Stock & Portfolio Updates ---
function updateStockTable() {
  const table = document.getElementById('stock-table');
  table.innerHTML = '';
  stocks.forEach((stock, index) => {
    const color = stock.priceChange >= 0 ? 'lime' : 'red';
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${stock.name}</td>
      <td style="color:${color};">$${stock.price.toFixed(2)}</td>
      <td>
        <button class="buy btn" onclick="buyStock(${index})">Buy</button>
        <button class="sell btn" onclick="sellStock(${index})">Sell</button>
      </td>
    `;
    table.appendChild(row);
  });
}

function updatePortfolio() {
  const body = document.getElementById('portfolio-body');
  body.innerHTML = '';
  for (const stock in portfolio) {
    const quantity = portfolio[stock];
    const price = stocks.find(s => s.name === stock)?.price || 0;
    const value = (quantity * price).toFixed(2);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${stock}</td>
      <td>${quantity}</td>
      <td>$${value}</td>
    `;
    body.appendChild(row);
  }
  document.getElementById('balance').innerText = balance.toFixed(2);
}

// --- Buy/Sell ---
function buyStock(index) {
  const stock = stocks[index];
  if (balance >= stock.price) {
    balance -= stock.price;
    portfolio[stock.name] = (portfolio[stock.name] || 0) + 1;
    updatePortfolio();
  } else alert("Not enough balance!");
}

function sellStock(index) {
  const stock = stocks[index];
  if (portfolio[stock.name] > 0) {
    balance += stock.price;
    portfolio[stock.name] -= 1;
    updatePortfolio();
  } else alert("You don't own this stock!");
}

// --- Market Simulation ---
function simulateMarket() {
  stocks.forEach(stock => {
    const change = (Math.random() - 0.5) * 20;
    stock.price = Math.max(1, stock.price + change);
    stock.priceChange = change;
  });
  updateStockTable();
  updatePortfolio();
}

// --- Dev Panel ---
function openDevPanel() {
  const password = prompt("Enter Dev Panel Password:");
  if (password === "DevPanel") {
    document.getElementById('dev-panel-modal').style.display = "block";
  } else {
    alert("Wrong password!");
  }
}

function closeDevPanel() {
  document.getElementById('dev-panel-modal').style.display = "none";
}

// --- Dev Panel Actions ---
function addBalance() {
  const amount = Number(document.getElementById('add-balance').value);
  if (amount > 0) {
    balance += amount;
    updatePortfolio();
    alert(`Added $${amount} to balance!`);
  }
}

function resetPortfolio() {
  portfolio = {};
  updatePortfolio();
  alert("Portfolio reset!");
}

function addStock() {
  const name = document.getElementById('new-stock-name').value.toUpperCase();
  const price = Number(document.getElementById('new-stock-price').value);
  if (name && price > 0 && !stocks.some(s => s.name === name)) {
    stocks.push({ name, price, defaultPrice: price });
    updateStockTable();
    alert(`Stock ${name} added!`);
  }
}

function addMultipleStocks() {
  const input = document.getElementById('multi-stock-input').value;
  const entries = input.split(',');
  let added = 0;
  entries.forEach(e => {
    const [name, price] = e.split(':');
    const n = name?.trim().toUpperCase();
    const p = Number(price);
    if (n && p > 0 && !stocks.some(s => s.name === n)) {
      stocks.push({ name: n, price: p, defaultPrice: p });
      added++;
    }
  });
  updateStockTable();
  alert(`Added ${added} stocks!`);
}

function editStock() {
  const name = document.getElementById('edit-stock-name').value.toUpperCase();
  const price = Number(document.getElementById('edit-stock-price').value);
  const stock = stocks.find(s => s.name === name);
  if (stock && price > 0) {
    stock.price = price;
    updateStockTable();
    updatePortfolio();
    alert(`Stock ${name} price updated!`);
  }
}

function removeStock() {
  const name = document.getElementById('remove-stock-name').value.toUpperCase();
  const index = stocks.findIndex(s => s.name === name);
  if (index !== -1) {
    stocks.splice(index, 1);
    updateStockTable();
    updatePortfolio();
    alert(`Stock ${name} removed!`);
  }
}

function boostStocks() {
  stocks.forEach(stock => stock.price *= 1.1);
  updateStockTable();
  updatePortfolio();
  alert("All stocks boosted by 10%!");
}

function dropStocks() {
  stocks.forEach(stock => stock.price *= 0.9);
  updateStockTable();
  updatePortfolio();
  alert("All stocks dropped by 10%!");
}

function resetStocks() {
  stocks.forEach(stock => stock.price = stock.defaultPrice);
  updateStockTable();
  updatePortfolio();
  alert("All stock prices reset to default!");
}

function setAllStockPrices() {
  const price = Number(document.getElementById('set-all-price').value);
  if (price > 0) {
    stocks.forEach(s => s.price = s.defaultPrice = price);
    updateStockTable();
    updatePortfolio();
    alert(`All stock prices set to $${price}`);
  }
}

function marketCrash() {
  stocks.forEach(s => s.price *= 0.5);
  updateStockTable();
  updatePortfolio();
  alert("Market crashed! All stocks dropped by 50%");
}

function marketBoom() {
  stocks.forEach(s => s.price *= 2);
  updateStockTable();
  updatePortfolio();
  alert("Market boom! All stocks doubled in price!");
}

let marketInterval = setInterval(simulateMarket, 2000);
function setSimulationSpeed() {
  const speed = Number(document.getElementById('sim-speed').value);
  if (speed > 0) {
    clearInterval(marketInterval);
    marketInterval = setInterval(simulateMarket, speed);
    alert(`Simulation speed set to ${speed}ms`);
  }
}

function resetGame() {
  portfolio = {};
  balance = 100000;
  updatePortfolio();
  resetStocks();
  alert("Portfolio, balance, and stocks reset!");
}

// --- Initial Setup ---
updateStockTable();
updatePortfolio();

// Ctrl+K opens Dev Panel
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openDevPanel();
  }
});
