 import React,{useState} from 'react'
 
 function Sidebar() {
      const [activeTab, setActiveTab] = useState('dashboard');
      const [sidebarOpen, setSidebarOpen] = useState(true);
   return (
     <div>
       {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300`}>
        <div className="p-4 border-b">
          <h1 className={`text-xl font-bold ${sidebarOpen ? 'block' : 'hidden'}`}>AdminPanel</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg bg-gray-100">
            ☰
          </button>
        </div>
        
        <nav className="mt-6">
          {['dashboard', 'products', 'orders', 'users', 'analytics'].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full flex items-center p-4 text-left hover:bg-blue-50 ${
                activeTab === item ? 'bg-blue-100 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600'
              }`}
            >
              <span className="mr-3">📊</span>
              {sidebarOpen && <span className="capitalize">{item}</span>}
            </button>
          ))}
        </nav>
      </div>
     </div>
   )
 }
 
 export default Sidebar
 
 