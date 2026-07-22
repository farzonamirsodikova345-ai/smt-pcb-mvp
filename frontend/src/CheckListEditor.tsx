import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCheckList, updateCheckList, deleteCheckList } from './api';
import type { Section, Category, Criterion } from './api';

const FIELD_TYPES: { value: Criterion['type']; label: string }[] = [
  { value: 'yesNo', label: 'Да / Нет' },
  { value: 'photo', label: 'Фото' },
  { value: 'text', label: 'Текстовое поле' },
  { value: 'info', label: 'Информация' },
];

function typeLabel(type: Criterion['type']) {
  return FIELD_TYPES.find(t => t.value === type)?.label || 'Текстовое поле';
}

function CheckListEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

  const [name, setName] = useState('');
  const [color, setColor] = useState('#2e7d32');
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [typeMenuFor, setTypeMenuFor] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getCheckList(token, id).then((data) => {
      setName(data.name || '');
      setColor(data.color || '#2e7d32');
      setSections(data.sections || []);
      setLoading(false);
    });
  }, [id]);

  const save = async (updatedSections: Section[]) => {
    if (!id) return;
    setSaving(true);
    try {
      await updateCheckList(token, id, { sections: updatedSections });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateSections = (updated: Section[]) => {
    setSections(updated);
    save(updated);
  };

  const addSection = () => {
    updateSections([...sections, { title: 'Введите название раздела', weight: 1, categories: [] }]);
  };

  const addCategory = (sIdx: number) => {
    const updated = [...sections];
    updated[sIdx] = {
      ...updated[sIdx],
      categories: [...updated[sIdx].categories, { title: 'Введите название категории', criteria: [] }],
    };
    updateSections(updated);
  };

  const addCriterion = (sIdx: number, cIdx: number) => {
    const updated = [...sections];
    const cats = [...updated[sIdx].categories];
    cats[cIdx] = {
      ...cats[cIdx],
      criteria: [...cats[cIdx].criteria, { title: 'Введите название критерия', type: 'text', weight: 1 }],
    };
    updated[sIdx] = { ...updated[sIdx], categories: cats };
    updateSections(updated);
  };

  const setSectionTitle = (sIdx: number, title: string) => {
    const updated = [...sections];
    updated[sIdx] = { ...updated[sIdx], title };
    setSections(updated);
  };

  const setCategoryTitle = (sIdx: number, cIdx: number, title: string) => {
    const updated = [...sections];
    const cats = [...updated[sIdx].categories];
    cats[cIdx] = { ...cats[cIdx], title };
    updated[sIdx] = { ...updated[sIdx], categories: cats };
    setSections(updated);
  };

  const setCriterionTitle = (sIdx: number, cIdx: number, crIdx: number, title: string) => {
    const updated = [...sections];
    const cats = [...updated[sIdx].categories];
    const crit = [...cats[cIdx].criteria];
    crit[crIdx] = { ...crit[crIdx], title };
    cats[cIdx] = { ...cats[cIdx], criteria: crit };
    updated[sIdx] = { ...updated[sIdx], categories: cats };
    setSections(updated);
  };

  const setCriterionType = (sIdx: number, cIdx: number, crIdx: number, type: Criterion['type']) => {
    const updated = [...sections];
    const cats = [...updated[sIdx].categories];
    const crit = [...cats[cIdx].criteria];
    crit[crIdx] = { ...crit[crIdx], type };
    cats[cIdx] = { ...cats[cIdx], criteria: crit };
    updated[sIdx] = { ...updated[sIdx], categories: cats };
    updateSections(updated);
    setTypeMenuFor(null);
  };

  const removeSection = (sIdx: number) => {
    updateSections(sections.filter((_, i) => i !== sIdx));
  };

  const removeCategory = (sIdx: number, cIdx: number) => {
    const updated = [...sections];
    updated[sIdx] = {
      ...updated[sIdx],
      categories: updated[sIdx].categories.filter((_, i) => i !== cIdx),
    };
    updateSections(updated);
  };

  const removeCriterion = (sIdx: number, cIdx: number, crIdx: number) => {
    const updated = [...sections];
    const cats = [...updated[sIdx].categories];
    cats[cIdx] = {
      ...cats[cIdx],
      criteria: cats[cIdx].criteria.filter((_, i) => i !== crIdx),
    };
    updated[sIdx] = { ...updated[sIdx], categories: cats };
    updateSections(updated);
  };

  const handleDeleteChecklist = async () => {
    if (!id) return;
    const confirmed = window.confirm('Удалить весь чек-лист без возможности восстановления?');
    if (!confirmed) return;
    try {
      await deleteCheckList(token, id);
      navigate('/checklists');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Загрузка...</p>;

  const cardStyle = { background: '#fff', border: '1px solid #eee', borderRadius: 8, marginBottom: 16 };
  const titleInputStyle = { border: 'none', outline: 'none', fontWeight: 700, fontSize: 15, color: '#1b5e20', width: '100%' };
  const smallInputStyle = { border: 'none', outline: 'none', fontSize: 14, color: '#333', width: '100%' };
  const deleteBtnStyle = { background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap' as const };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={() => navigate('/checklists')}
          style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', fontSize: 14, padding: 0 }}
        >
          ← Назад к чек-листам
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#999' }}>{saving ? 'Сохранение...' : 'Сохранено'}</span>
          <button
            onClick={handleDeleteChecklist}
            style={{
              padding: '6px 14px', borderRadius: 6, border: '1px solid #e53935',
              background: '#fff', color: '#e53935', cursor: 'pointer', fontSize: 13,
            }}
          >
            Удалить чек-лист
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: color, display: 'inline-block' }} />
        <h2 style={{ margin: 0, color: '#1b5e20' }}>{name}</h2>
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} style={cardStyle}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: 12, borderBottom: '1px solid #f0f0f0', background: '#f7faf7',
          }}>
            <input
              value={section.title}
              onChange={(e) => setSectionTitle(sIdx, e.target.value)}
              onFocus={(e) => e.target.select()}
              onBlur={() => save(sections)}
              style={titleInputStyle}
            />
            <button
              onClick={() => removeSection(sIdx)}
              style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}
            >
              Удалить раздел
            </button>
          </div>

          <div style={{ padding: 12 }}>
            {section.categories.map((category, cIdx) => (
              <div key={cIdx} style={{ marginBottom: 14, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                  <input
                    value={category.title}
                    onChange={(e) => setCategoryTitle(sIdx, cIdx, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    onBlur={() => save(sections)}
                    style={{ ...smallInputStyle, fontWeight: 600, color: '#1b5e20' }}
                  />
                  <button onClick={() => removeCategory(sIdx, cIdx)} style={deleteBtnStyle}>
                    Удалить
                  </button>
                </div>

                {category.criteria.map((criterion, crIdx) => (
                  <div
                    key={crIdx}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px', borderBottom: '1px solid #f5f5f5',
                    }}
                  >
                    <input
                      value={criterion.title}
                      onChange={(e) => setCriterionTitle(sIdx, cIdx, crIdx, e.target.value)}
                      onFocus={(e) => e.target.select()}
                      onBlur={() => save(sections)}
                      style={smallInputStyle}
                    />
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setTypeMenuFor(typeMenuFor === `${sIdx}-${cIdx}-${crIdx}` ? null : `${sIdx}-${cIdx}-${crIdx}`)}
                        style={{
                          padding: '4px 10px', borderRadius: 6, border: '1px solid #cde5cf',
                          background: '#eef7ee', color: '#2e7d32', cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap',
                        }}
                      >
                        {typeLabel(criterion.type)}
                      </button>
                      {typeMenuFor === `${sIdx}-${cIdx}-${crIdx}` && (
                        <div style={{
                          position: 'absolute', top: '110%', right: 0, background: '#fff',
                          border: '1px solid #e0e0e0', borderRadius: 8, boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                          zIndex: 10, minWidth: 180,
                        }}>
                          {FIELD_TYPES.map(t => (
                            <div
                              key={t.value}
                              onClick={() => setCriterionType(sIdx, cIdx, crIdx, t.value)}
                              style={{
                                padding: '8px 14px', cursor: 'pointer', fontSize: 13,
                                background: criterion.type === t.value ? '#eef7ee' : 'transparent',
                              }}
                            >
                              {t.label}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => removeCriterion(sIdx, cIdx, crIdx)} style={deleteBtnStyle}>
                      Удалить
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addCriterion(sIdx, cIdx)}
                  style={{
                    margin: 10, padding: '6px 12px', borderRadius: 6, border: '1px dashed #a5d6a7',
                    background: '#fff', color: '#2e7d32', cursor: 'pointer', fontSize: 13,
                  }}
                >
                  + Добавить критерий
                </button>
              </div>
            ))}

            <button
              onClick={() => addCategory(sIdx)}
              style={{
                padding: '6px 12px', borderRadius: 6, border: '1px dashed #a5d6a7',
                background: '#fff', color: '#2e7d32', cursor: 'pointer', fontSize: 13,
              }}
            >
              + Добавить категорию
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addSection}
        style={{
          padding: '10px 18px', borderRadius: 8, border: 'none',
          background: '#2e7d32', color: '#fff', cursor: 'pointer', fontSize: 14,
        }}
      >
        + Добавить раздел
      </button>

      {sections.length === 0 && (
        <p style={{ color: '#999', marginTop: 12 }}>Ваш чек-лист пока пуст. Начните с добавления раздела.</p>
      )}
    </div>
  );
}

export default CheckListEditor;