/**
 * Simple JavaScript for the Scovl theme
 */
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle (if needed in the future)
    // const navToggle = document.querySelector('.nav-toggle');
    // if (navToggle) {
    //     navToggle.addEventListener('click', function() {
    //         document.querySelector('.site-nav').classList.toggle('active');
    //     });
    // }

    // Add 'external-link' class to all external links
    document.querySelectorAll('a').forEach(function(link) {
        if (link.hostname !== window.location.hostname && link.hostname !== '') {
            link.classList.add('external-link');
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Fix code blocks for code fences (```java, ```javascript, etc)
    document.querySelectorAll('pre > code').forEach(function(codeBlock) {
        const pre = codeBlock.parentNode;
        
        // Skip if parent is already wrapped
        if (pre.parentNode.classList.contains('highlight')) {
            // Make sure the language class is correctly applied to the wrapper
            if (codeBlock.className) {
                const langRegex = /language-(\w+)/;
                const match = langRegex.exec(codeBlock.className);
                if (match) {
                    const lang = match[1];
                    const langClass = 'language-' + lang;
                    pre.parentNode.classList.add(langClass);
                    pre.parentNode.setAttribute('data-lang', lang);
                }
            }
            return;
        }
        
        // Detect language from class
        let lang = '';
        let langClass = '';
        if (codeBlock.className) {
            const langRegex = /language-(\w+)/;
            const match = langRegex.exec(codeBlock.className);
            if (match) {
                lang = match[1];
                langClass = 'language-' + lang;
            }
        }
        
        // Create wrapper structure
        const wrapper = document.createElement('div');
        wrapper.className = 'highlight';
        if (langClass) {
            wrapper.classList.add(langClass);
        }
        if (lang) {
            wrapper.setAttribute('data-lang', lang);
        }
        
        // Ensure pre has the language class
        if (langClass && !pre.classList.contains(langClass)) {
            pre.classList.add(langClass);
        }
        
        // Wrap the pre with our highlight div
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(pre);
    });
    
    // Fix highlight divs that might be missing data-lang
    document.querySelectorAll('div.highlight').forEach(function(highlightDiv) {
        if (!highlightDiv.hasAttribute('data-lang')) {
            let langClass = '';
            Array.from(highlightDiv.classList).forEach(function(cl) {
                if (cl.startsWith('language-')) {
                    langClass = cl;
                    const lang = cl.replace('language-', '');
                    highlightDiv.setAttribute('data-lang', lang);
                }
            });
            
            // If still no language class, check children
            if (!langClass) {
                const pre = highlightDiv.querySelector('pre');
                const code = highlightDiv.querySelector('code');
                
                if (pre) {
                    Array.from(pre.classList).forEach(function(cl) {
                        if (cl.startsWith('language-')) {
                            langClass = cl;
                            highlightDiv.classList.add(cl);
                            const lang = cl.replace('language-', '');
                            highlightDiv.setAttribute('data-lang', lang);
                        }
                    });
                }
                
                if (!langClass && code) {
                    Array.from(code.classList).forEach(function(cl) {
                        if (cl.startsWith('language-')) {
                            langClass = cl;
                            highlightDiv.classList.add(cl);
                            pre && pre.classList.add(cl);
                            const lang = cl.replace('language-', '');
                            highlightDiv.setAttribute('data-lang', lang);
                        }
                    });
                }
            }
        }
    });

    // Process images
    document.querySelectorAll('.post-content img').forEach(function(img) {
        // Check if image is not already in a figure
        if (img.parentNode.tagName !== 'FIGURE') {
            // Create figure element
            const figure = document.createElement('figure');
            
            // Clone image and append to figure
            const imgClone = img.cloneNode(true);
            figure.appendChild(imgClone);
            
            // Add caption if available from alt text
            if (img.alt) {
                const caption = document.createElement('figcaption');
                caption.textContent = img.alt;
                figure.appendChild(caption);
            }
            
            // Replace image with figure
            img.parentNode.replaceChild(figure, img);
        }
    });
}); 