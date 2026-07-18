import { useState, useEffect } from 'react';
import { getEquipment, createEquipment, deleteEquipment } from './api';

interface EquipmentItem {
  _id: string;
  name: string;
  description: string;
  photoUrl: string;
  status: string;
}

function Equipment() {
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'admin';

  const loadEquipment = async () => {
    const data = await getEquipment(token);
    setItems(data);
  };

  useEffect(() => {
    loadEquipment();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await createEquipment(token, name, description, photoUrl);
      setName('');
      setDescription('');
      setPhotoUrl('');
      setShowForm(false);
      loadEquipment();
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить оборудование');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteEquipment(token, id);
    loadEquipment();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Оборудование</h2>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: 'none',
              background: '#2e7d32',
              color: '#fff',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            +
          </button>
        )}
      </div>

      {showForm && (
        <div style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
          padding: 16,
          marginBottom: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <input
            type="text"
            placeholder="Название оборудования"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}
          />
          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' }}
          />
          <input
            type="text"
            placeholder="Ссылка на фото (URL)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            style={{ padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' }}
          />
          {error && <div style={{ color: '#e53935', fontSize: 13 }}>{error}</div>}
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: 'none',
              background: '#2e7d32',
              color: '#fff',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            {saving ? 'Сохранение...' : 'Добавить'}
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {items.map(item => (
          <div key={item._id} style={{
            background: '#fff',
            border: '1px solid #eee',
            borderRadius: 8,
            overflow: 'hidden',
          }}>
            {item.photoUrl ? (
              <img src={item.photoUrl} alt={item.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: 140, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                Нет фото
              </div>
            )}
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1b5e20' }}>{item.name}</div>
              {item.description && (
                <div style={{ color: '#555', fontSize: 13, marginTop: 4 }}>{item.description}</div>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    marginTop: 10,
                    padding: '6px 12px',
                    borderRadius: 20,
                    border: 'none',
                    background: '#e53935',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Удалить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && <p style={{ color: '#999' }}>Оборудование пока не добавлено</p>}
    </div>
  );
}

export default Equipment;