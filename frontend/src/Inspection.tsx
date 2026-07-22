import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getInspection,
  getCheckList,
  updateInspection,
} from './api';
import type { Section, Criterion, Answer, Inspection as InspectionData } from './api';

function Inspection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';

  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cameraFor, setCameraFor] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const insp: InspectionData = await getInspection(token, id);
        setInspection(insp);

        const answersMap: Record<string, any> = {};
        (insp.answers || []).forEach((a: Answer) => {
          answersMap[a.criterionId] = a.value;
        });
        setAnswers(answersMap);

        const template = await getCheckList(token, insp.templateId);
        setSections(template.sections || []);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить проверку');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const persist = async (updatedAnswers: Record<string, any>, status?: InspectionData['status']) => {
    if (!id) return;
    setSaving(true);
    try {
      const answersArray: Answer[] = Object.entries(updatedAnswers).map(([criterionId, value]) => ({
        criterionId,
        value,
      }));
      await updateInspection(token, id, {
        answers: answersArray,
        ...(status ? { status } : {}),
      });
      if (status) setInspection(prev => (prev ? { ...prev, status } : prev));
    } catch (err) {
      console.error(err);
      setError('Не удалось сохранить ответ');
    } finally {
      setSaving(false);
    }
  };

  const setAnswer = (criterionId: string, value: any, autosave = true) => {
    const updated = { ...answers, [criterionId]: value };
    setAnswers(updated);
    if (autosave) persist(updated);
  };

  const handlePhotoCapture = (criterionId: string, dataUrl: string) => {
    setAnswer(criterionId, dataUrl);
    setCameraFor(null);
  };

  const handlePhotoRemove = (criterionId: string) => {
    setAnswer(criterionId, null);
  };

  const isAnswered = (criterion: Criterion) => {
    if (criterion.type === 'info') return true;
    const id = criterion._id as string;
    const value = answers[id];
    if (criterion.type === 'yesNo') return value === 'yes' || value === 'no';
    if (criterion.type === 'photo') return !!value;
    if (criterion.type === 'text') return typeof value === 'string' && value.trim().length > 0;
    return false;
  };

  const allCriteria = sections.flatMap(s => s.categories.flatMap(c => c.criteria));
  const requiredCriteria = allCriteria.filter(c => c.type !== 'info');
  const answeredCount = requiredCriteria.filter(isAnswered).length;
  const allAnswered = requiredCriteria.length > 0 && answeredCount === requiredCriteria.length;

  const handleComplete = async () => {
    if (!allAnswered) {
      setError('Заполните все пункты проверки перед завершением.');
      return;
    }
    setError('');
    await persist(answers, 'completed');
    navigate('/checklists');
  };

  if (loading) return <p>Загрузка...</p>;
  if (!inspection) return <p>Проверка не найдена</p>;

  const cardStyle = { background: '#fff', border: '1px solid #eee', borderRadius: 8, marginBottom: 16 };
  const isCompleted = inspection.status === 'completed';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <button
          onClick={() => navigate('/checklists')}
          style={{ background: 'none', border: 'none', color: '#2e7d32', cursor: 'pointer', fontSize: 14, padding: 0 }}
        >
          ← Назад к чек-листам
        </button>
        <span style={{ fontSize: 13, color: '#999' }}>{saving ? 'Сохранение...' : 'Сохранено'}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
        <span style={{ width: 14, height: 14, borderRadius: '50%', background: inspection.color, display: 'inline-block' }} />
        <h2 style={{ margin: 0, color: '#1b5e20' }}>{inspection.templateName}</h2>
      </div>

      <div style={{ fontSize: 13, color: '#777', marginBottom: 16 }}>
        {answeredCount} / {requiredCriteria.length} пунктов заполнено
        {isCompleted && <span style={{ color: '#2e7d32', fontWeight: 600 }}> · Проверка завершена</span>}
      </div>

      {sections.map((section, sIdx) => (
        <div key={sIdx} style={cardStyle}>
          <div style={{
            padding: 12, borderBottom: '1px solid #f0f0f0', background: '#f7faf7',
            fontWeight: 700, fontSize: 15, color: '#1b5e20',
          }}>
            {section.title}
          </div>

          <div style={{ padding: 12 }}>
            {section.categories.map((category, cIdx) => (
              <div key={cIdx} style={{ marginBottom: 14, border: '1px solid #f0f0f0', borderRadius: 6 }}>
                <div style={{ padding: '8px 12px', background: '#fafafa', borderBottom: '1px solid #f0f0f0', fontWeight: 600, color: '#1b5e20', fontSize: 14 }}>
                  {category.title}
                </div>

                {category.criteria.map((criterion, crIdx) => {
                  const critId = (criterion._id as string) || `${sIdx}-${cIdx}-${crIdx}`;
                  const value = answers[critId];
                  return (
                    <div
                      key={critId}
                      style={{
                        padding: '10px 12px', borderBottom: '1px solid #f5f5f5',
                      }}
                    >
                      <div style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>{criterion.title}</div>

                      {criterion.type === 'info' && (
                        <div style={{ fontSize: 13, color: '#666', background: '#f7faf7', borderRadius: 6, padding: '8px 10px' }}>
                          {criterion.title}
                        </div>
                      )}

                      {criterion.type === 'yesNo' && (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button
                            disabled={isCompleted}
                            onClick={() => setAnswer(critId, 'yes')}
                            style={{
                              padding: '6px 16px', borderRadius: 6, cursor: isCompleted ? 'default' : 'pointer', fontSize: 13,
                              border: value === 'yes' ? '1px solid #2e7d32' : '1px solid #ccc',
                              background: value === 'yes' ? '#2e7d32' : '#fff',
                              color: value === 'yes' ? '#fff' : '#333',
                            }}
                          >
                            Да
                          </button>
                          <button
                            disabled={isCompleted}
                            onClick={() => setAnswer(critId, 'no')}
                            style={{
                              padding: '6px 16px', borderRadius: 6, cursor: isCompleted ? 'default' : 'pointer', fontSize: 13,
                              border: value === 'no' ? '1px solid #e53935' : '1px solid #ccc',
                              background: value === 'no' ? '#e53935' : '#fff',
                              color: value === 'no' ? '#fff' : '#333',
                            }}
                          >
                            Нет
                          </button>
                        </div>
                      )}

                      {criterion.type === 'photo' && (
                        <div>
                          {!isCompleted && (
                            <button
                              onClick={() => setCameraFor(critId)}
                              style={{
                                padding: '6px 14px', borderRadius: 6, border: '1px solid #2e7d32',
                                background: '#eef7ee', color: '#2e7d32', cursor: 'pointer', fontSize: 13,
                              }}
                            >
                              {value ? 'Переснять' : '📷 Сделать фото'}
                            </button>
                          )}
                          {value && (
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                              <img
                                src={value}
                                alt="Фото"
                                style={{ display: 'block', maxWidth: 220, borderRadius: 6, border: '1px solid #eee' }}
                              />
                              {!isCompleted && (
                                <button
                                  onClick={() => handlePhotoRemove(critId)}
                                  style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: 13 }}
                                >
                                  Удалить
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {criterion.type === 'text' && (
                        <textarea
                          disabled={isCompleted}
                          value={value || ''}
                          onChange={(e) => setAnswer(critId, e.target.value, false)}
                          onBlur={() => persist(answers)}
                          placeholder="Введите комментарий..."
                          rows={2}
                          style={{
                            width: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #ccc',
                            resize: 'vertical', boxSizing: 'border-box', fontSize: 13,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && <div style={{ color: '#e53935', fontSize: 13, marginBottom: 12 }}>{error}</div>}

      {!isCompleted && (
        <button
          onClick={handleComplete}
          disabled={!allAnswered || saving}
          style={{
            padding: '10px 18px', borderRadius: 8, border: 'none',
            background: allAnswered ? '#2e7d32' : '#a5d6a7', color: '#fff',
            cursor: allAnswered ? 'pointer' : 'default', fontSize: 14,
          }}
        >
          Завершить проверку
        </button>
      )}

      {cameraFor && (
        <CameraCapture
          onCapture={(dataUrl) => handlePhotoCapture(cameraFor, dataUrl)}
          onClose={() => setCameraFor(null)}
        />
      )}
    </div>
  );
}

function CameraCapture({ onCapture, onClose }: { onCapture: (dataUrl: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [captured, setCaptured] = useState<string | null>(null);
  const [camError, setCamError] = useState('');

  useEffect(() => {
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setReady(true);
      })
      .catch((err) => {
        console.error(err);
        setCamError('Не удалось получить доступ к камере. Разрешите доступ к камере в браузере.');
      });

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const takeShot = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setCaptured(canvas.toDataURL('image/jpeg', 0.85));
  };

  const retake = () => setCaptured(null);

  const confirm = () => {
    if (captured) onCapture(captured);
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: 16,
      }}
    >
      {camError && (
        <div style={{ color: '#fff', textAlign: 'center', marginBottom: 16 }}>{camError}</div>
      )}

      {!camError && !captured && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8, background: '#000' }}
        />
      )}

      {captured && (
        <img
          src={captured}
          alt="Снимок"
          style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 8 }}
        />
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
        <button
          onClick={onClose}
          style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer' }}
        >
          Отмена
        </button>

        {!captured && !camError && (
          <button
            onClick={takeShot}
            disabled={!ready}
            style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#2e7d32', color: '#fff', cursor: ready ? 'pointer' : 'default' }}
          >
            Сделать снимок
          </button>
        )}

        {captured && (
          <>
            <button
              onClick={retake}
              style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #fff', background: 'transparent', color: '#fff', cursor: 'pointer' }}
            >
              Переснять
            </button>
            <button
              onClick={confirm}
              style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#2e7d32', color: '#fff', cursor: 'pointer' }}
            >
              Использовать
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Inspection;