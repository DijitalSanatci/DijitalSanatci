let currentPage = 0;
const videosPerPage = 8;
const loadingElement = document.getElementById('loading');

function loadVideos() {
    loadingElement.style.display = 'block';

    fetch('list_video.json')
        .then(response => response.json())
        .then(data => {
            const videoContainer = document.getElementById('videoContainer');
            const videos = data.videos;
            const start = currentPage * videosPerPage;
            const end = start + videosPerPage;

            if (start >= videos.length) {
                loadingElement.style.display = 'none'; 
                return; 
            }

            videos.slice(start, end).forEach(video => {
                const videoWrapper = document.createElement('div');
                videoWrapper.classList.add('video-wrapper');

                const videoElement = document.createElement('video');
                videoElement.setAttribute('data-src', video.url);
                videoElement.controls = true;

                const titleElement = document.createElement('p');
                titleElement.innerText = video.title;

                videoWrapper.appendChild(videoElement);
                videoWrapper.appendChild(titleElement);
                videoContainer.appendChild(videoWrapper);

                // Observer ayarları
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const video = entry.target;
                            video.src = video.getAttribute('data-src'); 
                            observer.unobserve(video); 
                        }
                    });
                });

                observer.observe(videoElement);
            });

            currentPage++;
            loadingElement.style.display = 'none';
        })
        .catch(error => console.error('Hata:', error));
}

loadVideos();

window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.body.offsetHeight * 0.85;

    if (scrollPosition >= threshold) {
        loadVideos();
    }
});
