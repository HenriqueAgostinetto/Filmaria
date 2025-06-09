document.addEventListener('DOMContentLoaded', function() {
    // elementos do DOM
    const filmForm = document.getElementById('film-form');
    const filmList = document.getElementById('film-list');
    const searchInput = document.getElementById('search');
    const filterGenre = document.getElementById('filter-genre');
    const favoritesOnlyBtn = document.getElementById('favorites-only');
    
    // lista de filmes
    let films = [];
    let showOnlyFavorites = false;

    // funcao para atualizar o valor do rating
    window.updateRatingValue = function(value) {
        document.getElementById('rating-value').textContent = value;
    };

    // adicionar filme com animacao
    filmForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value;
        const director = document.getElementById('director').value;
        const year = document.getElementById('year').value;
        const genre = document.getElementById('genre').value;
        const rating = document.getElementById('rating').value;
        
        const newFilm = {
            id: Date.now(),
            title,
            director,
            year,
            genre,
            rating,
            favorite: false
        };
        
        // animacao ao adicionar
        films.push(newFilm);
        renderFilmList();
        
        // efeito visual no formulario
        const submitBtn = document.querySelector('.submit-btn');
        submitBtn.classList.add('clicked');
        setTimeout(() => {
            submitBtn.classList.remove('clicked');
        }, 300);
        
        filmForm.reset();
        document.getElementById('rating-value').textContent = '3';
    });

    // renderizar lista de filmes com animacoes
    function renderFilmList() {
        const searchTerm = searchInput.value.toLowerCase();
        const genreFilter = filterGenre.value;
        
        // filtrar filmes
        let filteredFilms = films.filter(film => {
            const matchesSearch = 
                film.title.toLowerCase().includes(searchTerm) ||
                film.director.toLowerCase().includes(searchTerm) ||
                film.year.toString().includes(searchTerm);
            
            const matchesGenre = genreFilter === 'all' || film.genre === genreFilter;
            const matchesFavorites = !showOnlyFavorites || film.favorite;
            
            return matchesSearch && matchesGenre && matchesFavorites;
        });
        
        // limpar lista com fade out
        filmList.style.opacity = '0';
        setTimeout(() => {
            filmList.innerHTML = '';
            
            // adicionar filmes filtrados com fade in
            if (filteredFilms.length === 0) {
                filmList.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-film"></i>
                        <p>Nenhum filme encontrado</p>
                    </div>
                `;
            } else {
                filteredFilms.forEach((film, index) => {
                    const filmCard = createFilmCard(film, index);
                    filmList.appendChild(filmCard);
                });
            }
            
            filmList.style.opacity = '1';
        }, 300);
    }

    // criar card de filme com atraso para animação
    function createFilmCard(film, index) {
        const filmCard = document.createElement('div');
        filmCard.className = 'film-card';
        filmCard.style.animationDelay = `${index * 0.1}s`;
        filmCard.innerHTML = `
            <div class="film-poster">
                <i class="fas fa-film"></i>
            </div>
            <div class="film-content">
                <h3 class="film-title">${film.title}</h3>
                <div class="film-meta">
                    <span><strong>Diretor:</strong> ${film.director}</span>
                    <span><strong>Ano:</strong> ${film.year}</span>
                    <span><strong>Gênero:</strong> ${film.genre}</span>
                </div>
                <div class="rating-stars">
                    ${'★'.repeat(film.rating)}${'☆'.repeat(5 - film.rating)}
                </div>
                <div class="film-actions">
                    <button class="favorite-btn ${film.favorite ? 'active' : ''}" data-id="${film.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="delete-btn" data-id="${film.id}">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `;
        return filmCard;
    }

    // alternar favoritos com animação
    document.addEventListener('click', function(e) {
        if (e.target.closest('.favorite-btn')) {
            const btn = e.target.closest('.favorite-btn');
            const filmId = parseInt(btn.getAttribute('data-id'));
            const film = films.find(f => f.id === filmId);
            
            if (film) {
                film.favorite = !film.favorite;
                btn.classList.toggle('active');
                
                if (film.favorite) {
                    btn.innerHTML = '<i class="fas fa-heart"></i>';
                } else {
                    btn.innerHTML = '<i class="far fa-heart"></i>';
                }
                
                renderFilmList();
            }
        }
        
        // remover filme com confirmacao
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            btn.classList.add('deleting');
            
            setTimeout(() => {
                if (confirm('Tem certeza que deseja remover este filme?')) {
                    const filmId = parseInt(btn.getAttribute('data-id'));
                    films = films.filter(film => film.id !== filmId);
                    renderFilmList();
                } else {
                    btn.classList.remove('deleting');
                }
            }, 100);
        }
    });

    // alternar entre mostrar todos ou apenas favoritos
    favoritesOnlyBtn.addEventListener('click', function() {
        showOnlyFavorites = !showOnlyFavorites;
        this.classList.toggle('active');
        
        if (showOnlyFavorites) {
            this.innerHTML = '<i class="fas fa-heart"></i> Todos';
        } else {
            this.innerHTML = '<i class="far fa-heart"></i> Favoritos';
        }
        
        renderFilmList();
    });

    // eventos de busca e filtro
    searchInput.addEventListener('input', renderFilmList);
    filterGenre.addEventListener('change', renderFilmList);

    // carregar alguns filmes de exemplo
    function loadSampleFilms() {
        films = [
            {
                id: 1,
                title: 'Interestelar',
                director: 'Christopher Nolan',
                year: 2014,
                genre: 'Ficção Científica',
                rating: 5,
                favorite: true
            },
            {
                id: 2,
                title: 'O Poderoso Chefão',
                director: 'Francis Ford Coppola',
                year: 1972,
                genre: 'Drama',
                rating: 5,
                favorite: false
            },
            {
                id: 3,
                title: 'Parasita',
                director: 'Bong Joon-ho',
                year: 2019,
                genre: 'Drama',
                rating: 5,
                favorite: true
            },
            {
                id: 4,
                title: 'Clube da Luta',
                director: 'David Fincher',
                year: 1999,
                genre: 'Drama',
                rating: 4,
                favorite: false
            },
            {
                id: 5,
                title: 'Pulp Fiction',
                director: 'Quentin Tarantino',
                year: 1994,
                genre: 'Drama',
                rating: 5,
                favorite: false
            }
        ];
        renderFilmList();
    }

    // iniciar
    loadSampleFilms();
});