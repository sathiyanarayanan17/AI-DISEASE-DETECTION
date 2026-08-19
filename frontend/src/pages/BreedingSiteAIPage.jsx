import React, { useState, useRef } from 'react';
import { Upload, Camera, CheckCircle, XCircle, Image, Brain } from 'lucide-react';

const BreedingSiteAIPage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchResults, setBatchResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const batchInputRef = useRef(null);

  const stats = [
    { label: 'Images Analyzed', value: '12,847', icon: Image, color: '#3b82f6' },
    { label: 'Breeding Sites Detected', value: '3,291', icon: Camera, color: '#ef4444' },
    { label: 'Accuracy', value: '96.2%', icon: CheckCircle, color: '#10b981' },
    { label: 'False Positive Rate', value: '3.8%', icon: XCircle, color: '#f59e0b' }
  ];

  const recentClassifications = [
    { id: 1, result: 'Detected', confidence: 94.2, district: 'Chennai', timestamp: '2026-08-19 13:42' },
    { id: 2, result: 'No Breeding Site', confidence: 97.1, district: 'Coimbatore', timestamp: '2026-08-19 13:38' },
    { id: 3, result: 'Detected', confidence: 89.6, district: 'Madurai', timestamp: '2026-08-19 13:25' },
    { id: 4, result: 'No Breeding Site', confidence: 95.4, district: 'Tiruchirappalli', timestamp: '2026-08-19 13:10' },
    { id: 5, result: 'Detected', confidence: 91.8, district: 'Salem', timestamp: '2026-08-19 12:55' },
    { id: 6, result: 'No Breeding Site', confidence: 98.3, district: 'Tirunelveli', timestamp: '2026-08-19 12:40' }
  ];

  const modelMetrics = [
    { label: 'Accuracy', value: 96.2, color: '#10b981' },
    { label: 'Precision', value: 94.7, color: '#3b82f6' },
    { label: 'Recall', value: 92.8, color: '#f59e0b' },
    { label: 'F1 Score', value: 93.7, color: '#8b5cf6' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      processImage(file);
    }
  };

  const processImage = (file) => {
    setUploadedImage(file.name);
    const isDetected = Math.random() > 0.5;
    if (isDetected) {
      setClassificationResult({
        class: 'Breeding Site Detected',
        confidence: 94.2,
        riskLevel: 'High',
        action: 'Immediate fogging operation recommended. Deploy larvicide within 24 hours.'
      });
    } else {
      setClassificationResult({
        class: 'No Breeding Site',
        confidence: 97.1,
        riskLevel: 'Low',
        action: 'No immediate action required. Schedule routine inspection in 7 days.'
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processImage(file);
    }
  };

  const handleBatchUpload = (e) => {
    const files = Array.from(e.target.files);
    setBatchFiles(files);
    const results = files.map((file, index) => {
      const isDetected = Math.random() > 0.5;
      return {
        id: index + 1,
        filename: file.name,
        result: isDetected ? 'Breeding Site Detected' : 'No Breeding Site',
        confidence: isDetected ? (88 + Math.random() * 8).toFixed(1) : (93 + Math.random() * 6).toFixed(1),
        riskLevel: isDetected ? 'High' : 'Low'
      };
    });
    setBatchResults(results);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={32} color="#8b5cf6" />
          AI Image Analysis — Breeding Site Detection
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>
          TensorFlow.js-powered CNN model for automated identification of mosquito breeding sites from field images
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '32px' }}>
        {stats.map((stat, i) => (
          <div className="glass-card" key={i} style={{ padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{stat.label}</span>
              <stat.icon size={20} color={stat.color} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Upload Area + Classification Result */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Upload Area */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={18} color="#3b82f6" />
            Upload Image for Analysis
          </h3>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? '#3b82f6' : '#334155'}`,
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              backgroundColor: isDragging ? 'rgba(59,130,246,0.05)' : 'rgba(30,41,59,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            <Upload size={48} color="#64748b" style={{ margin: '0 auto 16px' }} />
            <p style={{ fontSize: '15px', fontWeight: 500, marginBottom: '8px' }}>
              Drag & drop an image here
            </p>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              or click to browse — PNG, JPG, JPEG (max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
          {uploadedImage && (
            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'rgba(59,130,246,0.1)', borderRadius: '8px', fontSize: '13px' }}>
              <strong>Uploaded:</strong> {uploadedImage}
            </div>
          )}
        </div>

        {/* Classification Result */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={18} color="#10b981" />
            Classification Result
          </h3>
          {classificationResult ? (
            <div>
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                backgroundColor: classificationResult.riskLevel === 'High' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${classificationResult.riskLevel === 'High' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                marginBottom: '16px',
                textAlign: 'center'
              }}>
                {classificationResult.riskLevel === 'High' ?
                  <XCircle size={32} color="#ef4444" style={{ margin: '0 auto 8px' }} /> :
                  <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px' }} />
                }
                <p style={{ fontSize: '16px', fontWeight: 700, color: classificationResult.riskLevel === 'High' ? '#ef4444' : '#10b981' }}>
                  {classificationResult.class} ({classificationResult.confidence}% confidence)
                </p>
              </div>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(30,41,59,0.4)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Class</span>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{classificationResult.class}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(30,41,59,0.4)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Confidence</span>
                  <span style={{ fontWeight: 600, fontSize: '13px' }}>{classificationResult.confidence}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'rgba(30,41,59,0.4)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px' }}>Risk Level</span>
                  <span style={{
                    fontWeight: 600, fontSize: '13px',
                    color: classificationResult.riskLevel === 'High' ? '#ef4444' : '#10b981'
                  }}>{classificationResult.riskLevel}</span>
                </div>
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(30,41,59,0.4)', borderRadius: '8px' }}>
                  <span style={{ color: '#94a3b8', fontSize: '13px', display: 'block', marginBottom: '4px' }}>Recommended Action</span>
                  <span style={{ fontWeight: 500, fontSize: '13px' }}>{classificationResult.action}</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b' }}>
              <Image size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Upload an image to see classification results</p>
            </div>
          )}
        </div>
      </div>

      {/* CNN Architecture */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={18} color="#8b5cf6" />
          CNN Model Architecture
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          padding: '16px',
          backgroundColor: 'rgba(30,41,59,0.4)',
          borderRadius: '12px',
          flexWrap: 'wrap'
        }}>
          {['Input(224×224×3)', 'Conv2D(32, 3×3)', 'MaxPool(2×2)', 'Conv2D(64, 3×3)', 'MaxPool(2×2)', 'Flatten', 'Dense(128, ReLU)', 'Sigmoid(1)'].map((layer, i, arr) => (
            <React.Fragment key={i}>
              <div style={{
                padding: '10px 16px',
                backgroundColor: i === 0 ? 'rgba(59,130,246,0.15)' : i === arr.length - 1 ? 'rgba(16,185,129,0.15)' : 'rgba(139,92,246,0.1)',
                border: `1px solid ${i === 0 ? 'rgba(59,130,246,0.3)' : i === arr.length - 1 ? 'rgba(16,185,129,0.3)' : 'rgba(139,92,246,0.2)'}`,
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                fontFamily: 'monospace',
                whiteSpace: 'nowrap'
              }}>
                {layer}
              </div>
              {i < arr.length - 1 && (
                <span style={{ color: '#64748b', fontSize: '18px' }}>→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Recent Classifications Grid */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Recent Classifications</h3>
        <div className="grid-cols-3" style={{ gap: '16px' }}>
          {recentClassifications.map((item) => (
            <div key={item.id} style={{
              padding: '16px',
              backgroundColor: 'rgba(30,41,59,0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(51,65,85,0.5)'
            }}>
              {/* Thumbnail Placeholder */}
              <div style={{
                width: '100%',
                height: '100px',
                backgroundColor: 'rgba(51,65,85,0.5)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <Image size={28} color="#64748b" />
              </div>
              {/* Result Badge */}
              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: '8px',
                backgroundColor: item.result === 'Detected' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                color: item.result === 'Detected' ? '#ef4444' : '#10b981'
              }}>
                {item.result}
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
                Confidence: <strong style={{ color: '#e2e8f0' }}>{item.confidence}%</strong>
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>
                District: <strong style={{ color: '#e2e8f0' }}>{item.district}</strong>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{item.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Performance Metrics */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Model Performance Metrics</h3>
        <div className="grid-cols-4" style={{ gap: '16px' }}>
          {modelMetrics.map((metric, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>{metric.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: metric.color, marginBottom: '12px' }}>{metric.value}%</div>
              <div className="progress-bar-track" style={{ height: '8px', borderRadius: '4px' }}>
                <div className="progress-bar-fill" style={{
                  width: `${metric.value}%`,
                  height: '100%',
                  borderRadius: '4px',
                  backgroundColor: metric.color
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Batch Analysis Mode */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Upload size={18} color="#f59e0b" />
          Batch Analysis Mode
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '16px' }}>
          Upload multiple images for bulk classification. Results are displayed in a table format.
        </p>
        <div style={{ marginBottom: '16px' }}>
          <button
            className="btn btn-primary"
            onClick={() => batchInputRef.current?.click()}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Upload size={16} />
            Select Multiple Images
          </button>
          <input
            ref={batchInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleBatchUpload}
            style={{ display: 'none' }}
          />
        </div>
        {batchResults.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Filename</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Result</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Confidence</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#94a3b8', borderBottom: '1px solid #334155' }}>Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {batchResults.map((result) => (
                  <tr key={result.id} style={{ borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{result.id}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace' }}>{result.filename}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: result.result === 'Breeding Site Detected' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                        color: result.result === 'Breeding Site Detected' ? '#ef4444' : '#10b981'
                      }}>
                        {result.result}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600 }}>{result.confidence}%</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                      <span style={{ color: result.riskLevel === 'High' ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                        {result.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {batchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#64748b', fontSize: '13px' }}>
            No batch results yet. Upload multiple images to analyze.
          </div>
        )}
      </div>
    </div>
  );
};

export default BreedingSiteAIPage;
