function getFileEndingForLanguage(language) {
    switch(language) {
        case 'java': return '.java';
        case 'c': return '.c';
        case 'python': return '.py';
        case 'rust': return '.rs'
        case 'javascript': return '.js';
        case 'c++': return '.cpp';
        case 'bash': return '.sh';
        case 'go': return '.go';
        default: return null;
    }
}

module.exports = {
    getFileEndingForLanguage
}