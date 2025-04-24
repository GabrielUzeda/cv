function handlePieceDrop(target, draggable) {
    return new Promise((resolve) => {
        // Animações paralelas para melhor performance
        draggable.animate({ opacity: 0 }, 300);
        target.find('span').fadeOut(300);

        // Usa apenas um setTimeout para reduzir overhead
        setTimeout(() => {
            // Remove classes e define propriedades de uma só vez
            target
                .removeClass('empty-spot droppable ui-droppable')
                .html('<div class="texto-gradiente">U</div>')
                .addClass('puzzle-piece rounded-sm')
                .css({
                    'background-color': 'transparent',
                    'border': 'none',
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center'
                });

            // Segundo setTimeout com a animação de conclusão
            setTimeout(() => {
                $('#instrucao').animate({ opacity: 0, height: 0, margin: 0, padding: 0 }, 300, function() {
                    $(this).fadeOut();
                });                $('.puzzle-container').addClass("completion-animation");
                setTimeout(resolve, 3000);
            }, 300);
        }, 300);
    });
}

function handleLogo() {
    // Cache de elementos e cálculos de posição
    const $target = $("#target");
    const targetPosition = $target.offset();
    const targetWidth = $target.outerWidth();
    const targetHeight = $target.outerHeight();
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    
    // Ajusta tamanho baseado em tela pequena
    const isSmallScreen = windowWidth < 480;
    const isMediumScreen = windowWidth >= 480 && windowWidth < 768;
    
    // Assegura que as letras não ultrapassem a largura da tela
    // Tamanho de cada letra + espaçamento
    let letterSize = targetWidth;
    let spacing = isSmallScreen ? 2 : 5;
    
    // Verifica se o conjunto de letras ultrapassa a largura da tela
    const totalLetters = 5; // U + ZEDA
    const minLetterSize = Math.min(letterSize, (windowWidth * 0.9) / totalLetters);
    
    // Ajusta o tamanho se necessário para caber na tela
    if (minLetterSize < letterSize) {
        letterSize = minLetterSize;
    }
    
    // Recalcula a largura total com o novo tamanho
    const totalWidth = letterSize * 5 + (spacing * 4);
    const finalX = Math.max(0, (windowWidth - totalWidth) / 2);
    let posY = targetPosition.top;
    
    // Ajusta posição vertical em telas pequenas
    if (windowHeight < 600) {
        posY = windowHeight * 0.3;
    }

    // Animações agrupadas para melhor performance
    $(".puzzle-piece:not(#target)").animate({ opacity: 0 }, 300);
    $(".puzzle-container")
        .animate({ backgroundColor: '#f5f6fa' }, 300)
        .removeClass("shadow-lg");

    // Criar clone da letra U
    const clone = $("<div></div>")
        .text("U")
        .addClass("texto-gradiente rounded-sm p-2 font-bold text-center")
        .addClass(isSmallScreen ? "text-4xl" : isMediumScreen ? "text-5xl" : "text-6xl")
        .css({
            width: letterSize,
            height: letterSize,
            position: "absolute",
            top: targetPosition.top,
            left: targetPosition.left,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(45deg, #4776E6 0%, #8E54E9 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
        })
        .appendTo("body");

    // Remover container principal
    $("#main-container").fadeOut(300, function () { $(this).remove(); });

    // Gradientes alternados para cada letra
    const gradientes = [
        'linear-gradient(45deg, #8E54E9 0%, #4776E6 100%)',
        'linear-gradient(45deg, #4776E6 0%, #8E54E9 50%, #4776E6 100%)',
        'linear-gradient(45deg, #8E54E9 50%, #4776E6 100%)',
        'linear-gradient(45deg, #4776E6 25%, #8E54E9 75%)'
    ];

    // Animar movimento com callback único
    clone.animate({ left: finalX, top: posY }, 300, function () {
        // Criar todas as letras com um único loop
        const letras = ['Z', 'E', 'D', 'A'];

        letras.forEach((letra, index) => {
            // Criar elemento letra de uma só vez com todas as propriedades
            $("<div></div>")
                .text(letra)
                .addClass("texto-gradiente rounded-sm p-2 font-bold text-center")
                .addClass(isSmallScreen ? "text-4xl" : isMediumScreen ? "text-5xl" : "text-6xl")
                .css({
                    width: letterSize,
                    height: letterSize,
                    position: "absolute",
                    top: posY,
                    left: finalX + letterSize * (index + 1) + (spacing * (index + 1)),
                    lineHeight: `${letterSize}px`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: gradientes[index],
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    opacity: 0
                })
                .appendTo("body")
                // Usa delay do jQuery em vez de setTimeout para melhor performance
                .delay(index * 100)
                .animate({ opacity: 1 }, 300);
        });

        // Adicionar subtítulo com um único delay e ajuste para telas pequenas
        const subtitleClass = isSmallScreen ? "w-4/5" : "w-auto";
        const subtitleTop = posY + letterSize + (isSmallScreen ? 10 : 20);
        const subtitleStyles = {
            position: "absolute",
            top: subtitleTop,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: isSmallScreen ? "normal" : "nowrap",
            textAlign: "center",
            width: isSmallScreen ? "90%" : "auto",
            opacity: 0,
            maxWidth: "95vw"
        };
        
        $("<div></div>")
            .text("A peça que faltava na sua empresa")
            .addClass(`subtitulo-gradiente ${subtitleClass}`)
            .css(subtitleStyles)
            .appendTo("body")
            .delay(letras.length * 100 + 400)
            .animate({ opacity: 1 }, 800);
    });

    setTimeout(() => {
        $('.texto-gradiente, .subtitulo-gradiente').fadeOut(() => {
            window.location.href = '/pages/home.html';
        });
    }, 4000);
}

// Função para recalcular tamanhos baseado na tela
function recalculateSize() {
    const windowWidth = $(window).width();
    const windowHeight = $(window).height();
    
    // Determina o tamanho ideal baseado no menor valor entre largura e altura
    const minDimension = Math.min(windowWidth, windowHeight);
    
    // Ajusta o tamanho do quebra-cabeça dinamicamente
    let puzzleSize;
    if (windowWidth < 480) {
        puzzleSize = Math.min(windowWidth * 0.8, 260);
    } else if (windowWidth < 768) {
        puzzleSize = Math.min(windowWidth * 0.7, 320);
    } else if (windowWidth < 1024) {
        puzzleSize = Math.min(windowWidth * 0.5, 380);
    } else {
        puzzleSize = Math.min(windowWidth * 0.4, 420);
    }
    
    // Restringe altura máxima em telas baixas
    if (windowHeight < 700 && puzzleSize > windowHeight * 0.6) {
        puzzleSize = windowHeight * 0.6;
    }
    
    // Limita para não ultrapassar 95% da largura da tela
    puzzleSize = Math.min(puzzleSize, windowWidth * 0.95);
    
    // Aplica as dimensões calculadas
    $('.puzzle-container').css({
        width: puzzleSize + 'px',
        height: puzzleSize + 'px'
    });
    
    // Ajusta o tamanho da peça arrastável
    const dragSize = Math.min(puzzleSize / 4, windowWidth * 0.2);
    $('#draggable').css({
        width: dragSize + 'px',
        height: dragSize + 'px'
    });
}

$(function () {

    // Mostra o container principal
    $('#main-container').fadeIn();
    
    // Calcula o tamanho inicial
    recalculateSize();
    
    // Recalcula ao redimensionar a janela
    $(window).on('resize', recalculateSize);
    
    // Cache de elementos DOM frequentemente usados
    const $draggable = $("#draggable");
    const $target = $("#target");

    // Inicializa elemento arrastável com todas as opções juntas
    $draggable.draggable({
        revert: "invalid",
        cursor: "move",
        snap: "#target",
        snapMode: "inner",
        snapTolerance: 20,
        start: function () { $(this).css("z-index", 1000); }
    });

    // Inicializa área soltável 
    $target.droppable({
        accept: "#draggable",
        drop: function (event, ui) {
            handlePieceDrop($(this), $(ui.draggable))
                .then(() => {
                    console.log("Peça encaixada com sucesso!");
                    handleLogo();
                })
                .catch(error => console.error("Erro ao encaixar a peça:", error));
        }
    });
});
