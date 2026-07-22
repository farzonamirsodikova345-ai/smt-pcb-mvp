import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEquipment, deleteEquipment } from './api';

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

function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<EquipmentItem | null>(null);

  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'admin';

  useEffect(() => {
    getEquipment(token).then((data: EquipmentItem[]) => {
      const found = data.find(e => e._id === id);
      setItem(found || null);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!item) return;
    await deleteEquipment(token, item._id);
    navigate('/equipment');
  };

  if (!item) return <p>Загрузка...</p>;

  const sectionStyle = { marginTop: 14 };
  const labelStyle = { color: '#1b5e20', fontWeight: 700, fontSize: 14, marginBottom: 4 };
  const textStyle = { color: '#555', fontSize: 15, lineHeight: 1.6, whiteSpace: 'pre-line' as const };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={() => navigate('/equipment')}
          style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', fontSize: 14, padding: 0 }}
        >
          ← Назад к оборудованию
        </button>

        {isAdmin && (
          <button
            onClick={handleDelete}
            style={{
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none',
              background: '#e53935',
              color: '#fff',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            Удалить
          </button>
        )}
      </div>

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        {item.photoUrl ? (
          <img src={item.photoUrl} alt={item.name} style={{ width: '100%', maxHeight: 320, objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: 220, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
            Нет фото
          </div>
        )}
        <div style={{ padding: 20 }}>
          <h2 style={{ color: '#1b5e20', margin: '0 0 8px' }}>{item.name}</h2>
          {item.yearOfManufacture && (
            <div style={{ color: '#777', fontSize: 14 }}>Год выпуска: {item.yearOfManufacture}</div>
          )}

          {item.purpose && (
            <div style={sectionStyle}>
              <div style={labelStyle}>Назначение</div>
              <div style={textStyle}>{item.purpose}</div>
            </div>
          )}

          {item.functionality && (
            <div style={sectionStyle}>
              <div style={labelStyle}>Функционал</div>
              <div style={textStyle}>{item.functionality}</div>
            </div>
          )}

          {item.workingPrinciple && (
            <div style={sectionStyle}>
              <div style={labelStyle}>Принцип работы</div>
              <div style={textStyle}>{item.workingPrinciple}</div>
            </div>
          )}

          {item.description && (
            <div style={sectionStyle}>
              <div style={labelStyle}>Описание</div>
              <div style={textStyle}>{item.description}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EquipmentDetail;