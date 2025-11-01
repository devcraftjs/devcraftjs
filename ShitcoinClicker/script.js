// ===== USER SYSTEM =====
let currentUser = null;

// Load or create users in localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}
function getUserData(username) {
    return getUsers().find(u => u.username === username);
}

// ===== LOGIN & SIGNUP =====
const loginOverlay = document.getElementById('loginOverlay');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const logoutBtn = document.getElementById('logoutBtn');

function login(username, password) {
    const user = getUserData(username);
    if(user && user.password === password){
        currentUser = user;
        loginOverlay.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        loadGame();
    } else alert("Invalid credentials");
}
function signup(username, password){
    if(getUserData(username)) { alert("Username taken"); return; }
    const users = getUsers();
    const newUser = {username,password,coins:0,perClick:1,autoMiner:0,upgrades:[],achievements:[],totalClicks:0};
    users.push(newUser);
    saveUsers(users);
    login(username,password);
}
loginBtn.addEventListener('click', ()=>login(loginUser.value,loginPass.value));
signupBtn.addEventListener('click', ()=>signup(loginUser.value,loginPass.value));
logoutBtn.addEventListener('click', ()=>{
    currentUser = null;
    loginOverlay.style.display = 'flex';
    logoutBtn.style.display = 'none';
});

// ===== GAME LOGIC =====
const coinCountEl = document.getElementById('coinCount');
const perClickEl = document.getElementById('perClick');
const autoMinerEl = document.getElementById('autoMiner');
const totalClicksEl = document.getElementById('totalClicks');
const clickerBtn = document.getElementById('clickerBtn');
const upgradeContainer = document.getElementById('upgradeContainer');
const achievementList = document.getElementById('achievementList');

// 25 Upgrades
const upgrades = [];
for(let i=1;i<=25;i++){
    upgrades.push({id:i,name:`Upgrade ${i}`,cost:i*50,bonus:1,req:i>1?i-1:null});
}

// Achievements
const achievementDefs = [
    {id:'firstClick',name:'First Click',condition: u => u.totalClicks >=1},
    {id:'hundredCoins',name:'100 Coins',condition: u => u.coins>=100},
    {id:'clickMaster',name:'Click Master',condition: u => u.totalClicks>=500}
];

// ===== UPDATE FUNCTIONS =====
function updateStats(){
    coinCountEl.textContent = currentUser.coins;
    perClickEl.textContent = currentUser.perClick;
    autoMinerEl.textContent = currentUser.autoMiner;
    totalClicksEl.textContent = currentUser.totalClicks;
}

function updateUpgrades(){
    upgradeContainer.innerHTML = '';
    upgrades.forEach(u=>{
        const btn = document.createElement('button');
        btn.textContent = `${u.name} (${u.cost} coins)`;
        btn.classList.add('btn');
        if(currentUser.upgrades.includes(u.id)) btn.disabled=true;
        else if(u.req && !currentUser.upgrades.includes(u.req)) btn.disabled=true;
        btn.addEventListener('click',()=>{
            if(currentUser.coins>=u.cost){
                currentUser.coins -= u.cost;
                currentUser.perClick += u.bonus;
                currentUser.upgrades.push(u.id);
                saveCurrentUser();
                updateStats();
                updateUpgrades();
                updateAchievements();
            }
        });
        upgradeContainer.appendChild(btn);
    });
}

function updateAchievements(){
    achievementList.innerHTML = '';
    achievementDefs.forEach(a=>{
        if(!currentUser.achievements.includes(a.id) && a.condition(currentUser)){
            currentUser.achievements.push(a.id);
            saveCurrentUser();
            alert(`Achievement Unlocked: ${a.name}`);
        }
        const li = document.createElement('li');
        li.textContent = a.name + (currentUser.achievements.includes(a.id)?' ✅':'');
        achievementList.appendChild(li);
    });
}

function saveCurrentUser(){
    const users = getUsers();
    const idx = users.findIndex(u=>u.username===currentUser.username);
    users[idx]=currentUser;
    saveUsers(users);
}

// ===== CLICKER LOGIC =====
clickerBtn.addEventListener('click',()=>{
    currentUser.coins += currentUser.perClick;
    currentUser.totalClicks++;
    saveCurrentUser();
    updateStats();
    updateAchievements();
});

// Auto Miner
setInterval(()=>{
    if(!currentUser) return;
    currentUser.coins += currentUser.autoMiner;
    saveCurrentUser();
    updateStats();
    updateAchievements();
},1000);

// Load game
function loadGame(){
    updateStats();
    updateUpgrades();
    updateAchievements();
}

// ===== DEV PANEL =====
const devBtn = document.getElementById('devBtn');
const devOverlay = document.getElementById('devOverlay');
const unlockDevBtn = document.getElementById('unlockDevBtn');
const closeDevBtn = document.getElementById('closeDevBtn');
const devPanel = document.getElementById('devPanel');
const devPass = document.getElementById('devPass');

devBtn.addEventListener('click', ()=> devOverlay.style.display='flex');
closeDevBtn.addEventListener('click', ()=> devOverlay.style.display='none');
unlockDevBtn.addEventListener('click', ()=>{
    if(devPass.value==='uvHNYaYWEEsfhbhEHqHqq8Wp5kkWW43hRhebS4ejJRZ2osDejK'){
        devPanel.style.display='block';
        devOverlay.style.display='none';
    } else alert('Wrong password');
});

// Dev controls
document.getElementById('devApplyBtn').addEventListener('click',()=>{
    currentUser.coins = parseInt(document.getElementById('devCoins').value)||currentUser.coins;
    currentUser.perClick = parseInt(document.getElementById('devPerClick').value)||currentUser.perClick;
    currentUser.autoMiner = parseInt(document.getElementById('devAddMiner').value)||currentUser.autoMiner;
    saveCurrentUser();
    updateStats();
});
document.getElementById('devUnlockAllBtn').addEventListener('click',()=>{
    upgrades.forEach(u=>{ if(!currentUser.upgrades.includes(u.id)) currentUser.upgrades.push(u.id); });
    currentUser.perClick = 25; // sum of bonuses
    saveCurrentUser();
    updateUpgrades();
});
document.getElementById('devResetUpgradesBtn').addEventListener('click',()=>{
    currentUser.upgrades=[];
    currentUser.perClick=1;
    saveCurrentUser();
    updateUpgrades();
});
document.getElementById('devResetAllBtn').addEventListener('click',()=>{
    localStorage.removeItem('users');
    location.reload();
});
