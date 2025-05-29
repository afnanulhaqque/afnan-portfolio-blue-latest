import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Loader } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import SkillBar from '../components/SkillBar';
import { useSupabase, Skill } from '../context/SupabaseContext';

interface AboutSection {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ProfilePicture {
  id: string;
  image_url: string;
  created_at: string;
}

// Cache for storing fetched data
const dataCache = {
  about: null as AboutSection | null,
  profile: null as ProfilePicture | null,
  skills: null as Skill[] | null,
  lastFetched: 0,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

const About: React.FC = () => {
  const { theme } = useTheme();
  const { getSkills, supabase } = useSupabase();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [skillCategories, setSkillCategories] = useState<string[]>([]);
  const [aboutSection, setAboutSection] = useState<AboutSection | null>(null);
  const [profilePicture, setProfilePicture] = useState<ProfilePicture | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);

  // Fetch about section and profile picture
  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Fetch about section content
        const { data: aboutData, error: aboutError } = await supabase
          .from('about_section')
          .select('*')
          .single();

        if (aboutError) {
          console.error('Error fetching about section:', aboutError);
          throw aboutError;
        }

        if (aboutData) {
          setAboutSection(aboutData);
        }

        // Fetch profile picture
        const { data: profileData, error: profileError } = await supabase
          .from('profile_picture')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (profileError) {
          console.error('Error fetching profile picture:', profileError);
          throw profileError;
        }

        console.log('Profile picture data:', profileData);

        if (profileData && profileData.length > 0) {
          const pictureData = profileData[0];
          // Ensure the image URL is properly formatted
          const imageUrl = pictureData.image_url?.startsWith('http') 
            ? pictureData.image_url 
            : `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/${pictureData.image_url}`;
          
          setProfilePicture({
            ...pictureData,
            image_url: imageUrl
          });
        } else {
          console.error('No profile picture data found');
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [supabase]);

  // Fetch skills separately
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);
        
        // Extract unique categories
        const categories = ['all', ...new Set(skillsData.map(skill => skill.category))];
        setSkillCategories(categories);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setSkillsLoading(false);
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Left Column - Profile Picture and Personal Info */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center md:items-start"
            >
              {contentLoading ? (
                <div className={`w-full max-w-[250px] h-[250px] rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                } flex items-center justify-center`}>
                  <Loader size={24} className="animate-spin text-blue-600" />
                </div>
              ) : profilePicture?.image_url ? (
                <div className="mb-6 flex justify-center md:justify-start">
                  <img
                    src={profilePicture.image_url}
                    alt="Afnan Ul Haq"
                    className="w-[250px] h-[250px] object-cover rounded-lg shadow-lg"
                    loading="eager"
                    onError={(e) => {
                      console.error('Error loading image:', e);
                      e.currentTarget.src = 'https://via.placeholder.com/250x250?text=Profile+Picture';
                    }}
                  />
                </div>
              ) : (
                <div className={`w-full max-w-[250px] h-[250px] rounded-lg ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                } flex items-center justify-center`}>
                  <p className="text-gray-500">No profile picture available</p>
                </div>
              )}
              
              <div className={`p-6 rounded-lg w-full ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              }`}>
                <h3 className="text-xl font-semibold mb-4 text-center md:text-left">Personal Info</h3>
                <ul className="space-y-3">
                  <li className="flex flex-col items-center md:items-start">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Name</span>
                    <span className="font-medium">Afnan Ul Haq</span>
                  </li>
                  <li className="flex flex-col items-center md:items-start">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Study</span>
                    <span className="font-medium">BS Information Technology</span>
                  </li>
                  <li className="flex flex-col items-center md:items-start">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Institution</span>
                    <span className="font-medium">International Islamic University Islamabad</span>
                  </li>
                  <li className="flex flex-col items-center md:items-start">
                    <span className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>Email</span>
                    <a href="mailto:afnanulhaq4@gmail.com" className="text-blue-600 hover:underline">afnanulhaq4@gmail.com</a>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - About Me */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Who am I?</h2>
              
              {contentLoading ? (
                <div className="space-y-4 mb-8">
                  <div className={`h-4 rounded ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  } animate-pulse`}></div>
                  <div className={`h-4 rounded ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  } animate-pulse`}></div>
                  <div className={`h-4 rounded ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                  } animate-pulse`}></div>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {aboutSection?.content.split('\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className={`leading-relaxed ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              
              <div className="flex gap-4">
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
        
        {skillsLoading ? (
          <div className="space-y-4">
            <div className={`h-4 rounded ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            } animate-pulse`}></div>
            <div className={`h-4 rounded ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            } animate-pulse`}></div>
            <div className={`h-4 rounded ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
            } animate-pulse`}></div>
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
            
            <div className={`grid gap-x-12 gap-y-4 ${
              selectedCategory === 'all' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'
            }`}>
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