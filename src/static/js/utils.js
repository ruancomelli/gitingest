// Copy functionality
function copyText(className) {
    const textarea = document.querySelector('.' + className);
    const button = document.querySelector(`button[onclick="copyText('${className}')"]`);
    if (!textarea || !button) return;

    // Copy text
    navigator.clipboard.writeText(textarea.value)
        .then(() => {
            // Store original content
            const originalContent = button.innerHTML;

            // Change button content
            button.innerHTML = 'Copied!';

            // Reset after 1 second
            setTimeout(() => {
                button.innerHTML = originalContent;
            }, 1000);
        })
        .catch(err => {
            // Show error in button
            const originalContent = button.innerHTML;
            button.innerHTML = 'Failed to copy';
            setTimeout(() => {
                button.innerHTML = originalContent;
            }, 1000);
        });
}

function handleSubmit(event, showLoading = false) {
    event.preventDefault();
    // Get the form either from event.target or by ID if event.target is null
    const form = event.target || document.getElementById('ingestForm');
    if (!form) return;  // Guard clause in case form isn't found

    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;  // Guard clause in case button isn't found

    const originalContent = submitButton.innerHTML;
    const currentStars = document.getElementById('github-stars')?.textContent;

    if (showLoading) {
        // Change button to loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <div class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="ml-2">Processing...</span>
            </div>
        `;
        submitButton.classList.add('bg-[#ffb14d]');
    }

    // Submit the form
    fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
    })
        .then(response => response.text())
        .then(html => {
            // Store the star count before updating the DOM
            const starCount = currentStars;

            document.documentElement.innerHTML = html;

            // Wait for next tick to ensure DOM is updated
            setTimeout(() => {
                const starsElement = document.getElementById('github-stars');
                if (starsElement && starCount) {
                    starsElement.textContent = starCount;
                }

                // Scroll to results if they exist
                const resultsSection = document.querySelector('[data-results]');
                if (resultsSection) {
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 0);
        })
        .catch(error => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalContent;
        });
}

function copyFullDigest() {
    const directoryStructure = document.querySelector('.directory-structure').value;
    const filesContent = document.querySelector('.result-text').value;
    const fullDigest = `Directory Structure:\n\n${directoryStructure}\n\nFiles Content:\n\n${filesContent}`;
    const button = document.querySelector('[onclick="copyFullDigest()"]');
    const originalText = button.innerHTML;

    navigator.clipboard.writeText(fullDigest).then(() => {
        button.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Copied!
        `;

        setTimeout(() => {
            button.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

// Export functions if using modules
window.copyText = copyText;
window.handleSubmit = handleSubmit; 