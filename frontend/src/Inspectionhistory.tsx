import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInspectionsByTemplate } from './api';
import type { Inspection } from './api';

function getName(user: { name: string } | string | undefined) {
  if (!user) return '—';
  if (typeof user === 'string') return user;
  return user.name;
}

function InspectionHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

  const [items, setItems] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getInspectionsByTemplate(token, id)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [id]);

  const statusLabel: Record<string, string> = {
    in_progress: 'В процессе',
    completed: 'Завершено',
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={() => navigate('/checklists')}
          style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', fontSize: 14, padding: 0 }}
        >
          ← Назад к чек-листам
        </button>
      </div>

      <h2 style={{ margin: '0 0 16px', color: '#1b5e20' }}>
        История проверок{items[0] ? `: ${items[0].templateName}` : ''}
      </h2>

      {loading ? (
        <p>Загрузка...</p>
      ) : items.length === 0 ? (
        <p style={{ color: '#999' }}>Проверок пока не было</p>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7faf7', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Дата</th>
                <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Статус</th>
                <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Создал</th>
                <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Последний менял</th>
              </tr>
            </thead>
            <tbody>
              {items.map((insp) => (
                <tr
                  key={insp._id}
                  onClick={() => navigate(`/inspections/${insp._id}`)}
                  style={{ cursor: 'pointer', borderTop: '1px solid #f0f0f0' }}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1b5e20' }}>
                    {insp.inspectionDate || '—'}
                    {insp.createdAt && (
                      <span style={{ fontWeight: 400, color: '#888', marginLeft: 8, fontSize: 13 }}>
                        {new Date(insp.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13 }}>
                    <span style={{
                      color: insp.status === 'completed' ? '#2e7d32' : '#f57c00',
                      fontWeight: 600,
                    }}>
                      {statusLabel[insp.status]}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#555' }}>
                    {getName(insp.createdBy)}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: 13, color: '#555' }}>
                    {getName(insp.updatedBy)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InspectionHistory;