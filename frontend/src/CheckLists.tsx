import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCheckLists, createCheckList, deleteCheckList, startTodayInspection } from './api';

interface CheckListItem {
  _id: string;
  name: string;
  instruction: string;
  color: string;
  updatedBy?: string;
  updatedAt?: string;
  usageCount?: number;
  lastUsedAt?: string | null;
}

const COLORS = ['#2e7d32', '#43a047', '#66bb6a', '#1b5e20', '#0288d1', '#546e7a'];

function CheckLists() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CheckListItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [instruction, setInstruction] = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionFor, setActionFor] = useState<CheckListItem | null>(null);
  const [starting, setStarting] = useState(false);

  const token = localStorage.getItem('token') || '';
  const role = localStorage.getItem('role') || '';
  const isAdmin = role === 'admin';
  const canDelete = ['admin', 'technologist', 'engineer'].includes(role);

  const loadItems = async () => {
    const data = await getCheckLists(token);
    setItems(data);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Введите название');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const created = await createCheckList(token, { name, instruction, color, sections: [] });
      setShowModal(false);
      setName('');
      setInstruction('');
      setColor(COLORS[0]);
      navigate(`/checklists/${created._id}`);
    } catch (err) {
      console.error(err);
      setError('Не удалось создать шаблон');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Удалить чек-лист?')) return;
    setDeletingId(id);
    try {
      await deleteCheckList(token, id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert('Не удалось удалить чек-лист');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartInspection = async (templateId: string) => {
    setStarting(true);
    try {
      const inspection = await startTodayInspection(token, templateId);
      navigate(`/inspections/${inspection._id}`);
    } catch (err) {
      console.error(err);
      alert('Не удалось начать проверку');
    } finally {
      setStarting(false);
      setActionFor(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0, color: '#1b5e20' }}>Чек-листы</h2>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
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

      <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f7faf7', textAlign: 'left' }}>
              <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Название</th>
              <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Последнее использование</th>
              <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Изменено</th>
              <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Кем изменено</th>
              <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}>Использований</th>
              {canDelete && <th style={{ padding: '10px 14px', fontSize: 13, color: '#1b5e20' }}></th>}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item._id}
                onClick={() => setActionFor(item)}
                style={{ cursor: 'pointer', borderTop: '1px solid #f0f0f0' }}
              >
                <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1b5e20', borderLeft: `4px solid ${item.color || '#2e7d32'}` }}>
                  {item.name}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#555' }}>
                  {item.lastUsedAt ? new Date(item.lastUsedAt).toLocaleString('ru-RU') : '—'}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#555' }}>
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleString('ru-RU') : '—'}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#555' }}>
                  {item.updatedBy || '—'}
                </td>
                <td style={{ padding: '10px 14px', fontSize: 13, color: '#555' }}>
                  {item.usageCount ?? 0}
                </td>
                {canDelete && (
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <button
                      onClick={(e) => handleDelete(e, item._id)}
                      disabled={deletingId === item._id}
                      style={{
                        background: 'none',
                        border: '1px solid #e57373',
                        color: '#e53935',
                        borderRadius: 6,
                        padding: '6px 12px',
                        fontSize: 13,
                        cursor: 'pointer',
                      }}
                    >
                      {deletingId === item._id ? '...' : 'Удалить'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {items.length === 0 && <p style={{ color: '#999' }}>Шаблоны чек-листов пока не созданы</p>}

      {showModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 10, padding: 24,
              width: 420, maxWidth: '90%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, color: '#1b5e20' }}>Создание шаблона</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#888' }}
              >
                ×
              </button>
            </div>

            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Название</label>
            <input
              type="text"
              placeholder="Название"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 12, boxSizing: 'border-box' }}
            />

            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 4 }}>Инструкция</label>
            <textarea
              placeholder="Инструкция"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc', marginBottom: 12, resize: 'vertical', boxSizing: 'border-box' }}
            />

            <label style={{ fontSize: 13, color: '#555', display: 'block', marginBottom: 6 }}>Цвет иконки</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {COLORS.map(c => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 28, height: 28, borderRadius: '50%', background: c,
                    cursor: 'pointer',
                    border: color === c ? '3px solid #333' : '3px solid transparent',
                  }}
                />
              ))}
            </div>

            {error && <div style={{ color: '#e53935', fontSize: 13, marginBottom: 10 }}>{error}</div>}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid #ccc', background: '#fff', cursor: 'pointer' }}
              >
                Отменить
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                style={{ padding: '8px 18px', borderRadius: 6, border: 'none', background: '#2e7d32', color: '#fff', cursor: 'pointer' }}
              >
                {saving ? 'Создание...' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}

      {actionFor && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.4)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}
          onClick={() => setActionFor(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 10, padding: 24, width: 340, maxWidth: '90%' }}
          >
            <h3 style={{ margin: '0 0 16px', color: '#1b5e20' }}>{actionFor.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={() => handleStartInspection(actionFor._id)}
                disabled={starting}
                style={{ padding: '10px 16px', borderRadius: 8, border: 'none', background: '#2e7d32', color: '#fff', cursor: 'pointer', fontSize: 14 }}
              >
                {starting ? 'Загрузка...' : 'Пройти проверку'}
              </button>
              {isAdmin && (
                <button
                  onClick={() => navigate(`/checklists/${actionFor._id}`)}
                  style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #2e7d32', background: '#fff', color: '#2e7d32', cursor: 'pointer', fontSize: 14 }}
                >
                  Редактировать шаблон
                </button>
              )}
              <button
                onClick={() => navigate(`/checklists/${actionFor._id}/history`)}
                style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', color: '#555', cursor: 'pointer', fontSize: 14 }}
              >
                История проверок
              </button>
              <button
                onClick={() => setActionFor(null)}
                style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ccc', background: '#fff', color: '#888', cursor: 'pointer', fontSize: 14 }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CheckLists;