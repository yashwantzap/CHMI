import React, { useEffect, useState } from 'react';
import { postForm, postJson } from '../api';
import { SkeletonCard } from './Skeleton';

export default function Dashboard() {
  const verified = sessionStorage.getItem('chmi_verified') === '1';
  const user = JSON.parse(sessionStorage.getItem('chmi_user') || '{}');

  const [disease, setDisease] = useState<'LSD'|'FMD'>('LSD');
  const [cattleId, setCattleId] = useState('');
  const [age, setAge] = useState<number|''>('');
  const [gender, setGender] = useState<'Male'|'Female'>('Male');
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runPrediction = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('disease', disease);
        fd.append('cattle_id', cattleId || '');
        fd.append('gender', gender);
        fd.append('age', String(age || ''));
        fd.append('user', JSON.stringify(user));
        const res = await postForm('/predict-file', fd);
        setResult(res);
      } else {
        const payload = { disease, cattle_id: cattleId, gender, age, user };
        const res = await postJson('/predict', payload);
        setResult(res);
      }
    } catch (err:any) {
      setResult({ error: err.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  if (!verified) {
    return (
      <div className="content-grid">
        <div className="card">
          <h2>Dashboard</h2>
          <p>Please verify OTP to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-grid">
      <div className="card">
        <h2>Run Prediction</h2>

        <div className="row-3">
          <label>
            Cattle ID
            <input value={cattleId} onChange={e => setCattleId(e.target.value)} />
          </label>

          <label>
            Age (years)
            <input type="number" value={age as any} onChange={e => setAge(e.target.value ? Number(e.target.value) : '')} />
          </label>

          <label>
            Gender
            <select value={gender} onChange={e => setGender(e.target.value as 'Male'|'Female')}>
              <option>Male</option><option>Female</option>
            </select>
          </label>
        </div>

        <div style={{ marginTop: 12 }}>
          <label>
            Upload Image (optional)
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
          </label>
        </div>

        <div className="form-row">
          <button onClick={runPrediction} disabled={loading}>{loading ? 'Running...' : 'Run Prediction'}</button>
          <button onClick={() => { setResult(null); setFile(null); }} className="ghost">Reset</button>
        </div>

        {loading && <SkeletonCard />}

        {result && (
          <div className="result">
            <h4>Result</h4>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>

      <div className="card small-card">
        <h3>About</h3>
        <p className="muted">Model runs are executed on the backend. The wrapper will use the uploaded file at <code>/mnt/data/app.py</code> if it exposes `predict`/`predict_file` functions.</p>
      </div>
    </div>
  );
}
