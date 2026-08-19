import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  MessageSquare, TrendingUp, AlertTriangle, MessageCircle,
  Search, MapPin, Hash, Activity, Eye, Bell,
  ArrowUp, ArrowDown, Globe, Zap, BarChart2
} from 'lucide-react';

const keywordData = [
  { keyword: 'fever', count: 1842, change: '+12%' },
  { keyword: 'dengue', count: 1567, change: '+34%' },
  { keyword: 'mosquito', count: 1203, change: '+8%' },
  { keyword: 'vomiting', count: 987, change: '+22%' },
  { keyword: 'hospital', count: 876, change: '+5%' },
  { keyword: 'outbreak', count: 654, change: '+45%' }
];

const sentimentData = [
  { name: 'Panic', value: 18, color: '#ef4444' },
  { name: 'Concerned', value: 35, color: '#f59e0b' },
  { name: 'Informative', value: 32, color: '#3b82f6' },
  { name: 'Neutral', value: 15, color: '#6b7280' }
];

const socialFeed = [
  {
    id: 1, platform: 'Twitter', user: '@health_chennai', district: 'Chennai',
    text: 'Multiple dengue cases reported in T.Nagar area. Stagnant water everywhere after rains. Stay safe! #DengueFever #Chennai',
    time: '2 min ago', sentiment: 'Concerned', likes: 234, retweets: 89
  },
  {
    id: 2, platform: 'Twitter', user: '@coimbatore_news', district: 'Coimbatore',
    text: 'My neighbor\'s family all down with high fever and vomiting. Hospital beds filling up fast in Coimbatore GH. Scary situation 😰',
    time: '5 min ago', sentiment: 'Panic', likes: 456, retweets: 201
  },
  {
    id: 3, platform: 'Twitter', user: '@dr_tamil_health', district: 'Madurai',
    text: 'PSA: Dengue symptoms include high fever, headache, joint pain. If platelet count drops, seek immediate medical help. #HealthAlert',
    time: '8 min ago', sentiment: 'Informative', likes: 1203, retweets: 567
  },
  {
    id: 4, platform: 'Twitter', user: '@salem_resident', district: 'Salem',
    text: 'Corporation spraying mosquito fogging in Ward 12 Salem today. About time! Too many mosquitoes this monsoon season.',
    time: '12 min ago', sentiment: 'Neutral', likes: 45, retweets: 12
  },
  {
    id: 5, platform: 'Twitter', user: '@trichy_alerts', district: 'Tiruchirappalli',
    text: '⚠️ OUTBREAK ALERT: 47 cholera cases confirmed in Srirangam area. Contaminated water supply suspected. Boil water before drinking!',
    time: '15 min ago', sentiment: 'Panic', likes: 2341, retweets: 1456
  },
  {
    id: 6, platform: 'Twitter', user: '@villupuram_ppl', district: 'Villupuram',
    text: 'Fever cases increasing in rural areas. Local PHC has run out of paracetamol. Need better healthcare infrastructure.',
    time: '18 min ago', sentiment: 'Concerned', likes: 178, retweets: 67
  },
  {
    id: 7, platform: 'Twitter', user: '@thanjavur_daily', district: 'Thanjavur',
    text: 'Mosquito breeding index high near Cauvery delta. Health dept should take preventive action before dengue spreads.',
    time: '22 min ago', sentiment: 'Concerned', likes: 312, retweets: 98
  },
  {
    id: 8, platform: 'Twitter', user: '@tn_health_info', district: 'Kancheepuram',
    text: 'Malaria prevention drive starting tomorrow in Kancheepuram district. Free nets distributed at all govt hospitals.',
    time: '25 min ago', sentiment: 'Informative', likes: 567, retweets: 234
  }
];

const districtMentions = [
  { district: 'Chennai', mentions: 4521, dengue: 1890, cholera: 234, malaria: 156, trend: 'up' },
  { district: 'Coimbatore', mentions: 2134, dengue: 876, cholera: 98, malaria: 234, trend: 'up' },
  { district: 'Madurai', mentions: 1876, dengue: 654, cholera: 187, malaria: 312, trend: 'down' },
  { district: 'Tiruchirappalli', mentions: 1654, dengue: 432, cholera: 567, malaria: 98, trend: 'up' },
  { district: 'Salem', mentions: 1243, dengue: 543, cholera: 76, malaria: 187, trend: 'down' },
  { district: 'Thanjavur', mentions: 1098, dengue: 765, cholera: 43, malaria: 65, trend: 'up' },
  { district: 'Villupuram', mentions: 987, dengue: 321, cholera: 123, malaria: 234, trend: 'up' },
  { district: 'Kancheepuram', mentions: 876, dengue: 234, cholera: 56, malaria: 345, trend: 'down' },
  { district: 'Tirunelveli', mentions: 765, dengue: 432, cholera: 87, malaria: 98, trend: 'up' },
  { district: 'Erode', mentions: 654, dengue: 234, cholera: 45, malaria: 123, trend: 'down' }
];

const trendingAlerts = [
  { id: 1, text: 'Dengue spike mentions in Chennai +340% in 24h', severity: 'critical', time: '10 min ago' },
  { id: 2, text: 'Cholera keywords surging in Tiruchirappalli +180%', severity: 'high', time: '25 min ago' },
  { id: 3, text: '"Hospital beds full" trending in Coimbatore', severity: 'high', time: '45 min ago' },
  { id: 4, text: 'Mosquito complaints spike in Thanjavur delta region +120%', severity: 'medium', time: '1 hr ago' },
  { id: 5, text: '"Contaminated water" reports from Villupuram +95%', severity: 'medium', time: '2 hr ago' },
  { id: 6, text: 'Fever + vomiting mentions cluster detected in Salem', severity: 'low', time: '3 hr ago' }
];

const googleTrendsData = [
  { date: 'Aug 12', volume: 23 },
  { date: 'Aug 13', volume: 28 },
  { date: 'Aug 14', volume: 34 },
  { date: 'Aug 15', volume: 42 },
  { date: 'Aug 16', volume: 67 },
  { date: 'Aug 17', volume: 78 },
  { date: 'Aug 18', volume: 89 },
  { date: 'Aug 19', volume: 100 }
];

const getSentimentColor = (sentiment) => {
  switch (sentiment) {
    case 'Panic': return '#ef4444';
    case 'Concerned': return '#f59e0b';
    case 'Informative': return '#3b82f6';
    case 'Neutral': return '#6b7280';
    default: return '#6b7280';
  }
};

const getSeverityStyle = (severity) => {
  switch (severity) {
    case 'critical': return { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' };
    case 'high': return { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' };
    case 'medium': return { background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' };
    case 'low': return { background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)' };
    default: return { background: 'rgba(107,114,128,0.15)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.3)' };
  }
};

export default function SocialMediaPage() {
  const [feedItems, setFeedItems] = useState(socialFeed);
  const [animatedStats, setAnimatedStats] = useState({ tweets: 0, mentions: 0, keywords: 0, alerts: 0 });

  useEffect(() => {
    const targets = { tweets: 24567, mentions: 3842, keywords: 156, alerts: 23 };
    const duration = 1500;
    const steps = 40;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        tweets: Math.floor(targets.tweets * progress),
        mentions: Math.floor(targets.mentions * progress),
        keywords: Math.floor(targets.keywords * progress),
        alerts: Math.floor(targets.alerts * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Tweets Analyzed Today', value: animatedStats.tweets.toLocaleString(), icon: Twitter, color: '#1d9bf0', change: '+18%' },
    { label: 'Disease Mentions', value: animatedStats.mentions.toLocaleString(), icon: MessageCircle, color: '#f59e0b', change: '+34%' },
    { label: 'Trending Keywords', value: animatedStats.keywords.toString(), icon: Hash, color: '#8b5cf6', change: '+12%' },
    { label: 'Alert Signals', value: animatedStats.alerts.toString(), icon: AlertTriangle, color: '#ef4444', change: '+45%' }
  ];

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div className="flex-between" style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #1d9bf0, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={22} color="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Social Media Disease Surveillance</h1>
              <p style={{ fontSize: '13px', opacity: 0.6, margin: 0 }}>Real-time monitoring of disease-related social media activity across Tamil Nadu</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '20px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>LIVE MONITORING</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid-cols-4" style={{ marginBottom: '24px' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '20px' }}>
            <div className="flex-between" style={{ marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={20} color={stat.color} />
              </div>
              <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                <ArrowUp size={12} /> {stat.change}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700 }}>{stat.value}</div>
            <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Live Social Feed */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#1d9bf0" /> Live Social Feed
            </h3>
            <span style={{ fontSize: '11px', opacity: 0.5 }}>Auto-refreshing</span>
          </div>
          <div style={{ maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {feedItems.map((item) => (
              <div key={item.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Twitter size={14} color="#1d9bf0" />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.user}</span>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                      <MapPin size={10} style={{ display: 'inline', marginRight: '3px' }} />{item.district}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', opacity: 0.5 }}>{item.time}</span>
                </div>
                <p style={{ fontSize: '13px', margin: '0 0 10px 0', lineHeight: 1.5, opacity: 0.85 }}>{item.text}</p>
                <div className="flex-between">
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: `${getSentimentColor(item.sentiment)}20`, color: getSentimentColor(item.sentiment) }}>
                    {item.sentiment}
                  </span>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '11px', opacity: 0.5 }}>
                    <span>❤️ {item.likes}</span>
                    <span>🔁 {item.retweets}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Keyword Frequency Bar Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart2 size={18} color="#8b5cf6" /> Keyword Frequency (24h)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={keywordData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="keyword" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }} />
              <RechartsTooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {keywordData.map((entry, index) => (
                  <Cell key={index} fill={['#ef4444', '#f59e0b', '#8b5cf6', '#3b82f6', '#22c55e', '#ec4899'][index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {keywordData.map((kw, idx) => (
              <div key={idx} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', opacity: 0.7 }}>#{kw.keyword}</span>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 600 }}>{kw.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Sentiment Pie Chart */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="#f59e0b" /> Sentiment Analysis
          </h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  dataKey="value"
                  stroke="none"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {sentimentData.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                  <span style={{ fontSize: '13px', flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '16px', padding: '12px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ margin: 0, fontSize: '12px', color: '#ef4444' }}>
              ⚠️ Panic sentiment has increased by 8% in the last 6 hours — correlates with dengue surge reports from Chennai
            </p>
          </div>
        </div>

        {/* Trending Alerts */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#ef4444" /> Trending Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {trendingAlerts.map((alert) => (
              <div key={alert.id} style={{ padding: '12px 14px', borderRadius: '8px', ...getSeverityStyle(alert.severity), display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={16} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{alert.text}</p>
                  <span style={{ fontSize: '11px', opacity: 0.7 }}>{alert.time}</span>
                </div>
                <span className="risk-badge" style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', textTransform: 'uppercase', fontWeight: 600 }}>
                  {alert.severity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Geographic Distribution Table */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#22c55e" /> Geographic Distribution of Mentions
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', opacity: 0.6, fontWeight: 500 }}>District</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', opacity: 0.6, fontWeight: 500 }}>Total Mentions</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', opacity: 0.6, fontWeight: 500 }}>Dengue</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', opacity: 0.6, fontWeight: 500 }}>Cholera</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', opacity: 0.6, fontWeight: 500 }}>Malaria</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', opacity: 0.6, fontWeight: 500 }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {districtMentions.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.district}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>{row.mentions.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#f59e0b' }}>{row.dengue}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#3b82f6' }}>{row.cholera}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#8b5cf6' }}>{row.malaria}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      {row.trend === 'up' ? (
                        <ArrowUp size={14} color="#ef4444" />
                      ) : (
                        <ArrowDown size={14} color="#22c55e" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Google Trends Mockup */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div className="flex-between" style={{ marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={18} color="#4285f4" /> Google Trends
            </h3>
            <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '10px', background: 'rgba(66,133,244,0.1)', color: '#4285f4' }}>
              Live Sync
            </span>
          </div>
          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(66,133,244,0.05)', border: '1px solid rgba(66,133,244,0.15)', marginBottom: '16px' }}>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Search term:</p>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 600, color: '#4285f4' }}>"dengue symptoms tamil nadu"</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={googleTrendsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.6)' }} />
              <RechartsTooltip
                contentStyle={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#fff' }}
              />
              <Line type="monotone" dataKey="volume" stroke="#4285f4" strokeWidth={2} dot={{ fill: '#4285f4', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="flex-between">
              <span style={{ fontSize: '12px', opacity: 0.7 }}>Interest over time</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ef4444' }}>+335%</span>
            </div>
            <p style={{ margin: '6px 0 0 0', fontSize: '11px', opacity: 0.6 }}>
              Search volume peaked today — highest in 90 days. Correlates with social media spike in Chennai.
            </p>
          </div>

          <div style={{ marginTop: '14px' }}>
            <p style={{ fontSize: '12px', opacity: 0.6, marginBottom: '8px' }}>Related Queries (Rising):</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['dengue treatment', 'platelet count low', 'dengue hospital near me', 'dengue prevention tips', 'mosquito net buy online'].map((q, idx) => (
                <span key={idx} style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
