document.addEventListener('DOMContentLoaded', async () => {
    const toolsList = document.getElementById('tools-list');

    async function fetchTools() {
        try {
            const response = await fetch('https://api.fewsats.com/v0/gateway/search');
            const data = await response.json();
            return data.gateways;
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
        
        row.className = 'group transition-colors duration-100';
        row.innerHTML = `
            <div class="px-4 py-3 hover:bg-notion-gray transition-colors duration-100 flex items-center justify-between cursor-pointer" 
                 onclick="this.parentElement.querySelector('.tool-details').classList.toggle('hidden')">
                <div class="flex items-center space-x-4 flex-1">
                    <div class="flex-1">
                        <h3 class="text-sm font-medium text-notion-black">${tool.name}</h3>
                    </div>
                    <div class="flex items-center space-x-3">
                        <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-notion-gray text-notion-black">
                            $${(tool.price_in_cents / 100).toFixed(2)}
                        </span>
                        <svg class="w-4 h-4 text-notion-text group-hover:text-notion-black transition-all duration-200 transform group-[.open]:-rotate-180" 
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
            <div class="tool-details hidden">
                <div class="px-4 py-3 bg-notion-gray space-y-3">
                    <p class="text-sm text-notion-text">${tool.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-xs text-notion-text flex items-center">
                            ${formatDate(tool.created_at)}
                        </span>
                        <div class="relative flex items-center">
                            <input type="text" 
                                value="${l402Uri}" 
                                class="w-96 bg-white rounded-md py-1.5 px-3 text-xs font-mono text-notion-text border border-notion-border focus:outline-none focus:ring-1 focus:ring-notion-black" 
                                readonly
                            >
                            <button 
                                class="absolute right-2 p-1 text-notion-text hover:text-notion-black transition-colors duration-100"
                                onclick="navigator.clipboard.writeText('${l402Uri}').then(() => this.classList.add('text-notion-black'))"
                                title="Copy L402 URI"
                            >
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return row;
    }

    const tools = await fetchTools();
    tools.forEach(tool => {
        toolsList.appendChild(createToolRow(tool));
    });
});
