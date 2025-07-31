import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Linkedin, Github, Mail, Twitter, Instagram, Facebook, Youtube, Globe, Dribbble, Slack, Twitch } from 'lucide-react';
import { FaDiscord, FaRedditAlien, FaSnapchatGhost } from 'react-icons/fa';
import { BsFillCloudFill, BsThreads } from 'react-icons/bs';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, type SocialLink } from '../context/SupabaseContext';

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={18} />,
  github: <Github size={18} />,
  mail: <Mail size={18} />,
  twitter: <Twitter size={18} />,
  x: <Twitter size={18} />,
  instagram: <Instagram size={18} />,
  facebook: <Facebook size={18} />,
  youtube: <Youtube size={18} />,
  dribbble: <Dribbble size={18} />,
  slack: <Slack size={18} />,
  twitch: <Twitch size={18} />,
  discord: <FaDiscord size={18} />,
  globe: <Globe size={18} />,
  reddit: <FaRedditAlien size={18} />,
  snapchat: <FaSnapchatGhost size={18} />,
  bluesky: <BsFillCloudFill size={18} />,
  threads: <BsThreads size={18} />,
};

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const { getSocialLinks, getAboutCached } = useSupabase();
  const year = new Date().getFullYear();
  const navigate = useNavigate();
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [footerBio, setFooterBio] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const emailLink: SocialLink = {
    id: 'email-static',
    platform: 'mail',
    url: 'mailto:afnanulhaq4@gmail.com',
    icon: 'mail',
    label: 'Email',
  };

  const allLinks = [emailLink, ...socialLinks];

  useEffect(() => {
    const fetchLinks = async () => {
      const links = await getSocialLinks();
      setSocialLinks(links);
    };
    fetchLinks();
  }, [getSocialLinks]);

  useEffect(() => {
    const fetchFooterBio = async () => {
      setLoading(true);
      try {
        const aboutData = await getAboutCached();
        if (aboutData && aboutData.footer_bio) {
          setFooterBio(aboutData.footer_bio);
        } else {
          setFooterBio('');
        }
      } catch (error) {
        setFooterBio('');
      } finally {
        setLoading(false);
      }
    };
    fetchFooterBio();
  }, [getAboutCached]);

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className={`py-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-full flex flex-col justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="footer-logo mb-4"
            />
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {loading ? '' : footerBio}
            </p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {allLinks.map((link, index) => {
                const iconKey = (link.icon?.toLowerCase() || link.platform.toLowerCase());
                if (!iconMap[iconKey]) return null;
                return (
                  <a
                    key={link.id || index} // Use index as fallback for key
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-full transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-black hover:bg-gray-200'
                    }`}
                    aria-label={link.platform || link.label}
                  >
                    {iconMap[iconKey]}
                  </a>
                );
              })}
            </div>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/about')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/portfolio')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/contact')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Get In Touch</h3>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Interested in collaboration or have questions?
            </p>
            <button 
              onClick={() => handleQuickLinkClick('/contact')}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Contact Me
            </button>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400 border-gray-800' : 'text-gray-500 border-gray-200'
          }`}>
            © {year} Afnan Ul Haq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;