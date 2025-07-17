import React, { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, Experience, Certificate, Project, Skill } from '../context/SupabaseContext';

interface CVGeneratorProps {
  onGenerationComplete?: () => void;
}

const CVGenerator: React.FC<CVGeneratorProps> = ({ onGenerationComplete }) => {
  const { theme } = useTheme();
  const { getExperience, getCertificates, getProjects, getAbout, getSkills } = useSupabase();
  const cvRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{
    experiences: Experience[];
    certificates: Certificate[];
    projects: Project[];
    about: any;
  }>({
    experiences: [],
    certificates: [],
    projects: [],
    about: null
  });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experiences, certificates, projects, about, skillsData] = await Promise.all([
          getExperience(),
          getCertificates(),
          getProjects(),
          getAbout(),
          getSkills()
        ]);
        const latestAbout = about && about.length > 0 ? about[0] : null;
        setData({
          experiences,
          certificates,
          projects,
          about: latestAbout
        });
        setSkills(skillsData || []);
      } catch (error) {
        console.error('Error fetching CV data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getExperience, getCertificates, getProjects, getAbout, getSkills]);

  // Helper for dynamic fields (fallbacks)
  const about = data.about || {};
  const getValue = (field: string, fallback: string) => {
    return about[field] && about[field].trim() !== '' ? about[field] : fallback;
  };
  const defaultName = 'Afnan Ul Haq';
  const defaultLocation = 'Rawalpindi, Pakistan';
  const defaultPhone = '+92(331) 7755477';
  const defaultEmail = 'afnanulhaq4@gmail.com';
  const defaultLinkedIn = 'https://www.linkedin.com/in/afnanulhaqque/';
  const defaultGitHub = 'https://github.com/afnanulhaqque';
  const defaultDegree = 'BS Information Technology';
  const defaultUniversity = 'International Islamic University, Islamabad';
  const defaultEducationYears = '2023–2027';

  // Helper to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  // Helper to join skills by category from skills state
  const getSkillsByCategory = (category: string) => {
    if (!skills || !Array.isArray(skills)) return '';
    return skills
      .filter((s: Skill) => s.category && s.category.toLowerCase() === category.toLowerCase())
      .map((s: Skill) => s.name)
      .join(', ');
  };

  // Auto-generate and download PDF on mount (no preview)
  useEffect(() => {
    if (!isLoading && cvRef.current) {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: "Afnan's CV.pdf",
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          scrollY: 0
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
          compress: true
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          before: '.page-break'
        }
      };
      html2pdf().set(opt).from(cvRef.current).save();
      onGenerationComplete?.();
    }
  }, [isLoading, onGenerationComplete]);

  // Hidden container for PDF only
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', width: 0, height: 0, overflow: 'hidden' }}>
      <div
        ref={cvRef}
        id="cv-template"
        style={{
          background: '#fff',
          color: '#222',
          width: 800,
          minHeight: 1120,
          margin: '0 auto',
          fontFamily: 'Segoe UI, Arial, Helvetica, sans-serif',
          padding: 40,
          borderRadius: 10,
          boxShadow: '0 2px 16px rgba(0,0,0,0.10)',
          border: '1.5px solid #e0e0e0',
        }}
      >
        <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: 16, marginBottom: 24, textAlign: 'center' }}>
          <h2 style={{ letterSpacing: 2, fontWeight: 800, fontSize: 32, margin: 0, color: '#2563eb' }}>{getValue('name', defaultName)}</h2>
          <div style={{ fontSize: 15, marginTop: 8, color: '#444' }}>{getValue('location', defaultLocation)} | {getValue('phone', defaultPhone)} | {getValue('email', defaultEmail)}</div>
          <div style={{ fontSize: 14, marginTop: 4, color: '#444' }}>
            <span>LinkedIn: <a href={getValue('linkedin', defaultLinkedIn)} style={{ color: '#2563eb', textDecoration: 'none' }}>{getValue('linkedin', defaultLinkedIn)}</a></span>
            {' | '}
            <span>GitHub: <a href={getValue('github', defaultGitHub)} style={{ color: '#2563eb', textDecoration: 'none' }}>{getValue('github', defaultGitHub)}</a></span>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#2563eb', fontSize: 20, fontWeight: 700, marginBottom: 8, borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>EDUCATION</h3>
          <div style={{ fontSize: 15, color: '#222', fontWeight: 500 }}>
            <span><strong>{defaultDegree}</strong> – {defaultUniversity} ({defaultEducationYears})</span>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#2563eb', fontSize: 20, fontWeight: 700, marginBottom: 8, borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>SKILLS</h3>
          <ul style={{ marginTop: 0, fontSize: 15, color: '#222', paddingLeft: 18 }}>
            {getSkillsByCategory('language') && <li><strong>Languages:</strong> {getSkillsByCategory('language')}</li>}
            {getSkillsByCategory('tool') && <li><strong>Tools:</strong> {getSkillsByCategory('tool')}</li>}
            {getSkillsByCategory('framework') && <li><strong>Frameworks:</strong> {getSkillsByCategory('framework')}</li>}
            {getSkillsByCategory('soft') && <li><strong>Soft Skills:</strong> {getSkillsByCategory('soft')}</li>}
          </ul>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#2563eb', fontSize: 20, fontWeight: 700, marginBottom: 8, borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>PROJECTS</h3>
          <ul style={{ marginTop: 0, fontSize: 15, color: '#222', paddingLeft: 18 }}>
            {data.projects.length === 0 && (
              <li><strong>Project Title</strong> – [Tech Stack]<br />[Short description]</li>
            )}
            {data.projects.map((project) => (
              <li key={project.id} style={{ marginBottom: 8 }}>
                <strong>{project.title}</strong> – {Array.isArray(project.tags) ? project.tags.join(', ') : project.tags}<br />
                <span style={{ color: '#444' }}>{project.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: '#2563eb', fontSize: 20, fontWeight: 700, marginBottom: 8, borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>EXPERIENCE</h3>
          <ul style={{ marginTop: 0, fontSize: 15, color: '#222', paddingLeft: 18 }}>
            {data.experiences.length === 0 && (
              <li><strong>Role</strong> – Company (Month Year – Month Year)<br />[Work summary]</li>
            )}
            {data.experiences.map((exp) => (
              <li key={exp.id} style={{ marginBottom: 8 }}>
                <strong>{exp.position}</strong> – {exp.organization} ({formatDate(exp.start_date)} – {formatDate(exp.end_date)})<br />
                <span style={{ color: '#444' }}>{exp.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: 0 }}>
          <h3 style={{ color: '#2563eb', fontSize: 20, fontWeight: 700, marginBottom: 8, borderBottom: '1px solid #e0e0e0', paddingBottom: 4 }}>CERTIFICATIONS</h3>
          <ul style={{ marginTop: 0, fontSize: 15, color: '#222', paddingLeft: 18 }}>
            {data.certificates.length === 0 && (
              <li>[Certificate Name] – [Provider/Year]</li>
            )}
            {data.certificates.map((cert) => (
              <li key={cert.id} style={{ marginBottom: 8 }}>
                {cert.title} – {cert.issuer}/{cert.date instanceof Date ? cert.date.getFullYear() : new Date(cert.date).getFullYear()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CVGenerator; 