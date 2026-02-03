import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StorageService } from '../services/storage';
import { UserProfile, Category } from '../types';
import { ICONS, CATEGORY_COLORS } from '../services/constants';

const COLORS = [
  { bg: 'bg-pink-500', text: 'text-pink-500', name: 'Rosa' },
  { bg: 'bg-blue-500', text: 'text-blue-500', name: 'Azul' },
  { bg: 'bg-purple-500', text: 'text-purple-500', name: 'Morado' },
  { bg: 'bg-green-500', text: 'text-green-500', name: 'Verde' },
  { bg: 'bg-orange-500', text: 'text-orange-500', name: 'Naranja' },
  { bg: 'bg-indigo-500', text: 'text-indigo-500', name: 'Índigo' },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit Category Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [editColorClass, setEditColorClass] = useState('');

  useEffect(() => {
    const load = async () => {
      const [userData, categoryData] = await Promise.all([
        StorageService.getUsers(),
        StorageService.getCategories()
      ]);
      setUsers(userData);
      setCategories(categoryData);
      setLoading(false);
    };
    load();
  }, []);

  const handleUpdateUser = (index: number, field: keyof UserProfile, value: string) => {
    const newUsers = [...users];
    newUsers[index] = { ...newUsers[index], [field]: value };
    
    if (field === 'color') {
        const selectedColor = COLORS.find(c => c.bg === value);
        if (selectedColor) {
            newUsers[index].textColor = selectedColor.text;
        }
    }
    setUsers(newUsers);
  };

  const handleSave = async () => {
    setSaving(true);
    await StorageService.saveUsers(users);
    setSaving(false);
    alert("¡Usuarios guardados exitosamente!");
  };

  const handleLogout = () => {
      navigate('/');
  };

  const openEditCategory = (category: Category) => {
      setEditingCategory(category);
      setEditName(category.name);
      setEditIcon(category.icon);
      setEditColorClass(category.color);
  };

  const handleSaveCategory = async () => {
      if (!editingCategory) return;
      
      const updatedCat = {
          ...editingCategory,
          name: editName,
          icon: editIcon,
          color: editColorClass
      };

      // Optimistic Update
      setCategories(categories.map(c => c.id === updatedCat.id ? updatedCat : c));
      setEditingCategory(null);

      // Async Save
      await StorageService.updateCategory(updatedCat);
  };

  if (loading) return null;

  return (
    <div className="pb-32 pt-8 px-5 min-h-screen relative">
       {/* Background */}
       <div className="fixed top-[-10%] right-[20%] w-[400px] h-[400px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-[-1]"></div>
       <div className="fixed bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 z-[-1]"></div>

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
          <p className="text-sm text-gray-500">Configuración general</p>
        </div>
      </header>

      <div className="space-y-6">
        
        {/* USERS SECTION */}
        <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Usuarios</h2>
            {users.map((user, index) => (
                <div key={user.id} className="glass-panel p-6 rounded-[2rem] border border-white/60 relative overflow-hidden mb-4">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${user.color} opacity-10 rounded-bl-[4rem]`}></div>
                    
                    <div className="flex gap-4 items-center mb-6">
                        <div className={`w-16 h-16 rounded-full ${user.color} flex items-center justify-center text-white shadow-lg`}>
                            <span className="text-2xl font-bold">{user.name.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-400 mb-1 block">Nombre</label>
                            <input 
                                type="text" 
                                value={user.name}
                                onChange={(e) => handleUpdateUser(index, 'name', e.target.value)}
                                className="w-full bg-white/50 border border-white/40 rounded-xl px-4 py-2 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-400 mb-2 block">Color de Identidad</label>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                            {COLORS.map((c) => (
                                <button
                                    key={c.bg}
                                    onClick={() => handleUpdateUser(index, 'color', c.bg)}
                                    className={`w-10 h-10 rounded-full ${c.bg} flex-shrink-0 transition-transform ${user.color === c.bg ? 'ring-4 ring-white shadow-lg scale-110' : 'opacity-40 hover:opacity-100'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
             <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
            >
                {saving ? 'Guardando...' : 'Guardar Usuarios'}
                {!saving && <span className="material-icons-round">save</span>}
            </button>
        </section>

        <div className="h-px bg-gray-200 w-full"></div>

        {/* CATEGORIES SECTION */}
        <section>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Administrar Categorías</h2>
            <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => openEditCategory(cat)}
                        className="glass-panel p-3 rounded-2xl flex items-center gap-3 border border-white/60 hover:bg-white/80 transition-colors text-left"
                    >
                        <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center shadow-sm`}>
                            <span className="material-icons-round text-lg">{cat.icon}</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="font-bold text-gray-800 text-sm truncate">{cat.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Editar</p>
                        </div>
                    </button>
                ))}
            </div>
        </section>

        <div className="h-px bg-gray-200 w-full"></div>

        {/* Settings / Logout */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-white/60">
             <button onClick={handleLogout} className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors group">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-500 rounded-xl group-hover:bg-red-100 transition-colors">
                         <span className="material-icons-round">logout</span>
                    </div>
                    <span className="font-bold text-red-600">Cerrar Sesión</span>
                </div>
             </button>
        </div>

        <div className="text-center text-xs text-gray-400 font-medium pb-8">
            Versión 1.0.3 • Finanzas Pro
        </div>
      </div>

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6">
              <div className="bg-white w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-blob">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Editar Categoría</h3>
                      <button onClick={() => setEditingCategory(null)} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                          <span className="material-icons-round text-gray-600">close</span>
                      </button>
                  </div>

                  <div className="space-y-6">
                      {/* Name Input */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Nombre</label>
                          <input 
                              type="text" 
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                      </div>

                      {/* Color Picker */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Color</label>
                          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                              {CATEGORY_COLORS.map((color) => (
                                  <button
                                      key={color.id}
                                      onClick={() => setEditColorClass(color.class)}
                                      className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-transform ${color.class.split(' ')[0]} ${editColorClass === color.class ? 'ring-4 ring-offset-2 ring-indigo-200 scale-110' : ''}`}
                                  >
                                      {editColorClass === color.class && <span className="material-icons-round text-white text-sm">check</span>}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Icon Picker */}
                      <div>
                          <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Icono</label>
                          <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto no-scrollbar p-1">
                              {ICONS.map((icon) => (
                                  <button
                                      key={icon}
                                      onClick={() => setEditIcon(icon)}
                                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${editIcon === icon ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                  >
                                      <span className="material-icons-round text-lg">{icon}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      <button 
                          onClick={handleSaveCategory}
                          className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all"
                      >
                          Guardar Cambios
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Profile;