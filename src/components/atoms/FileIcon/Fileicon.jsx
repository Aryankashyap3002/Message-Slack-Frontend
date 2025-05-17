import { 
FaCode, FaCss3Alt, FaDatabase, 
FaFile, FaFont,     FaHtml5, FaImage, FaJava, FaJs,     FaMarkdown, FaPhp, 
FaPython} from 'react-icons/fa';
import { SiDocker, SiGit,SiJson, SiTypescript, SiYaml } from 'react-icons/si';

export const FileIcon = ({ extension, className = '' }) => {
    const getIconByExtension = () => {
        switch(extension?.toLowerCase()) {
            case 'html':
                return <FaHtml5 className="text-orange-500" />;
            case 'css':
                return <FaCss3Alt className="text-blue-500" />;
            case 'js':
            case 'jsx':
                return <FaJs className="text-yellow-400" />;
            case 'ts':
            case 'tsx':
                return <SiTypescript className="text-blue-400" />;
            case 'json':
                return <SiJson className="text-yellow-300" />;
            case 'yml':
            case 'yaml':
                return <SiYaml className="text-purple-400" />;
            case 'md':
                return <FaMarkdown className="text-white" />;
            case 'py':
                return <FaPython className="text-green-400" />;
            case 'java':
                return <FaJava className="text-red-400" />;
            case 'php':
                return <FaPhp className="text-indigo-400" />;

            case 'svg':
                return <FaImage className="text-green-300" />;
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <FaImage className="text-purple-300" />;
            case 'ttf':
            case 'woff':
            case 'woff2':
            case 'eot':
                return <FaFont className="text-gray-400" />;
            case 'sql':
            case 'db':
                return <FaDatabase className="text-blue-300" />;
            case 'sh':
            case 'bash':
                return <FaCode className="text-green-500" />;
            case 'dockerfile':
                return <SiDocker className="text-blue-500" />;
            case 'gitignore':
                return <SiGit className="text-gray-500" />;
            default:
                return <FaFile className="text-gray-400" />;
        }
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            {getIconByExtension()}
        </div>
    );
};