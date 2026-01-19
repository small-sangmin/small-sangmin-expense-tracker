"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Edit2, X, Home, Calendar, User, Settings, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function ExpenseTracker() {
  const [currentPage, setCurrentPage] = useState('home');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense');
  const [expenses, setExpenses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [editingExpense, setEditingExpense] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([{id:1,message:'가계부 앱에 오신 것을 환영합니다!',time:'방금 전',read:false}]);
  const [userName, setUserName] = useState('User');
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [tempName, setTempName] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editType, setEditType] = useState('expense');
  const [editCategory, setEditCategory] = useState('');
  const [editSubCategory, setEditSubCategory] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedModalDate, setSelectedModalDate] = useState(null);
  const [addDate, setAddDate] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('expenses');
        if (saved) setExpenses(JSON.parse(saved));
        const name = localStorage.getItem('userName');
        if (name) setUserName(name);
      } catch (e) { console.log(e); }
    }
  }, []);

  const saveExpenses = (u) => { 
    setExpenses(u); 
    if (typeof window !== 'undefined') {
      try { localStorage.setItem('expenses', JSON.stringify(u)); } catch(e){} 
    }
  };
  
  const addExpense = () => {
    if (!amount) return;
    const d = addDate || new Date();
    const n = { id: Date.now(), amount: parseInt(amount), description, type: category === '고정지출' ? 'fixed' : type, paymentMethod, category: type === 'expense' ? category : null, subCategory: type === 'expense' ? subCategory : null, timestamp: d.toISOString() };
    saveExpenses([n, ...expenses]);
    setAmount(''); setDescription(''); setCategory(''); setSubCategory(''); setShowAddModal(false); setAddDate(null);
  };
  
  const deleteExpense = (id) => saveExpenses(expenses.filter(e => e.id !== id));
  
  const startEditExpense = (e) => { 
    setEditingExpense(e); 
    setEditAmount(e.amount.toString()); 
    setEditDescription(e.description||''); 
    setEditType(e.type==='fixed'?'expense':e.type); 
    setEditCategory(e.category||''); 
    setEditSubCategory(e.subCategory||''); 
    setShowEditModal(true); 
  };
  
  const updateExpense = () => {
    if (!editAmount || !editingExpense) return;
    const u = {...editingExpense, amount:parseInt(editAmount), description:editDescription, type:editCategory==='고정지출'?'fixed':editType, category:editType==='expense'?editCategory:null, subCategory:editType==='expense'?editSubCategory:null};
    saveExpenses(expenses.map(e => e.id===editingExpense.id?u:e));
    setShowEditModal(false); setEditingExpense(null);
  };

  const formatAmount = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatKorean = (s) => { const n=parseInt(s); if(isNaN(n))return''; if(n>=10000)return `${formatAmount(Math.floor(n/10000))}만원`; return `${formatAmount(n)}원`; };
  const getDateString = (d) => `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  const getExpensesForDate = (d) => expenses.filter(e => getDateString(new Date(e.timestamp)) === getDateString(d));

  const totalIncome = expenses.filter(e => e.type === 'income').reduce((s,e) => s+e.amount, 0);
  const totalExpense = expenses.filter(e => ['expense','fixed'].includes(e.type)).reduce((s,e) => s+e.amount, 0);
  const selectedDayExpenses = getExpensesForDate(selectedDay);
  const selectedDayIncome = selectedDayExpenses.filter(e => e.type === 'income').reduce((s,e) => s+e.amount, 0);
  const selectedDayExpense = selectedDayExpenses.filter(e => ['expense','fixed'].includes(e.type)).reduce((s,e) => s+e.amount, 0);

  const getWeekDays = () => { 
    const t=new Date(), days=[], s=new Date(t); 
    s.setDate(t.getDate()-t.getDay()); 
    for(let i=0;i<7;i++){
      const d=new Date(s);
      d.setDate(s.getDate()+i);
      days.push(d);
    } 
    return days; 
  };
  
  const weekDays = getWeekDays();
  const dayNames = ['일','월','화','수','목','금','토'];

  const categories = [{name:'식비',icon:'🍽️'},{name:'교통',icon:'🚗'},{name:'쇼핑',icon:'🛒'},{name:'취미',icon:'🎮'},{name:'의료',icon:'💊'},{name:'고정지출',icon:'🔄'},{name:'자기계발',icon:'📚'},{name:'비정기',icon:'📦'},{name:'저축',icon:'💰'},{name:'기타',icon:'💡'}];
  
  const subCats = {
    '식비':[{name:'외식',icon:'🍴'},{name:'배달',icon:'🛵'},{name:'카페',icon:'☕'},{name:'기타',icon:'📝'}],
    '교통':[{name:'대중교통',icon:'🚇'},{name:'택시',icon:'🚕'},{name:'기타',icon:'📝'}],
    '쇼핑':[{name:'의류',icon:'👕'},{name:'생활용품',icon:'🧴'},{name:'기타',icon:'📝'}],
    '취미':[{name:'영화',icon:'🎬'},{name:'게임',icon:'🎮'},{name:'기타',icon:'📝'}],
    '의료':[{name:'병원',icon:'🏥'},{name:'약국',icon:'💊'},{name:'기타',icon:'📝'}],
    '고정지출':[{name:'월세',icon:'🏠'},{name:'통신비',icon:'📱'},{name:'구독',icon:'📲'},{name:'기타',icon:'📝'}],
    '자기계발':[{name:'도서',icon:'📖'},{name:'강의',icon:'🎓'},{name:'기타',icon:'📝'}],
    '비정기':[{name:'경조사',icon:'💐'},{name:'선물',icon:'🎁'},{name:'기타',icon:'📝'}],
    '저축':[{name:'적금',icon:'🏦'},{name:'주식',icon:'📈'},{name:'기타',icon:'📝'}],
    '기타':[{name:'기타',icon:'📝'}]
  };

  const getCategoryData = () => { 
    const t={}; 
    selectedDayExpenses.filter(e=>['expense','fixed'].includes(e.type)&&e.category).forEach(e=>{
      t[e.category]=(t[e.category]||0)+e.amount;
    }); 
    return Object.entries(t).map(([n,v])=>({name:n,value:v,icon:categories.find(c=>c.name===n)?.icon||'💡'})); 
  };
  
  const categoryData = getCategoryData();
  const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4','#84CC16'];

  const monthlyExpense = expenses.filter(e=>{
    const d=new Date(e.timestamp);
    return d.getMonth()===selectedDate.getMonth()&&d.getFullYear()===selectedDate.getFullYear()&&['expense','fixed'].includes(e.type);
  }).reduce((s,e)=>s+e.amount,0);
  
  const monthlyIncome = expenses.filter(e=>{
    const d=new Date(e.timestamp);
    return d.getMonth()===selectedDate.getMonth()&&d.getFullYear()===selectedDate.getFullYear()&&e.type==='income';
  }).reduce((s,e)=>s+e.amount,0);

  const changeMonth = (delta) => { 
    const d=new Date(selectedDate);
    d.setMonth(d.getMonth()+delta);
    setSelectedDate(d); 
  };
  
  const getDaysInMonth = (d) => new Date(d.getFullYear(),d.getMonth()+1,0).getDate();
  const getFirstDay = (d) => new Date(d.getFullYear(),d.getMonth(),1).getDay();
  const unreadCount = notifications.filter(n => !n.read).length;

  const renderHome = () => (
    <div className="flex-1 pb-24 bg-gray-50">
      <div className="bg-blue-500 rounded-b-[40px] px-6 pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-100 text-sm">안녕하세요</p>
            <h1 className="text-xl font-bold text-white">{userName}님 👋</h1>
          </div>
          <button onClick={()=>setShowNotifications(true)} className="relative p-2 bg-blue-400/50 rounded-xl">
            <Bell className="w-5 h-5 text-white"/>
            {unreadCount>0&&<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">{unreadCount}</span>}
          </button>
        </div>
        <div className="bg-white/20 backdrop-blur rounded-2xl p-3">
          <div className="flex justify-between">
            {weekDays.map((day,idx)=>{
              const isSelected=getDateString(day)===getDateString(selectedDay);
              const hasExp=getExpensesForDate(day).length>0;
              return(
                <button key={idx} onClick={()=>setSelectedDay(day)} className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${isSelected?'bg-white shadow-lg':''}`}>
                  <span className={`text-xs mb-1 ${isSelected?'text-blue-500':'text-blue-100'}`}>{dayNames[idx]}</span>
                  <span className={`text-lg font-bold ${isSelected?'text-blue-500':'text-white'}`}>{day.getDate()}</span>
                  {hasExp&&!isSelected&&<div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1"/>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="px-6 -mt-4 flex gap-4">
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-emerald-500"/>
            </div>
            <span className="text-sm text-gray-500">수입</span>
          </div>
          <p className="text-xl font-bold text-emerald-500">+{formatAmount(selectedDayIncome)}</p>
        </div>
        <div className="flex-1 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-500"/>
            </div>
            <span className="text-sm text-gray-500">지출</span>
          </div>
          <p className="text-xl font-bold text-red-500">-{formatAmount(selectedDayExpense)}</p>
        </div>
      </div>
      
      <div className="px-6 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">카테고리별 지출</h3>
            <span className="text-sm text-gray-400">{selectedDay.getMonth()+1}월 {selectedDay.getDate()}일</span>
          </div>
          {categoryData.length>0?(
            <div className="flex items-center">
              <div className="w-40 h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {categoryData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400">총 지출</span>
                  <span className="text-lg font-bold text-gray-800">{formatAmount(selectedDayExpense)}</span>
                </div>
              </div>
              <div className="flex-1 ml-4 space-y-2">
                {categoryData.slice(0,5).map((c,i)=>(
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor:COLORS[i]}}/>
                      <span className="text-sm text-gray-600">{c.icon} {c.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">{formatAmount(c.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ):(
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">📊</span>
              </div>
              <p>이 날의 지출 내역이 없습니다</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-6 mt-6 grid grid-cols-2 gap-4">
        <button onClick={()=>{setType('expense');setAddDate(selectedDay);setShowAddModal(true);}} className="bg-white hover:bg-gray-50 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-500"/>
          </div>
          <div className="text-left">
            <p className="text-gray-800 font-semibold">지출 추가</p>
          </div>
        </button>
        <button onClick={()=>{setType('income');setAddDate(selectedDay);setShowAddModal(true);}} className="bg-white hover:bg-gray-50 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-500"/>
          </div>
          <div className="text-left">
            <p className="text-gray-800 font-semibold">수입 추가</p>
          </div>
        </button>
      </div>
      
      <div className="px-6 mt-6">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">내역</h3>
            <span className="text-sm text-gray-400">{selectedDayExpenses.length}건</span>
          </div>
          <div className="space-y-3">
            {selectedDayExpenses.length>0?selectedDayExpenses.map(e=>(
              <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">
                    {categories.find(c=>c.name===e.category)?.icon||(e.type==='income'?'💰':'💸')}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">{e.description||e.category||(e.type==='income'?'수입':'지출')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`font-bold ${e.type==='income'?'text-emerald-500':'text-red-500'}`}>
                    {e.type==='income'?'+':'-'}{formatAmount(e.amount)}
                  </p>
                  <button onClick={()=>startEditExpense(e)} className="p-1.5 hover:bg-gray-200 rounded-lg">
                    <Edit2 className="w-4 h-4 text-gray-400"/>
                  </button>
                  <button onClick={()=>deleteExpense(e.id)} className="p-1.5 hover:bg-red-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-400"/>
                  </button>
                </div>
              </div>
            )):(
              <div className="text-center py-8 text-gray-400">내역이 없습니다</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="flex-1 pb-24 bg-gray-50">
      <div className="bg-blue-500 px-6 pt-6 pb-8 rounded-b-[40px]">
        <h1 className="text-xl font-bold text-white mb-4">캘린더</h1>
        <div className="flex items-center justify-between bg-white/20 backdrop-blur rounded-2xl p-4">
          <button onClick={()=>changeMonth(-1)} className="p-2 hover:bg-white/20 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-white"/>
          </button>
          <h2 className="text-lg font-bold text-white">{selectedDate.getFullYear()}년 {selectedDate.getMonth()+1}월</h2>
          <button onClick={()=>changeMonth(1)} className="p-2 hover:bg-white/20 rounded-lg">
            <ChevronRight className="w-5 h-5 text-white"/>
          </button>
        </div>
      </div>
      <div className="px-6 -mt-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['일','월','화','수','목','금','토'].map((d,i)=>(
              <div key={d} className={`text-center text-sm font-medium p-2 ${i===0?'text-red-400':i===6?'text-blue-400':'text-gray-400'}`}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({length:getFirstDay(selectedDate)}).map((_,i)=><div key={`e-${i}`}/>)}
            {Array.from({length:getDaysInMonth(selectedDate)},(_,i)=>{
              const day=i+1;
              const date=new Date(selectedDate.getFullYear(),selectedDate.getMonth(),day);
              const dayT=getExpensesForDate(date).filter(e=>['expense','fixed'].includes(e.type)).reduce((s,e)=>s+e.amount,0);
              const dayI=getExpensesForDate(date).filter(e=>e.type==='income').reduce((s,e)=>s+e.amount,0);
              const isToday=date.toDateString()===new Date().toDateString();
              const dow=date.getDay();
              return(
                <button key={day} onClick={()=>{setSelectedModalDate(date);setShowDateModal(true);}} className={`p-2 rounded-xl text-center hover:bg-blue-50 ${isToday?'ring-2 ring-blue-400 bg-blue-50':''}`}>
                  <p className={`text-sm font-medium ${dow===0?'text-red-400':dow===6?'text-blue-400':'text-gray-700'}`}>{day}</p>
                  {dayT>0&&<p className="text-[10px] text-red-400">-{dayT>=10000?`${Math.floor(dayT/10000)}만`:formatAmount(dayT)}</p>}
                  {dayI>0&&<p className="text-[10px] text-emerald-400">+{dayI>=10000?`${Math.floor(dayI/10000)}만`:formatAmount(dayI)}</p>}
                </button>
              );
            })}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">이번달 수입</p>
            <p className="text-xl font-bold text-emerald-500">+{formatAmount(monthlyIncome)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">이번달 지출</p>
            <p className="text-xl font-bold text-red-500">-{formatAmount(monthlyExpense)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="flex-1 pb-24 bg-gray-50">
      <div className="bg-blue-500 px-6 pt-6 pb-16 rounded-b-[40px]">
        <h1 className="text-xl font-bold text-white">프로필</h1>
      </div>
      <div className="px-6 -mt-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl text-white font-bold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-1">{userName}</h2>
          <button onClick={()=>{setTempName(userName);setShowNameEdit(true);}} className="text-blue-500 text-sm">이름 수정</button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">총 수입</p>
            <p className="text-2xl font-bold text-emerald-500">{formatAmount(totalIncome)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-gray-400 text-sm mb-1">총 지출</p>
            <p className="text-2xl font-bold text-red-500">{formatAmount(totalExpense)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="flex-1 pb-24 bg-gray-50">
      <div className="bg-blue-500 px-6 pt-6 pb-8 rounded-b-[40px]">
        <h1 className="text-xl font-bold text-white">설정</h1>
      </div>
      <div className="px-6 mt-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <h3 className="font-bold text-gray-800 mb-4">데이터</h3>
          <button onClick={()=>{if(confirm('모든 데이터를 삭제하시겠습니까?')){setExpenses([]);if(typeof window!=='undefined')localStorage.setItem('expenses','[]');}}} className="w-full py-3 bg-red-50 text-red-500 rounded-xl font-semibold hover:bg-red-100">
            모든 데이터 삭제
          </button>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-2">앱 정보</h3>
          <p className="text-gray-400 text-sm">Version 1.0.0</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {currentPage==='home'&&renderHome()}
        {currentPage==='calendar'&&renderCalendar()}
        {currentPage==='profile'&&renderProfile()}
        {currentPage==='settings'&&renderSettings()}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 z-40 shadow-lg">
        <div className="max-w-md mx-auto flex justify-around">
          {[{p:'home',i:Home,l:'Home'},{p:'calendar',i:Calendar,l:'Calendar'},{p:'profile',i:User,l:'Profile'},{p:'settings',i:Settings,l:'Settings'}].map(({p,i:Icon,l})=>(
            <button key={p} onClick={()=>setCurrentPage(p)} className={`flex flex-col items-center gap-1 p-2 ${currentPage===p?'text-blue-500':'text-gray-400'}`}>
              <Icon className="w-6 h-6"/>
              <span className="text-xs">{l}</span>
            </button>
          ))}
        </div>
      </div>

      {showNotifications&&(
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">알림</h2>
              <button onClick={()=>{setShowNotifications(false);setNotifications(n=>n.map(x=>({...x,read:true})));}} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500"/>
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map(n=>(
                <div key={n.id} className={`p-4 border-b border-gray-50 last:border-0 ${!n.read?'bg-blue-50':''}`}>
                  <p className="text-gray-800 text-sm">{n.message}</p>
                  <p className="text-gray-400 text-xs mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showNameEdit&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-gray-800 mb-4">이름 수정</h2>
            <input type="text" value={tempName} onChange={e=>setTempName(e.target.value)} placeholder="이름" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            <div className="flex gap-2">
              <button onClick={()=>{if(tempName.trim()){setUserName(tempName.trim());if(typeof window!=='undefined')localStorage.setItem('userName',tempName.trim());}setShowNameEdit(false);}} className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold">저장</button>
              <button onClick={()=>setShowNameEdit(false)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold">취소</button>
            </div>
          </div>
        </div>
      )}

      {showDateModal&&selectedModalDate&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{selectedModalDate.getMonth()+1}월 {selectedModalDate.getDate()}일</h2>
              <button onClick={()=>setShowDateModal(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500"/>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {getExpensesForDate(selectedModalDate).length>0?getExpensesForDate(selectedModalDate).map(e=>(
                <div key={e.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{categories.find(c=>c.name===e.category)?.icon||'💰'}</span>
                    <div><p className="text-gray-800 font-medium text-sm">{e.description||e.category}</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className={`font-bold ${e.type==='income'?'text-emerald-500':'text-red-500'}`}>{e.type==='income'?'+':'-'}{formatAmount(e.amount)}</p>
                    <button onClick={()=>{setShowDateModal(false);startEditExpense(e);}} className="p-1.5 hover:bg-gray-200 rounded-lg"><Edit2 className="w-4 h-4 text-gray-400"/></button>
                    <button onClick={()=>deleteExpense(e.id)} className="p-1.5 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4 text-red-400"/></button>
                  </div>
                </div>
              )):<div className="text-center py-8 text-gray-400">내역이 없습니다</div>}
            </div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button onClick={()=>{setType('expense');setAddDate(selectedModalDate);setShowDateModal(false);setShowAddModal(true);}} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"><TrendingDown className="w-4 h-4"/>지출</button>
              <button onClick={()=>{setType('income');setAddDate(selectedModalDate);setShowDateModal(false);setShowAddModal(true);}} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2"><TrendingUp className="w-4 h-4"/>수입</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {type==='income'?'수입 추가':'지출 추가'}
                {addDate&&<span className="text-blue-500 text-sm ml-2">({addDate.getMonth()+1}/{addDate.getDate()})</span>}
              </h2>
              <button onClick={()=>{setShowAddModal(false);setCategory('');setSubCategory('');setAmount('');setDescription('');setAddDate(null);}} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500"/>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={()=>{setType('expense');setCategory('');setSubCategory('');}} className={`flex-1 py-3 rounded-xl font-semibold ${type==='expense'?'bg-red-500 text-white':'bg-gray-100 text-gray-500'}`}>지출</button>
                <button onClick={()=>{setType('income');setCategory('');setSubCategory('');}} className={`flex-1 py-3 rounded-xl font-semibold ${type==='income'?'bg-emerald-500 text-white':'bg-gray-100 text-gray-500'}`}>수입</button>
              </div>
              {type==='expense'&&(
                <div>
                  <p className="text-sm text-gray-500 mb-2">{category?'세부 항목':'카테고리'}</p>
                  {!category?(
                    <div className="grid grid-cols-5 gap-2">
                      {categories.map(c=>(
                        <button key={c.name} onClick={()=>setCategory(c.name)} className="py-3 rounded-xl bg-gray-50 hover:bg-blue-50 flex flex-col items-center gap-1">
                          <span className="text-xl">{c.icon}</span>
                          <span className="text-xs text-gray-600">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  ):(
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span>{categories.find(c=>c.name===category)?.icon}</span>
                          <span className="font-semibold text-gray-800">{category}</span>
                        </div>
                        <button onClick={()=>{setCategory('');setSubCategory('');}} className="text-blue-500 text-sm">← 돌아가기</button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(subCats[category]||[]).map(s=>(
                          <button key={s.name} onClick={()=>setSubCategory(s.name)} className={`py-3 rounded-xl flex flex-col items-center gap-1 ${subCategory===s.name?'bg-blue-500 text-white':'bg-gray-50 text-gray-600'}`}>
                            <span className="text-lg">{s.icon}</span>
                            <span className="text-xs">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {(type==='income'||(type==='expense'&&category&&subCategory))&&(
                <>
                  <div>
                    <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="금액" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    {amount&&<p className={`text-right text-sm mt-1 ${type==='income'?'text-emerald-500':'text-red-500'}`}>{formatKorean(amount)}</p>}
                  </div>
                  <input type="text" value={description} onChange={e=>setDescription(e.target.value)} placeholder={type==='income'?'예) 월급':'내용 (선택)'} className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  <button onClick={addExpense} className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5"/>추가하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {showEditModal&&editingExpense&&(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">내역 수정</h2>
              <button onClick={()=>{setShowEditModal(false);setEditingExpense(null);}} className="p-2 hover:bg-gray-100 rounded-xl">
                <X className="w-5 h-5 text-gray-500"/>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <button onClick={()=>setEditType('expense')} className={`flex-1 py-3 rounded-xl font-semibold ${editType==='expense'?'bg-red-500 text-white':'bg-gray-100 text-gray-500'}`}>지출</button>
                <button onClick={()=>setEditType('income')} className={`flex-1 py-3 rounded-xl font-semibold ${editType==='income'?'bg-emerald-500 text-white':'bg-gray-100 text-gray-500'}`}>수입</button>
              </div>
              {editType==='expense'&&(
                <div>
                  <p className="text-sm text-gray-500 mb-2">{editCategory?'세부 항목':'카테고리'}</p>
                  {!editCategory?(
                    <div className="grid grid-cols-5 gap-2">
                      {categories.map(c=>(
                        <button key={c.name} onClick={()=>setEditCategory(c.name)} className="py-3 rounded-xl bg-gray-50 hover:bg-blue-50 flex flex-col items-center gap-1">
                          <span className="text-xl">{c.icon}</span>
                          <span className="text-xs text-gray-600">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  ):(
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span>{categories.find(c=>c.name===editCategory)?.icon}</span>
                          <span className="font-semibold text-gray-800">{editCategory}</span>
                        </div>
                        <button onClick={()=>{setEditCategory('');setEditSubCategory('');}} className="text-blue-500 text-sm">← 돌아가기</button>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(subCats[editCategory]||[]).map(s=>(
                          <button key={s.name} onClick={()=>setEditSubCategory(s.name)} className={`py-3 rounded-xl flex flex-col items-center gap-1 ${editSubCategory===s.name?'bg-blue-500 text-white':'bg-gray-50 text-gray-600'}`}>
                            <span className="text-lg">{s.icon}</span>
                            <span className="text-xs">{s.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div>
                <input type="number" value={editAmount} onChange={e=>setEditAmount(e.target.value)} placeholder="금액" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                {editAmount&&<p className={`text-right text-sm mt-1 ${editType==='income'?'text-emerald-500':'text-red-500'}`}>{formatKorean(editAmount)}</p>}
              </div>
              <input type="text" value={editDescription} onChange={e=>setEditDescription(e.target.value)} placeholder="내용" className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
              <div className="flex gap-2">
                <button onClick={updateExpense} className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold">수정 완료</button>
                <button onClick={()=>{setShowEditModal(false);setEditingExpense(null);}} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold">취소</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
