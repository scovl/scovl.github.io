// Code Escaper - Escapes Liquid syntax in code blocks
document.addEventListener('DOMContentLoaded', function() {
  // Find all code blocks
  const codeBlocks = document.querySelectorAll('pre code, div.mermaid');
  
  codeBlocks.forEach(function(codeBlock) {
    // Replace dangerous Liquid syntax with HTML entities
    let html = codeBlock.innerHTML;
    
    // Replace {{ with HTML entities
    html = html.replace(/\{\{/g, '&#123;&#123;');
    
    // Replace }} with HTML entities  
    html = html.replace(/\}\}/g, '&#125;&#125;');
    
    // Replace {% with HTML entities
    html = html.replace(/\{%/g, '&#123;&#37;');
    
    // Replace %} with HTML entities
    html = html.replace(/%\}/g, '&#37;&#125;');
    
    // Update code block with escaped HTML
    codeBlock.innerHTML = html;
  });
  
  // Initialize syntax highlighting if Prism is available
  if (typeof Prism !== 'undefined') {
    Prism.highlightAll();
  }
  
  // Initialize Mermaid diagrams if Mermaid is available
  if (typeof mermaid !== 'undefined') {
    mermaid.init(undefined, document.querySelectorAll('.mermaid'));
  }
}); 