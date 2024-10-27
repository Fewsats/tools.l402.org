document.addEventListener('DOMContentLoaded', async () => {
    const toolsList = document.getElementById('tools-list');

    async function fetchTools() {
        try {
            const response = await fetch('https://api.fewsats.com/v0/gateway/search');
            const data = await response.json();
            return data.gateways.filter(tool => tool.status === 'valid');
        } catch (error) {
            console.error('Error fetching tools:', error);
            return [];
        }
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    function createToolRow(tool) {
        const row = document.createElement('div');
        const l402Uri = `l402://api.fewsats.com/v0/gateway/${tool.external_id}/info`;
        
        row.className = 'bg-white rounded-lg border border-notion-border hover:bg-notion-hover transition-colors duration-100';
        row.innerHTML = `
            <div class="aspect-[1.5] w-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-t-lg overflow-hidden">
                <div class="w-full h-full flex items-center justify-center p-6">
                    <svg class="w-full h-full" viewBox="0 0 240 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="70" y="20" width="100" height="120" rx="8" fill="#E2E8F0"/>
                        <rect x="82" y="32" width="76" height="76" rx="4" fill="#93C5FD"/>
                        <circle cx="120" cy="70" r="24" fill="#3B82F6"/>
                        <path d="M110 70h20M120 60v20" stroke="white" stroke-width="2" stroke-linecap="round"/>
                        <rect x="82" y="116" width="76" height="12" rx="2" fill="#93C5FD"/>
                        <circle cx="120" cy="122" r="3" fill="#3B82F6"/>
                        <path d="M40 40c40-20 120-20 160 0M40 120c40 20 120 20 160 0" stroke="#CBD5E1" stroke-width="2"/>
                    </svg>
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-sm font-medium text-notion-black mb-2">${tool.name}</h3>
                <p class="text-xs text-notion-text line-clamp-2 mb-3">${tool.description}</p>
                <div class="flex items-center justify-between">
                    <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-notion-gray text-notion-black">
                        $${(tool.price_in_cents / 100).toFixed(2)}
                    </span>
                    <button 
                        class="p-1 text-notion-text hover:text-notion-black transition-colors duration-100 copy-button"
                        data-l402-uri="${l402Uri}"
                        title="Copy L402 URI"
                    >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        return row;
    }

    function initializeCopyButtons() {
        document.querySelectorAll('.copy-button').forEach(button => {
            // Initialize tooltip
            tippy(button, {
                content: 'Copy L402 URI',
                animation: 'shift-away',
                theme: 'notion'
            });

            // Add click handler
            button.addEventListener('click', async () => {
                const uri = button.dataset.l402Uri;
                await navigator.clipboard.writeText(uri);
                
                // Show success notification
                Swal.fire({
                    title: 'Copied!',
                    text: 'L402 URI has been copied to clipboard',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    customClass: {
                        popup: 'font-notion',
                        title: 'text-notion-black',
                        content: 'text-notion-text'
                    }
                });
            });
        });
    }

    const tools = await fetchTools();
    tools.forEach(tool => {
        toolsList.appendChild(createToolRow(tool));
    });
    initializeCopyButtons();
});
