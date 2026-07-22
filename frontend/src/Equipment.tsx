import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEquipment, createEquipment } from './api';

interface EquipmentItem {
  _id: string;
  name: string;
  description: string;
  photoUrl: string;
  status: string;
  yearOfManufacture?: string;
  purpose?: string;
  functionality?: string;
  workingPrinciple?: string;
}

function Equipment() {
  const navigate = useNavigate();
  const [items, setItems] = useState<EquipmentItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState('');
  const [purpose, setPurpose] = useState('');
  const [functionality, setFunctionality] = useState('');
  const [workingPrinciple, setWorkingPrinciple] = useState('');
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

  // Сжимаем фото перед сохранением, чтобы не раздувать базу данных
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1000;
          const scale = Math.min(1, maxWidth / img.width);
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setPhotoUrl(compressed);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить фото');
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError('');
    try {
      await createEquipment(token, {
        name,
        description,
        photoUrl,
        yearOfManufacture,
        purpose,
        functionality,
        workingPrinciple,
      });
      setName('');
      setDescription('');
      setPhotoUrl('');
      setYearOfManufacture('');
      setPurpose('');
      setFunctionality('');
      setWorkingPrinciple('');
      setShowForm(false);
      loadEquipment();
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить оборудование');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc' };

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
              lineHeight: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 0,
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
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Год выпуска"
            value={yearOfManufacture}
            onChange={(e) => setYearOfManufacture(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="Назначение"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <textarea
            placeholder="Функционал"
            value={functionality}
            onChange={(e) => setFunctionality(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <textarea
            placeholder="Принцип работы"
            value={workingPrinciple}
            onChange={(e) => setWorkingPrinciple(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <textarea
            placeholder="Общее описание (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            style={{ ...inputStyle, resize: 'vertical' }}
          />

          <div>
            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6 }}>
              Фото оборудования
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={inputStyle}
            />
            {photoUrl && (
              <img
                src={photoUrl}
                alt="Превью"
                style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 6, marginTop: 8 }}
              />
            )}
          </div>

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
          <div
            key={item._id}
            onClick={() => navigate(`/equipment/${item._id}`)}
            style={{
              background: '#fff',
              border: '1px solid #eee',
              borderRadius: 8,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
          >
            {item.photoUrl ? (
              <img src={item.photoUrl} alt={item.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: 140, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                Нет фото
              </div>
            )}
            <div style={{ padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1b5e20' }}>{item.name}</div>
              {item.purpose && (
                <div style={{ color: '#555', fontSize: 13, marginTop: 4 }}>{item.purpose}</div>
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