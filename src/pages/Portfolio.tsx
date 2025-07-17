import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ProjectCard from '../components/ProjectCard';
import { useSupabase, Project } from '../context/SupabaseContext';
import Loader from '../components/Loader';

const Portfolio: React.FC = () => {
  const { theme } = useTheme();
  const { getProjects } = useSupabase();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects();
        setProjects(projectsData);
        setFilteredProjects(projectsData);
        
        // Extract unique tags
        const allTags = projectsData.flatMap(project => project.tags);
        const uniqueTags = ['all', ...new Set(allTags)];
        setTags(uniqueTags);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [getProjects]);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => 
        project.tags.includes(filter)
      );
      setFilteredProjects(filtered);
    }
  }, [filter, projects]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>My </span>
        <span className="text-blue-600">Portfolio</span>
      </h1>
      
      <div className="flex flex-wrap gap-2 mb-12">
        {tags.map((tag, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(tag)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              filter === tag
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </motion.button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))
        ) : (
          <div className={`col-span-full text-center py-12 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No projects found with the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;