document.addEventListener('DOMContentLoaded', function() {
    const maxTags = 5;
    let selectedTags = [];

    // Função para exibir as tags como botões
    function displayTags(tags) {
        const groupContainer = document.getElementById('group1');
        tags.forEach(tag => {
            const button = document.createElement('button');
            button.innerText = tag;
            button.className = 'tag-button';
            button.addEventListener('click', () => handleTagClick(tag, button));
            groupContainer.appendChild(button);
        });
    }

    // Função para gerenciar a seleção e deseleção de tags
    function handleTagClick(tag, button) {
        if (selectedTags.includes(tag)) {
            selectedTags = selectedTags.filter(t => t !== tag);
            button.classList.remove('selected');
        } else if (selectedTags.length < maxTags) {
            selectedTags.push(tag);
            button.classList.add('selected');
        }
    }

    // Função para buscar cidades com as tags selecionadas
    function fetchSuggestions() {
        if (selectedTags.length === 0) {
            alert("Selecione pelo menos uma tag.");
            return;
        }

        const params = new URLSearchParams();
        selectedTags.forEach(tag => params.append('tags', tag));

        fetch(`https://intuitive-strength-production.up.railway.app/api/cities/by-three-tags?${params.toString()}`)
            .then(response => response.json())
            .then(cities => {
                // Verifica se a resposta é um array e lida com múltiplas cidades
                if (Array.isArray(cities)) {
                    displaySuggestions(cities);
                } else {
                    console.error('Resposta inesperada da API:', cities);
                }
            })
            .catch(error => {
                console.error('Erro ao buscar cidades:', error);
            });
    }

    // Função para exibir as sugestões de cidades, limitando a 3 por vez
    function displaySuggestions(cities) {
        const suggestionsList = document.getElementById('suggestions-list');
        suggestionsList.innerHTML = '';

        // Limita a exibição a 3 sugestões
        const limitedCities = cities.slice(0, 3);

        limitedCities.forEach(city => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<h3>${city.name}</h3><p>${city.description}</p><p>Tags: ${city.tags.join(', ')}</p>`;
            suggestionsList.appendChild(listItem);
        });
    }

    // Adiciona um event listener para o botão de busca
    document.getElementById('fetch-cities-button').addEventListener('click', fetchSuggestions);

    // Tags disponíveis
    const availableTags = ['Histórica', 'Costeira', 'Montanhosa', 'Urbana', 'Rural', 'Cultural', 'Natureza', 'Moderna', 'Praiana', 'Aventura'];

    // Exibe as tags disponíveis inicialmente
    displayTags(availableTags);
});
