let curriculoData;

// Load JSON data first
$.getJSON('./data.json', function(data) {
    curriculoData = data;
    initializeApp();
}).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Failed to load data:', textStatus, errorThrown);
});

function initializeApp() {
    // Renderização dos templates com os dados do currículo
    function renderTemplates() {
        if (!curriculoData.ERRO) {
            // Seção de Experiência Profissional
            const experienceHtml = Mustache.render(
                $('#experience-template').html(),
                { items: curriculoData.DADOS.experience.items }
            );
            $('#experience-container').html(experienceHtml);

            // Seção de Formação / Certificações
            const certificatesHtml = Mustache.render(
                $('#certificates-template').html(),
                { items: curriculoData.DADOS.certificates.items }
            );
            $('#certificates-container').html(certificatesHtml);

            // Seção de Recomendações
            const recommendationsHtml = Mustache.render(
                $('#recommendations-template').html(),
                { items: curriculoData.DADOS.recommendations.items }
            );
            $('#recommendations-container').html(recommendationsHtml);

            // Seção de Projetos / Portfólio
            const portfolioHtml = Mustache.render(
                $('#portfolio-template').html(),
                { items: curriculoData.DADOS.portfolio.items }
            );
            $('#portfolio-container').html(portfolioHtml);
        } else {
            console.error(curriculoData.MENSAGEM);
        }
    }

    // Renderiza os templates antes de inicializar as animações
    renderTemplates();

    // Inicializar a animação GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Animação de entrada para a seção Hero
    gsap.to(".hero-content", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3
    });

    // Animação para seções ao scrollar
    gsap.utils.toArray("section:not(.hero)").forEach(section => {
        gsap.fromTo(section,
           { opacity: 0, y: 50 }, // Estado inicial (from)
           {                  // Estado final (to)
            scrollTrigger: {
                trigger: section,
                start: "top 85%", // Quando o topo da seção atinge 85% da altura da viewport
                end: "bottom 20%", // Opcional: define um fim para a animação/trigger
                // toggleActions: "play none none none", // Ação padrão: anima ao entrar
                once: true // Anima apenas uma vez
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Animação para itens da timeline
    function animateTimelineItems() {
        const items = gsap.utils.toArray(".timeline-item");
        const isMobile = window.innerWidth <= 1024; // Verifica se é a visão de timeline linear

        items.forEach((item, i) => {
            const initialX = isMobile ? -30 : (i % 2 === 0 ? 30 : -30); // Define X inicial baseado na posição par/impar ou mobile

             gsap.fromTo(item,
               { opacity: 0, x: initialX }, // Estado inicial
               {                  // Estado final
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    once: true
                },
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: "back.out(1.2)",
                delay: 0.1 // Delay menor pode parecer mais fluido
            });
        });
    }
    animateTimelineItems(); // Executa na carga inicial

    // Re-executa animação da timeline se a janela for redimensionada e cruzar o breakpoint
    let cachedWidth = window.innerWidth;
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        if ((cachedWidth <= 1024 && newWidth > 1024) || (cachedWidth > 1024 && newWidth <= 1024)) {
             // Limpa triggers antigos para evitar conflitos (opcional mas recomendado)
             ScrollTrigger.getAll().forEach(trigger => trigger.kill());
             // Re-executa as animações com as novas condições
             animateTimelineItems();
             // Poderia re-executar outras animações baseadas em tela aqui se necessário
        }
        cachedWidth = newWidth;
    });


    // Animação para cartões de certificados
    gsap.utils.toArray(".certificate-card").forEach((card, i) => {
        gsap.fromTo(card,
           { opacity: 0, y: 30 },
           {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: i * 0.1 // Delay escalonado
        });
    });

    // Animação para recomendações - Animar o slider inteiro ao entrar na viewport
     gsap.fromTo("#recommendations .recommendations-slider",
           { opacity: 0, scale: 0.95 },
           {
            scrollTrigger: {
                trigger: "#recommendations",
                start: "top 80%",
                once: true
            },
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.7)"
           }
     );


    // Animação para projetos do portfólio
    gsap.utils.toArray(".portfolio-item").forEach((item, i) => {
        gsap.fromTo(item,
           { opacity: 0, y: 30 },
           {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                once: true
            },
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            delay: i * 0.1 // Delay escalonado
        });
    });

    // Header compacto ao scrollar
    $(window).scroll(function() {
        if($(this).scrollTop() > 50) {
            $("#header").addClass("scrolled");
        } else {
            $("#header").removeClass("scrolled");
        }

        // Mostrar/ocultar botão Voltar ao Topo
        if($(this).scrollTop() > 300) {
            $("#backToTop").addClass("visible");
        } else {
            $("#backToTop").removeClass("visible");
        }
    });

    // Navegação suave ao clicar nos links do menu e CTA
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();

        var targetSelector = this.getAttribute('href');
        var targetElement = $(targetSelector);

        // Fechar menu mobile ao clicar (se estiver ativo)
        if ($("#menu-toggle").hasClass("active")) {
             $("#menu-toggle").removeClass("active");
             $("#nav-menu").removeClass("active");
        }


        if(targetElement.length) {
            // Calcula o offset do header dinamicamente
            var headerHeight = $("#header").outerHeight() || 80; // Pega altura atual ou fallback
            var offsetTop = targetElement.offset().top - headerHeight;

            $('html, body').stop().animate({ // Usa .stop() para evitar animações acumuladas
                scrollTop: offsetTop
            }, 800, 'swing'); // Pode usar 'linear' ou 'swing'
        }
    });

    // Toggle menu mobile
    $("#menu-toggle").on('click', function() {
        $(this).toggleClass("active");
        $("#nav-menu").toggleClass("active");
        // Opcional: impedir scroll do body quando menu está aberto
        // $('body').toggleClass('no-scroll', $(this).hasClass('active'));
    });

    // Slider de recomendações
    const initRecommendationsSlider = () => {
        var currentSlide = 0;
        var $slideContainer = $(".recommendations-container");
        var $slides = $(".recommendation-card");
        var slideCount = $slides.length;
        var slideWidth = 100; // em percentagem
        var autoSlideInterval;

        function goToSlide(index) {
            if(index >= slideCount) index = 0; // Volta para o primeiro
            if(index < 0) index = slideCount - 1; // Vai para o último

            currentSlide = index;
            // Usando GSAP para a transição do slider para melhor controle e suavidade
            gsap.to($slideContainer, {
                 duration: 0.5, // Duração da animação
                 xPercent: -slideWidth * currentSlide, // Move pelo percentual
                 ease: "power2.inOut" // Easing
            });

            // Atualiza os dots
            $(".slider-dot").removeClass("active");
            $(`.slider-dot[data-index="${currentSlide}"]`).addClass("active");
        }

         function startAutoSlide() {
            // Limpa intervalo anterior para evitar múltiplos timers
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(function() {
                goToSlide(currentSlide + 1);
            }, 7000); // Intervalo de 7 segundos
        }

        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }

        // Inicializa o slider e o autoslide
        if (slideCount > 1) { // Só ativa se houver mais de um slide
            // Adiciona os dots dinamicamente se não existirem
            if ($(".slider-controls .slider-dot").length === 0) {
                const $controls = $(".slider-controls");
                for (let i = 0; i < slideCount; i++) {
                    $controls.append(`<div class="slider-dot" data-index="${i}"></div>`);
                }
                 // Adiciona classe 'active' ao primeiro dot criado
                $controls.find('.slider-dot').first().addClass('active');
            } else {
                 // Garante que o primeiro dot está ativo se já existirem
                 $(".slider-dot").removeClass("active").first().addClass("active");
            }


            // Event listener para os dots
            $(".slider-dot").on('click', function() {
                stopAutoSlide(); // Para o autoslide ao clicar manualmente
                var index = $(this).data('index');
                goToSlide(index);
                startAutoSlide(); // Reinicia o autoslide após interação manual
            });

             // Pausa no hover (opcional)
            $(".recommendations-slider").hover(stopAutoSlide, startAutoSlide);

            startAutoSlide(); // Inicia o autoslide
        }
    };

    // Inicializa o slider após renderizar os templates
    initRecommendationsSlider();

    // Botão Voltar ao Topo
    $("#backToTop").on('click', function() {
        $('html, body').stop().animate({
            scrollTop: 0
        }, 800, 'swing');
    });

    // Lazy loading para imagens - Usando Intersection Observer nativo
    // Apenas imagens que não sejam as do slider de recomendações inicialmente
     document.addEventListener("DOMContentLoaded", function() {
        var lazyImages = [].slice.call(document.querySelectorAll("img:not(.recommendation-card img):not(.author-avatar img)")); // Seleciona imagens para lazy load

        if ("IntersectionObserver" in window) {
            let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        let lazyImage = entry.target;
                        // Usa data-src se existir, senão o src atual (para placeholders)
                        if (lazyImage.dataset.src) {
                           lazyImage.src = lazyImage.dataset.src;
                           lazyImage.removeAttribute('data-src'); // Remove o atributo após carregar
                        }
                        // Opcional: Adicionar classe para fade-in após carregar
                        lazyImage.classList.add('loaded');
                        observer.unobserve(lazyImage); // Para de observar a imagem carregada
                    }
                });
            }, {
               rootMargin: "0px 0px 100px 0px" // Carrega um pouco antes de entrar na viewport
            });

            lazyImages.forEach(function(lazyImage) {
                lazyImageObserver.observe(lazyImage);
            });
        } else {
            // Fallback para navegadores sem IntersectionObserver
            lazyImages.forEach(function(lazyImage) {
                 if (lazyImage.dataset.src) {
                    lazyImage.src = lazyImage.dataset.src;
                 }
            });
        }
    });
}