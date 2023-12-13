#target premierepro

(function() {
    
    var project = app.project;
    // Verifique se há pelo menos um projeto aberto
    if (!project) {
        alert("Nenhum projeto está aberto.");
        return;
    }

    // Acessa a sequência ativa
    var sequence = project.activeSequence;
    if (!sequence) {
        alert("Nenhuma sequência está ativa.");
        return;
    }

    // Recupera a lista de bins (pastas) no projeto
    var rootBin = project.rootItem.children;
    var clipsToSort = [];

    // Função para percorrer os bins e encontrar os arquivos de vídeo
    function getClips(bin) {
        for (var i = 0; i < bin.numItems; i++) {
            var item = bin[i];
            if (item.type === ProjectItemType.CLIP) {
                // Verifica se o item é um arquivo de vídeo e retira o texto após o hífen
                var videoName = item.name;
                var parts = videoName.split('-');
                if (parts.length > 1) {
                    clipsToSort.push({
                        clip: item,
                        order: parseInt(parts[1].match(/\d+/), 10) // Extrai números do texto após o hífen
                    });
                }
            } else if (item.type === ProjectItemType.BIN) {
                getClips(item.children); // Recursivamente verificar para sub-bins
            }
        }
    }

    getClips(rootBin);

    // Ordena com base no número extraído (ordem crescente)
    clipsToSort.sort(function(a, b) {
        return a.order - b.order;
    });



    // Adiciona os clipes na timeline no final da sequência
    for (var j = 0; j < clipsToSort.length; j++) {
        var sortedClip = clipsToSort[j].clip;
        sequence.videoTracks[0].insertClip(sortedClip, sequence.end);
    }
})();