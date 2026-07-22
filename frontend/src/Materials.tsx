import { useState, useEffect } from 'react';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from './api';
import type { Material } from './api';

function Materials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('шт');
  const [supplier, setSupplier] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role');
  const isAdmin = role === 'admin';

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    setLoading(true);
    getMaterials(token)
      .then(setMaterials)
      .finally(() => setLoading(false));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await createMaterial(token, {
      name,
      quantity: Number(quantity) || 0,
      unit,
      supplier,
    });
    setName('');
    setQuantity('');
    setUnit('шт');
    setSupplier('');
    setShowForm(false);
    loadMaterials();
  };

  const handleQuantityChange = async (id: string, value: string) => {
    const quantity = Number(value) || 0;
    setMaterials(prev => prev.map(m => (m._id === id ? { ...m, quantity } : m)));
    await updateMaterial(token, id, { quantity });
  };

  const handleDelete = async (id: string) => {
    await deleteMaterial(token, id);
    setMaterials(prev => prev.filter(m => m._id !== id));
  };

  return (
    <div>
      <div
        style={{
          background: '#fff',
          borderRadius: 12,
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#2E6B4F', margin: 0 }}>Материалы и компоненты</h2>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#2E6B4F',
                color: '#fff',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}
            >
              +
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleAdd}
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginBottom: 20,
              padding: 16,
              background: '#f5f5f7',
              borderRadius: 8,
            }}
          >
            <input
              placeholder="Название"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', flex: '1 1 180px' }}
            />
            <input
              placeholder="Кол-во"
              type="number"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', width: 100 }}
            />
            <input
              placeholder="Ед. измерения"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', width: 120 }}
            />
            <input
              placeholder="Поставщик"
              value={supplier}
              onChange={e => setSupplier(e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', flex: '1 1 180px' }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: 'none',
                background: '#2E6B4F',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Добавить
            </button>
          </form>
        )}

        {loading ? (
          <p>Загрузка...</p>
        ) : materials.length === 0 ? (
          <p style={{ color: '#888' }}>Материалов пока нет</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f7', textAlign: 'left' }}>
                <th style={{ padding: '12px 10px', color: '#2E6B4F', fontSize: 13 }}>НАЗВАНИЕ</th>
                <th style={{ padding: '12px 10px', color: '#2E6B4F', fontSize: 13 }}>КОЛ-ВО НА СКЛАДЕ</th>
                <th style={{ padding: '12px 10px', color: '#2E6B4F', fontSize: 13 }}>ЕД. ИЗМЕРЕНИЯ</th>
                <th style={{ padding: '12px 10px', color: '#2E6B4F', fontSize: 13 }}>ПОСТАВЩИК</th>
                {isAdmin && <th style={{ padding: '12px 10px' }}></th>}
              </tr>
            </thead>
            <tbody>
              {materials.map(m => (
                <tr key={m._id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{m.name}</td>
                  <td style={{ padding: '12px 10px' }}>
                    {isAdmin ? (
                      <input
                        type="number"
                        value={m.quantity}
                        onChange={e => handleQuantityChange(m._id, e.target.value)}
                        style={{ width: 80, padding: 6, borderRadius: 6, border: '1px solid #ddd' }}
                      />
                    ) : (
                      m.quantity
                    )}
                  </td>
                  <td style={{ padding: '12px 10px' }}>{m.unit}</td>
                  <td style={{ padding: '12px 10px' }}>{m.supplier}</td>
                  {isAdmin && (
                    <td style={{ padding: '12px 10px' }}>
                      <button
                        onClick={() => handleDelete(m._id)}
                        style={{
                          background: '#e74c3c',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 20,
                          padding: '6px 16px',
                          cursor: 'pointer',
                        }}
                      >
                        Удалить
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Materials;