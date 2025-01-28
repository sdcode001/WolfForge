export const getFileIcon = (fileName: string | undefined): string => {
    if (!fileName) return '❓'; // Default icon for unknown files
  
    const extension = fileName.split('.').pop()?.toLowerCase();
  
    switch (extension) {
      // Web Development
      case 'html':
        return '🌐'; // HTML file
      case 'css':
        return '🎨'; // CSS file
      case 'scss':
      case 'sass':
        return '🎨'; // SASS/SCSS file
      case 'js':
        return '📜'; // JavaScript file
      case 'ts':
        return '📘'; // TypeScript file
      case 'json':
        return '📄'; // JSON file
      case 'xml':
        return '📄'; // XML file
  
      // Backend Development
      case 'py':
        return '🐍'; // Python file
      case 'java':
        return '☕'; // Java file
      case 'c':
        return '🔵'; // C file
      case 'cpp':
        return '🔵'; // C++ file
      case 'cs':
        return '💻'; // C# file
      case 'php':
        return '🐘'; // PHP file
      case 'rb':
        return '💎'; // Ruby file
      case 'go':
        return '💡'; // Go file
      case 'rs':
        return '🦀'; // Rust file
      case 'kt':
      case 'kts':
        return '🎨'; // Kotlin file
      case 'dart':
        return '🎯'; // Dart file
  
      // DevOps and Configuration Files
      case 'yaml':
      case 'yml':
        return '📋'; // YAML file
      case 'sh':
        return '🐚'; // Shell Script
      case 'bat':
        return '📄'; // Batch Script
      case 'ini':
        return '⚙️'; // INI configuration file
      case 'toml':
        return '⚙️'; // TOML configuration file
  
      // Database and Query Files
      case 'sql':
        return '🗄️'; // SQL file
      case 'db':
        return '💾'; // Database file
  
      // Markup and Documentation
      case 'md':
        return '📖'; // Markdown file
      case 'rst':
        return '📖'; // reStructuredText file
      case 'tex':
        return '📜'; // LaTeX file
  
      // Frontend Frameworks
      case 'vue':
        return '🟩'; // Vue file
      case 'jsx':
        return '⚛️'; // JSX file
      case 'tsx':
        return '⚛️'; // TSX file
      case 'svelte':
        return '🔥'; // Svelte file
      case 'astro':
        return '✨'; // Astro file
  
      // Other Code Files
      case 'pl':
        return '🐪'; // Perl file
      case 'r':
        return '📊'; // R file
      case 'swift':
        return '🍎'; // Swift file
      case 'vb':
        return '🔵'; // Visual Basic file
      case 'lua':
        return '🌙'; // Lua file
      case 'tsv':
      case 'csv':
        return '📄'; // CSV/TSV file
  
      // General Extensions
      case 'log':
        return '📜'; // Log file
      case 'txt':
        return '📄'; // Text file
  
      // Default case for unrecognized file types
      default:
        return '📄'; // Generic file icon
    }
  }