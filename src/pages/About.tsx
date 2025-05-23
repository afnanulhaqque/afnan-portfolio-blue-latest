import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Award, BookOpen, ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import SkillBar from '../components/SkillBar';
import { useSupabase, Skill } from '../context/SupabaseContext';

const About: React.FC = () => {
  const { theme } = useTheme();
  const { getSkills } = useSupabase();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skillCategories, setSkillCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);
        
        // Extract unique categories
        const categories = ['all', ...new Set(skillsData.map(skill => skill.category))];
        setSkillCategories(categories);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching skills:', error);
        setLoading(false);
      }
    };
    
    fetchSkills();
  }, [getSkills]);
  
  // Filter skills by category
  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);
  
  return (
    <div className="pt-20">
      {/* About Section */}
      <section className="mb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>About </span>
          <span className="text-blue-600">Me</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Afnan Ul Haq"
                className="w-full h-auto rounded-lg shadow-lg mb-6"
              />
              
              <div className={`p-6 rounded-lg ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <h3 className="text-xl font-semibold mb-4">Personal Info</h3>
                <ul className="space-y-3">
                  <li className="flex flex-col">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Name</span>
                    <span className="font-medium">Afnan Ul Haq</span>
                  </li>
                  <li className="flex flex-col">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Study</span>
                    <span className="font-medium">BS Information Technology</span>
                  </li>
                  <li className="flex flex-col">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Institution</span>
                    <span className="font-medium">International Islamic University Islamabad</span>
                  </li>
                  <li className="flex flex-col">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Email</span>
                    <a href="mailto:afnanulhaq4@gmail.com" className="text-blue-600 hover:underline">afnanulhaq4@gmail.com</a>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Who am I?</h2>
              
              <div className="space-y-4 mb-8">
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  I'm a passionate and driven undergraduate student pursuing a Bachelor of Science in Information Technology at the International Islamic University Islamabad (IIUI). With a strong inclination toward technology, media, and community engagement, I've built a diverse portfolio of experience across various domains.
                </p>
                
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  I currently serve as the PR Lead at BlackBox AI – IIUI, where I oversee communication strategies and public relations initiatives. Previously, I held notable roles such as Content Creator, Media Team Lead, and Social Media Strategist at The Computer Science Society – IIUI, and Operational Lead at Microsoft Learn Student Club – IIUI Chapter.
                </p>
                
                <p className={`leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  I've also contributed to the Hult Prize – IIUI Chapter as its Marketing and Media Lead, co-founder, and Media Team Lead. I'm recognized as an ambassador for multiple prestigious tech platforms and events, including DevCon 25 by Software Society MCS, Connected Pakistan, Air Nexus 25, Tech Fest Gala, and Global Youth Movement Pakistan.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center mb-4">
                    <Award size={24} className="text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold">Certifications</h3>
                  </div>
                  <ul className={`list-disc list-inside space-y-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    <li>Full Stack Web Development</li>
                    <li>Linux (Advanced Commands)</li>
                    <li>Introduction to Databases</li>
                    <li>Social Media Marketing (HP LIFE)</li>
                    <li>Python Programming</li>
                  </ul>
                </div>
                <div className={`p-6 rounded-lg ${
                  theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center mb-4">
                    <BookOpen size={24} className="text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold">Education</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">BS Information Technology</h4>
                      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                        International Islamic University Islamabad
                      </p>
                      <p className="text-sm text-blue-600">2021 - Present</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Link
                  to="/experience"
                  className={`inline-flex items-center px-4 py-2 rounded-md transition-colors duration-300 ${
                    theme === 'dark'
                      ? 'bg-gray-800 text-white hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  View Experience
                  <ExternalLink size={16} className="ml-2" />
                </Link>
                
                <Link
                  to="/contact"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Contact Me
                  <ExternalLink size={16} className="ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>My </span>
          <span className="text-blue-600">Skills</span>
        </h2>
        
        {loading ? (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Loading skills...
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-8">
              {skillCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {filteredSkills.map((skill, index) => (
                <SkillBar key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default About;